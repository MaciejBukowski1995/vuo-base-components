import express from 'express';
import {findUsers, findUserByEmail, createUser, findUserById} from '../models/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try{
        const users = await findUsers();

        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400) as any;
    }
}

export const createUserWhenNotExist = async (req: express.Request, res: express.Response) => {
    try {
        const {username, email, likes, dislikes, allergies} = req.body;

        if (!email || !username){
            return res.sendStatus(400) as any;
        }

        const existingUser = await findUserByEmail(email);

        if(existingUser) {
            return res.sendStatus(400) as any;
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
        console.log(error);
        return res.sendStatus(400) as any;
    }
}

export const getUserById = async (req: express.Request, res: express.Response) => {
    try{
        const {id} = req.params;

        const user = await findUserById(id);
        if(!user) {
            console.log("User with this email does not exist!");
            return res.sendStatus(400) as any;
        }


        return res.status(200).json(user).end() as any;
    } catch (error) {
        console.log(error);
        return res.sendStatus(400) as any;
    }
}