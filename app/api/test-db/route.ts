import { connectDB } from "@/lib/db";

export async function GET() {
    try {
        await connectDB();

        return Response.json({
            success: true,
            message: "MongoDB connected successfully!",
        });
    } catch (error) {
        console.error("MongoDB cennection error:", error);

        return Response.json(
            {
                success: false,
                message: "MongoDB cennection failed!",
                error: error instanceof Error ? error.message : String(error),
            },
            {status: 500}
        );
    }
}