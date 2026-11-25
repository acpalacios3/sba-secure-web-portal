import mongoose, { Schema } from "mongoose";

// This is the model 
const bookMarkSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    url: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    descripcion:{
         type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }

});

const Bookmark = mongoose.model("Bookmark", bookMarkSchema);

export default Bookmark;
