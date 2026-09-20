import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Purchase from "@/models/Purchase";

export async function GET() {
    try {
        await connectDB();

        const purchases = await Purchase.find().sort({
            createdAt: -1,
        });

        return Response.json({
            success: true,
            purchases,
        })

    } catch (error) {
        console.error("GET purchases error:", error);

        return Response.json(
            {
                success: false,
                message: "Failed to fetch purchases",
            },
            { status: 500 }
        )
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        const {
            supplierName,
            productId,
            quantity,
            price,
        } = body;

        // Check required fields
        if (
            !supplierName ||
            !productId ||
            quantity === undefined ||
            price === undefined
        ) {
            return Response.json(
                {
                    success: false,
                    message: "Supplier name, product ID, quantity and price are required",
                },
                { status: 400 }
            )
        }

        const purchaseQuantity = Number(quantity);
        const purchasePrice = Number(price);

        // Validate quantity

        if (
            !Number.isInteger(purchaseQuantity) ||
            purchaseQuantity < 1
        ) {
            return Response.json(
                {
                    success: false,
                    message: "Quantity must be a positive integer",
                },
                { status: 400 }
            )
        }

        // Validate Price

        if (!Number.isFinite(purchasePrice) || purchasePrice < 0) {
            return Response.json(
                {
                    success: false,
                    message: "Price must be a valid positive number",
                },
                { status: 400 }
            )
        }

        // Increase product stock
        const product = await Product.findByIdAndUpdate(
        productId,
        {
            $inc: {
                stock: purchaseQuantity,
            },
        },
        {
            new: true,
        }
    )

    if (!product) {
        return Response.json(
            {
                success: false,
                message: "Product not found",
            },
            { status: 404 }
        )
    }

    // Update product status

    product.status = 
        product.stock === 0
            ? "Out of Stock"
            : product.stock <= 10
            ? "Low Stock"
            : "In Stock";

    await product.save();

    // Calculate total
    const totalAmount = purchaseQuantity * purchasePrice;

    //create purchase record
    const purchase = await Purchase.create({
        supplierName,
        productId: product._id,
        productName: product.name,
        quantity: purchaseQuantity,
        price: purchasePrice,
        totalAmount,
        status: "Completed",
    })

    return Response.json(
        {
            success: true,
            message: "Purchase created successfully",
            purchase,
            updatedProduct: product,
        },
        { status: 201 }
    )

    } catch (error) {
        console.error("POST purchase error:", error);

        return Response.json(
            {
                success: false,
                message: "Failed to create purchase",
            },
            { status: 500 }
        )
    }
}