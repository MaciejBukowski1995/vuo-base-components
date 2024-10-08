import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    likes: { type: [String], default:  []}, 
    dislikes: { type: [String], default:  []},
    allergies: { type: [String], default:  []},
});

export const UserModel  = mongoose.model('User', UserSchema);

export const findUsers = () => UserModel.find();
export const findUserByEmail = (email: string) => UserModel.findOne({email});
export const findUserById = (id: string) => UserModel.findOne({_id : id});
export const createUser = (values: Record<string, any>) => new UserModel(values)
    .save().then((user) => user.toObject());
export const deleteUserById = (id: string) => UserModel.findByIdAndDelete({_id : id});