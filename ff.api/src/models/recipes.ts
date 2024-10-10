import mongoose from 'mongoose';

import IngredientSchema from '../models/ingredients';

const RecipeSchema = new mongoose.Schema({
    name: { type: String, required: true},
    ingredients: { type: [IngredientSchema], required: true },// make ingredient model
    instructions: { type: [String], required: true },
    prepTime: { type: String, required: true },
    cookTime: { type: String, required: true },
    servings: { type: String, required: true },
    tags: { type: [String], required: true },
    allergens: { type: [String]},
});

export const RecipeModel  = mongoose.model('Recipe', RecipeSchema);

export const findRecipes = () => RecipeModel.find();
export const findRecipesByTypeRespectingAllergies = (type: string, allergies: string[]) => RecipeModel.find({
    tags: type,
    allergens:  { $not: { $in: allergies } }
});
export const findRecipeByName = (name: string) => RecipeModel.findOne({name});
export const findRecipeById = (id: string) => RecipeModel.findOne({_id : id});
export const createRecipe= (values: Record<string, any>) => new RecipeModel(values)
    .save().then((recipe) => recipe.toObject());
export const deleteRecipeById = (id: string) => RecipeModel.findByIdAndDelete({_id : id});