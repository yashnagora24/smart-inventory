import mongoose, { Schema , Model} from "mongoose";

export interface ISale {
    customerName: string;
    productId: mongoose.Types.ObjectId;
    productName: string;
    quantity: number;
    price: number;
    totalAmount: number;
    status: "Completed" | "Pending";
}

const SalesSchema = new Schema<ISale>(
    {
        customerName: {
            type: String,
            required: true,
            trim: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        productName: {
            type: String,
            required: true,
            trim: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ["Completed", "Pending"],
            default: "Completed",
        },
    },
    {
        timestamps: true,
    }
);

const Sale: Model<ISale> = mongoose.models.Sale || mongoose.model<ISale>("Sale", SalesSchema);

export default Sale;