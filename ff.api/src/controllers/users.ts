import express from 'express';
import {findUsers, findUserByEmail, createUser, findUserById} from '../models/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try{
        const users = await findUsers();

        return res.status(200).json(users);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
}

export const createUserWhenNotExist = async (req: express.Request, res: express.Response) => {
    try {
        const {username, email, likes, dislikes, allergies} = req.body;

        if (!email || !username){
            return res.status(400).json({ message: "Username or email not provided!" });
        }

        const existingUser = await findUserByEmail(email);

        if(existingUser) {
            return res.status(400).json({ message: "User with this email already exists!" });
        }

        const user = await createUser({
            username,
            email,
            likes,
            dislikes,
            allergies
        });

        return res.status(200).json(user).end() as any;
    } catch (error) {
        return res.status(400).json({ message: error });
    }
}

export const getUserById = async (req: express.Request, res: express.Response) => {
    try{
        const {id} = req.params;

        const user = await findUserById(id);
        if(!user) {
            return res.status(404).json({ message: "User with this email does not exist!" });
        }


        return res.status(200).json(user).end() as any;
    } catch (error) {
        return res.status(400).json({ message: error });
    }
}