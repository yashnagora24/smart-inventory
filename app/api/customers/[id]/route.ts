import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import mongoose from "mongoose";

type RouteContext = {
    params: Promise<{id: string}>;
}

export async function PUT(
    req: Request,
    constext: RouteContext
) {
    try {
        await connectDB();

        const {id} = await constext.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid customer ID",
                },
                { status: 400 }
            )
        }
        const body = await req.json();

        const {name, phone, email, address} = body

        if (!name || !phone) {
            return Response.json({
                success: false,
                message: "Name and phone are required",
            },
        { status: 400 }
    )
        }

        const customer = await Customer.findByIdAndUpdate(
            id,
            {
                name,
                phone,
                email,
                address,
            },
            {
                new: true,
                runValidators: true,
            }
        )

        if (!customer) {
            return Response.json({
                success: false,
                message: "Customer not fuund",
            },
        { status: 404} 
    )
        }

        return Response.json({
            success: true,
            message: "Customer updated successfully",
            customer,
        })
    } catch (error) {
        console.error("PUT customer error:", error);

        return Response.json(
            {
                success: false,
                message: "Failed to update customer",
            },
            { status: 500 }
        )
    }

}

export async function DELETE(
    req: Request,
    context: RouteContext
) {
    try {
        await connectDB();

        const {id} = await context.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid customer ID", 
                },
                { status: 400 }
            )
        }

        const customer = await Customer.findByIdAndDelete(id);

        if (!customer) {
            return Response.json(
                {
                    success: false,
                    message: "Customer not found",
                },
                { status: 404 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Customer Deleted Successfully",
            }
        )
    } catch (error) {
        console.error("DELETE customer error:", error)

        return Response.json(
            {
                success: false,
                message: "Failed to delete customer",
            },
            { status: 500 }
        )
    }
}