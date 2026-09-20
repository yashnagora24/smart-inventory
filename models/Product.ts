import mongoose, {Schema, Model} from "mongoose";

export interface IProduct {
    name: string;
    category: string;
    price: number;
    stock: number;
    status: "In Stock" | "Low Stock" | "Out of Stock";
}

const productSchema = new Schema<IProduct>(
    {
        name:{
            type: String,
            required: true,
            trim: true,
        },

        category:{
            type: String,
            required: true,
            trim: true,
        },

        price:{
            type: Number,
            required: true,
            min: 0,
        },

        stock:{
            type: Number,
            required: true,
            min: 0,
        },

        status:{
            type: String,
            enum: ["In Stock", "Low Stock", "Out of Stock"],
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Product: Model<IProduct> =
    mongoose.models.Product ||
    mongoose.model<IProduct>("Product", productSchema);

export default Product;
