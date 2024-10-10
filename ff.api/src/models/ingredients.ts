import mongoose from 'mongoose';

const IngredientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: String, required: true },
    unit: { type: String }
});

export default IngredientSchema;
