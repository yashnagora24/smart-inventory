import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        await connectDB()

        const body = await req.json();

        const {email, password} = body;

        if (!email || !password) {
            return Response.json(
                {
                    success: false,
                    message: "email and password are required",
                },
                { status: 400}
            )
        }
        
        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "Invailed email or password",
                },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        )

        if (!isPasswordValid) {
            return Response.json(
                {
                    success: false,
                    message: "Invailed email or password",
                },
                { status: 401 }
            )
        }

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "Invailed email or password",
                },
                { status: 401 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Login successful",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
            }
        )
    } catch (error) {
        console.error("Login error:", error);

        return Response.json(
            {
                success: false,
                message: "Failed to login",
            },
            { status: 500 }
        )
    }
}