import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: [String], required: true }, // assuming array of image URLs
    category: { type: String, required: true },
    subCategory: { type: String, required: false },
    sizes: { type: [String], required: true }, // assuming sizes like 'S', 'M', 'L'
    BestSeller: { type: Boolean, default: true },
    date: { type: Number, required: true } // might want to use Date instead
});

const productModel=  mongoose.models.product || mongoose.model("product",productSchema);


export default productModel