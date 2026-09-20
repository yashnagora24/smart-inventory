import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";

export async function GET() {
    try {
        await connectDB();

        const customers = await Customer.find().sort({
            createdAt: -1,
        })

        return Response.json(
            {
                success: true,
                customers,
            }
        )
    } catch (error) {
        console.error("GET customers error:", error);

        return Response.json(
            {
                success: false,
                message: "Failed to fetch customers",
            },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        const {name, phone, email, address } = body;

        if (!name || !phone) {
            return Response.json(
                {
                    success: false,
                    message: "Name and phone are required",
                },
                { status: 400 }
            )
        }

        const customer = await Customer.create({
            name,
            phone,
            email,
            address,
        })

        return Response.json(
            {
                success: true,
                message: "Customer created successfully",
                customer,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("POST customer error:", error)

        return Response.json(
            {
                success: false,
                message: "Failed to create customer",
            },
            { status: 500 }
        )
    }
}