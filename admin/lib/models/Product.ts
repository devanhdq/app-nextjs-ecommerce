import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
        title: {
            type: String
        },
        description: {
            type: String
        },
        media: [{
            type: String
        }],
        category: {
            type: String
        },
        collections: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection",
        }],
        tags: [{
            type: String
        }],
        sizes: [{
            type: String
        }],
        colors: [{
            type: String
        }],
        price: {
            type: mongoose.Schema.Types.Decimal128,
            get: (v: mongoose.Schema.Types.Decimal128) => parseFloat(v.toString())
        },
        expense: {
            type: mongoose.Schema.Types.Decimal128,
            get: (v: mongoose.Schema.Types.Decimal128) => parseFloat(v.toString())
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    }, {
        toJSON: {getters: true},
    }
);
const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;