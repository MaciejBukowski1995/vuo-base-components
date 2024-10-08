import express from "express";

import { getAllUsers, createUserWhenNotExist, getUserById } from '../controllers/users';
import { createGroupWhenNotExist, getAllGroups, addUserToGroup, getGroupById } from "../controllers/groups";
import { createRecipeWhenNotExist, getAllRecipes } from "../controllers/recipes";
const router = express.Router();

router.get("/users", getAllUsers);
router.get("/user/:id", getUserById);
router.post("/user", createUserWhenNotExist);


router.get("/groups", getAllGroups);
router.post("/group", createGroupWhenNotExist);
router.get("/group/:id", getGroupById);
router.patch("/group/:id", addUserToGroup);


router.get("/recipes", getAllRecipes);
router.post("/recipe", createRecipeWhenNotExist);

export default router;
