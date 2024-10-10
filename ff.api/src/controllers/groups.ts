import express from 'express';
import {findGroups, findGroupById, findGroupByName, createGroup, addUserToGroupByIdAndEmail} from '../models/groups';
import {findUserByEmail} from '../models/users';

export const getAllGroups = async (req: express.Request, res: express.Response) => {
    try{
        const groups = await findGroups();

        return res.status(200).json(groups);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
}

export const createGroupWhenNotExist = async (req: express.Request, res: express.Response) => {
    try {
        const {name, users,} = req.body;

        if (!name ){
            return res.status(400).json({ message: "Group name not provided!" });
        }

        const existingGroup = await findGroupByName(name);

        if(existingGroup) {
            return res.status(400).json({ message: "Group already exists!" });
        }

        const group = await createGroup({
            name,
            users,
        });

        return res.status(200).json(group).end();
    } catch (error) {
        return res.status(400).json({ message: error });
    }
}

export const addUserToGroup = async (req: express.Request, res: express.Response) => {
    try{
        const {id} = req.params;
        const {email} = req.body;


        console.log(req.body.email);

        if (!email){
            return res.status(400).json({ message: "Email not provided!" });
        }

        const user = await findUserByEmail(email);
        if(!user) {
            return res.status(400).json({ message: "User with this email does not exist!" });
        }

        const group = await addUserToGroupByIdAndEmail(id, email);
        if(!group) {
            return res.status(404).json({ message: "Group with this id does not exist!" });
        }

        return res.status(200).json(group).end() as any;
    } catch (error) {
        return res.status(400).json({ message: error });
    }
}

export const getGroupById = async (req: express.Request, res: express.Response) => {
    try{
        const {id} = req.params;
        const group = await findGroupById(id);
        if(!group) {
            return res.status(404).json({ message: "Group with this id does not exist!" });
        }


        return res.status(200).json(group).end() as any;
    } catch (error) {
        return res.status(400).json({ message: error });
    }
}