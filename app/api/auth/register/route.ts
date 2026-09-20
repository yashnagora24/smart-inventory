import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        const {name, email, password} = body;

        if (!name || !email || !password) {
            return Response.json(
                {
                    success: false,
                    message: "Name, Email and Password are required",
                },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return Response.json(
                {
                    success: false,
                    message: "Password must be at least 6 charcters",
                },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase(),
        })

        if (existingUser) {
            return Response.json(
                {
                    success: false,
                    message: "User already exists",
                },
                { status: 409}
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
        })

        return Response.json(
            {
                success: true,
                message: "User registered successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("Register error:", error);

        return Response.json(
            {
                success: false,
                message: "Failed to register user",
            },
            { status: 500 }
        )
    }
}