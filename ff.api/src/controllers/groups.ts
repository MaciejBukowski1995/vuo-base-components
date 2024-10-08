import express from 'express';
import {findGroups, findGroupById, findGroupByName, createGroup, addUserToGroupByIdAndEmail} from '../models/groups';
import {findUserByEmail} from '../models/users';

export const getAllGroups = async (req: express.Request, res: express.Response) => {
    try{
        const groups = await findGroups();

        return res.status(200).json(groups);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400) as any;
    }
}

export const createGroupWhenNotExist = async (req: express.Request, res: express.Response) => {
    try {
        const {name, users,} = req.body;

        if (!name ){
            return res.sendStatus(400) as any;
        }

        const existingGroup = await findGroupByName(name);

        if(existingGroup) {
            return res.sendStatus(400) as any;
        }

        const group = await createGroup({
            name,
            users,
        });

        return res.status(200).json(group).end() as any;
    } catch (error) {
        console.log(error);
        return res.sendStatus(400) as any;
    }
}

export const addUserToGroup = async (req: express.Request, res: express.Response) => {
    try{
        const {id} = req.params;
        const {email} = req.body;


        console.log(req.body.email);

        if (!email){
            console.log("Email not provided!");
            return res.sendStatus(400) as any;
        }

        const user = await findUserByEmail(email);
        if(!user) {
            console.log("User with this email does not exist!");
            return res.sendStatus(400) as any;
        }

        const group = await addUserToGroupByIdAndEmail(id, email);
        if(!group) {
            console.log("Group with this id does not exist!");
            return res.sendStatus(400) as any;
        }

        return res.status(200).json(group).end() as any;
    } catch (error) {
        console.log(error);
        return res.sendStatus(400) as any;
    }
}

export const getGroupById = async (req: express.Request, res: express.Response) => {
    try{
        const {id} = req.params;
        const group = await findGroupById(id);
        if(!group) {
            console.log("Group with this id does not exist!");
            return res.sendStatus(400) as any;
        }


        return res.status(200).json(group).end() as any;
    } catch (error) {
        console.log(error);
        return res.sendStatus(400) as any;
    }
}