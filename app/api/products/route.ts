import { connectDB } from "@/lib/db"
import Product from "@/models/Product"

export async function GET() {
    try {
        await connectDB();

        const products = await Product.find().sort({createdAt: -1});

        return Response.json({
            success: true,
            products,
        });
    } catch (error) {
        console.error("GET products error:", error);

        return Response.json(
            {
                success: false,
                message: "Failed to fetch products",
            },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();

        const body = await request.json();

        const {name, category, price, stock} = body;

        if (!name || !category || price === undefined || stock === undefined) {
            return Response.json(
                {
                    success: false,
                    message: "All fields are requiresd",
                },
                { status: 400 }
            );
        }

        const product = await Product.create({
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
        });

        return Response.json(
            {
                success: true,
                message: "Product created successfully",
                product,
            },
            {status: 201 }
        );

    } catch (error) {
        console.error("POST product error:", error);

        return Response.json(
            {
                success: false,
                message: "Failed to create product",
            },
            { status: 500 }
        );
    }
}