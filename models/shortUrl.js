import mongoose from "mongoose";
import shortId from "shortid";


const UrlSchema = new mongoose.Schema({
    full: {
        type: String,
        require: true
    },
    short: {
        type: String,
        required: true,
        default: shortId.generate
    },
    clicks: {
        type: Number,
        required: true,
        default: 0
    }
})

export default mongoose.model('urls', UrlSchema)