import mongoose, {Schema, Model} from "mongoose";

export interface IPurchase {
    supplierName: string;
    productId: mongoose.Types.ObjectId;
    productName: string;
    quantity: number;
    price: number;
    totalAmount: number;
    status: "Completed" | "Pending";
}

const purchaseSchema = new Schema<IPurchase>(
    {
        supplierName: {
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
)

const Purchase: Model<IPurchase> =
    mongoose.models.Purchase ||
    mongoose.model<IPurchase>("Purchase", purchaseSchema);


export default Purchase;