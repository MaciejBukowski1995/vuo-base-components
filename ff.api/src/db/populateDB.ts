import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Command } from 'commander';
import  { readFileSync }  from 'fs';
import { UserModel } from '../models/users';
import { GroupModel } from '../models/groups';
import { RecipeModel } from '../models/recipes';

// Load environment variables from .env file
dotenv.config();

const program = new Command();

program
  .option('-u, --users', 'populate users')
  .option('-r, --recipes', 'populate recipes')
  .option('-g, --groups', 'populate groups')
  .parse(process.argv);

const options = program.opts();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        throw new Error('MONGO_URI is not defined in the environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1);
  }
};

// Load JSON data from a file
const loadDataFromFile = (filePath: string) => {
  const data = readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

// Remove existing users
const clearUsers = async () => {
  await UserModel.deleteMany({});
  console.log('All users have been removed.');
};

// Remove existing recipes
const clearRecipes = async () => {
  await RecipeModel.deleteMany({});
  console.log('All recipes have been removed.');
};

// Remove existing groups
const clearGroups = async () => {
  await GroupModel.deleteMany({});
  console.log('All groups have been removed.');
};

// Populate Users
const populateUsers = async () => {
  const usersFilePath = process.env.USERS_FILE_PATH;
  if (!usersFilePath) {
    throw new Error('USERS_FILE_PATH is not defined in the environment variables');
  }
  const users = loadDataFromFile(usersFilePath);
  await UserModel.insertMany(users);  // Insert all users at once
  console.log(`${users.length} users have been populated successfully.`);
};

// Populate Recipes
const populateRecipes = async () => {
  const recipesFilePath = process.env.RECIPES_FILE_PATH;
  if (!recipesFilePath) {
    throw new Error('RECIPES_FILE_PATH is not defined in the environment variables');
  }
  const recipes = loadDataFromFile(recipesFilePath);
  await RecipeModel.insertMany(recipes);  // Insert all recipes at once
  console.log(`${recipes.length} recipes have been populated successfully.`);
};

// Populate Groups
const populateGroups = async () => {
  const groupsFilePath = process.env.GROUPS_FILE_PATH;
  if (!groupsFilePath) {
    throw new Error('GROUPS_FILE_PATH is not defined in the environment variables');
  }
  const groups = loadDataFromFile(groupsFilePath);
  await GroupModel.insertMany(groups);  // Insert all groups at once
  console.log(`${groups.length} groups have been populated successfully.`);
};

// Main function to run the script
const main = async () => {
  await connectDB();

  if (options.users) {
    await clearUsers();   
    await populateUsers();
  }

  if (options.recipes) {
    await clearRecipes();
    await populateRecipes();
  }

  if (options.groups) {
    await clearGroups(); 
    await populateGroups();
  }

  mongoose.disconnect();
  process.exit(0);
};

// Run the main function
main().catch((error) => {
  console.error('Error populating database:', error);
  mongoose.disconnect();
  process.exit(1);
});
