import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import mongoose from "mongoose";

type RouteContext = {
    params: Promise<{ id: string}>;
};

export async function PUT(req: Request, context: RouteContext) {
    try {
        await connectDB();

        const { id } = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid product ID",
                },
                { status: 400}
            );
        }

        const body = await req.json();

        const { name, category, price, stock } = body

        if (
            !name ||
            !category ||
            price === undefined ||
            stock === undefined
        ) {
            return Response.json(
                {
                    success: false,
                    message: "All fields are required",
                },
                { status: 400}
            );
        }

        const product = await Product.findByIdAndUpdate(
            id,
            {
                name,
                category,
                price: Number(price),
                stock: Number(stock),
                status:
                    Number(stock) === 0
                    ? "Out of Stock"
                    : Number(stock) <= 10
                        ? "Low Stock"
                        : "In Stock",
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!product) {
            return Response.json(
                {
                    success: false,
                    message: "Product not found",
                },
                { status: 400}
            );
        }

        return Response.json({
            success: true,
            message: "Product updated successfully",
            product,
        });

    } catch (error) {
        console.error("PUT product error:", error);

        return Response.json(
            {
                success: false,
                message: "Failed to update product",
            },
            {status: 500}
        );
    }
}

export async function DELETE(req: Request, context: RouteContext) {
    try {
        await connectDB();

        const {id} = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid product ID",
                },
                { status: 400 }
            );
        }

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return Response.json({
                success: false,
                message: "Product not found",
            },
            { status: 404}
        );
        }

        return Response.json(
            {
                success: true,
                message: "Product deleted successfully",
            }
        );
    } catch (error) {
        console.error("DELETE product error:", error);

        return Response.json(
            {
                success: false,
                message: "Failed to delete product",
            },
            { status: 500 }
        );
    }
}