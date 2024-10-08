import express from 'express';
import {findRecipes, findRecipeByName, createRecipe} from '../models/recipes';

export const getAllRecipes = async (req: express.Request, res: express.Response) => {
    try{
        const recipes = await findRecipes();

        return res.status(200).json(recipes);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400) as any;
    }
}

export const createRecipeWhenNotExist = async (req: express.Request, res: express.Response) => {
    try {
        const {name, ingredients, instructions, prepTime, cookTime, servings, tags, allergens} = req.body;

        if (!name || !ingredients || !instructions || !prepTime || !cookTime || !servings || !tags){
            console.log("Not all mandatory fields provided!");
            return res.sendStatus(400) as any;
        }

        const existingRecipe = await findRecipeByName(name);

        if(existingRecipe) {
            console.log("This recipe alrady exists!");
            return res.sendStatus(400) as any;
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
        console.log(error);
        return res.sendStatus(400) as any;
    }
}