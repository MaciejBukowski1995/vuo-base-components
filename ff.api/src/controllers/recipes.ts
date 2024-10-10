import express from 'express';
import {findRecipes, findRecipeByName, createRecipe, findRecipesByTypeRespectingAllergies} from '../models/recipes';
import { findGroupById } from '../models/groups';
import { findUsersByEmails } from '../models/users';

export const getAllRecipes = async (req: express.Request, res: express.Response) => {
    try{
        const recipes = await findRecipes();

        return res.status(200).json(recipes);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
}

export const createRecipeWhenNotExist = async (req: express.Request, res: express.Response) => {
    try {
        const {name, ingredients, instructions, prepTime, cookTime, servings, tags, allergens} = req.body;

        if (!name || !ingredients || !instructions || !prepTime || !cookTime || !servings || !tags){
            return res.status(400).json({ message: "Not all mandatory fields provided!" });
        }

        const existingRecipe = await findRecipeByName(name);

        if(existingRecipe) {
            return res.status(400).json({ message: "This recipe alrady exists!" });
        }

        const recipe = await createRecipe({
            name,
            ingredients,
            instructions,
            prepTime,
            cookTime,
            servings,
            tags,
            allergens
        });

        return res.status(200).json(recipe).end() as any;
    } catch (error) {
        return res.status(400).json({ message: error });
    }
}

const countMatches = (preferences: string[], recipeTags: string[]): number => {
    return recipeTags.filter(tag => 
        preferences.some(preference => tag.toLowerCase().includes(preference.toLowerCase()))
    ).length;
};

const getMeals = async (allergies: string[], likes: string[], dislikes: string[], type: string, amount: number) => {
    // Get recipes based on type and allergies
    const recipes = await findRecipesByTypeRespectingAllergies(type, allergies);

    const recipeTuples = recipes.map((recipe) => {
        console.log(recipe.name);
        // Count the matches  and unmatches using the recipe's tags
        const matchCount = countMatches(likes, recipe.tags);
        const unMatchCount = countMatches(dislikes, recipe.tags);
        const totalCount = matchCount - unMatchCount;
        // Return a new tuple with the original recipe and updated rank
        return [recipe, totalCount]; // Create a tuple of (recipe, matchCount)
    });

    const sortedRecipeTuples = recipeTuples.sort((a, b) => {
        return Number(b[1]) - Number(a[1]); // Sort by rank in descending order
    });

    return sortedRecipeTuples.slice(0, amount).map(tuple => tuple[0]);
};


export const getFiveRecipesByGroupIdAndType = async (req: express.Request, res: express.Response) => {
    try{
        const { id } = req.params;
        let type: string = 'Lunch'; // Default to 'lunch'
        if (typeof req.query.type === 'string') {
            type = req.query.type; // Only assign if it is a string
        }

        const group = await findGroupById(id);
        if (!group) {
            return res.status(400).json({ message: "Group with this id does not exist!" });
        }

        const users = await findUsersByEmails(group.users);
        if (!users || users.length === 0) { // Check if users array is empty
            return res.status(400).json({ message: "Users not found!" });
        }

        // Flatten and get unique allergies
        const allAllergies = users.flatMap(user => user ? user.allergies : []).filter(Boolean);
        const uniqueAllergies = Array.from(new Set(allAllergies));

        // Flatten and get unique dislikes
        const allDislikes = users.flatMap(user => user ? user.dislikes : []).filter(Boolean);
        const uniqueDislikes = Array.from(new Set(allDislikes));

        // Flatten and get unique likes
        const allLikes = users.flatMap(user => user ? user.likes : []).filter(Boolean);
        const uniqueLikes = Array.from(new Set(allLikes));

        const fiveMeals = await getMeals(uniqueAllergies, uniqueLikes, uniqueDislikes, type, 5);

        return res.status(200).json(fiveMeals);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
}

export const getFourteenDaysRecipesByGroupIdAndType = async (req: express.Request, res: express.Response) => {
    try{
        const { id } = req.params;

        const group = await findGroupById(id);
        if (!group) {
            return res.status(400).json({ message: "Group with this id does not exist!" });
        }

        const users = await findUsersByEmails(group.users);
        if (!users || users.length === 0) { // Check if users array is empty
            return res.status(400).json({ message: "Users not found!" });
        }

        // Flatten and get unique allergies
        const allAllergies = users.flatMap(user => user ? user.allergies : []).filter(Boolean);
        const uniqueAllergies = Array.from(new Set(allAllergies));

        // Flatten and get unique dislikes
        const allDislikes = users.flatMap(user => user ? user.dislikes : []).filter(Boolean);
        const uniqueDislikes = Array.from(new Set(allDislikes));

        // Flatten and get unique likes
        const allLikes = users.flatMap(user => user ? user.likes : []).filter(Boolean);
        const uniqueLikes = Array.from(new Set(allLikes));

        const fourteenBreakfasts = await getMeals(uniqueAllergies, uniqueLikes, uniqueDislikes, "Breakfast", 14);
        const fourteenLunches = await getMeals(uniqueAllergies, uniqueLikes, uniqueDislikes, "Lunch", 14);
        const fourteenDinners = await getMeals(uniqueAllergies, uniqueLikes, uniqueDislikes, "Dinner", 14);

        return res.status(200).json([...fourteenBreakfasts, ...fourteenLunches, ...fourteenDinners]);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
}