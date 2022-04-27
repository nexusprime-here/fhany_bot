import mongoose from "mongoose";

export default mongoose.model<{ id: string, money: number }>('User', new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    money: {
        type: Number,
        required: true
    }
}));