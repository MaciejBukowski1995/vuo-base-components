import mongoose from 'mongoose';

const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true},
    users: { type: [String], default: []}, // list of users emails
});

export const GroupModel  = mongoose.model('Group', GroupSchema);

export const findGroups = () => GroupModel.find();
export const findGroupByName = (name: string) => GroupModel.findOne({name});
export const findGroupById = (id: string) => GroupModel.findOne({_id : id});
export const createGroup = (values: Record<string, any>) => new GroupModel(values)
    .save().then((group) => group.toObject());
export const deleteGroupById = (id: string) => GroupModel.findByIdAndDelete({_id : id});
export const addUserToGroupByIdAndEmail = (id: string, email: string) => {
    return GroupModel.findByIdAndUpdate(
        {_id : id},
        { $addToSet: { users: email } }, // Add the email to the users array if it's not already there
        { new: true } // Return the updated document
    );
};