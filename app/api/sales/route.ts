import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Sale from "@/models/Sale";

export async function GET() {
    try {
        await connectDB();

        const sales = await Sale.find().sort({ createdAt: -1 });

        return Response.json({
            success: true,
            sales,
        });
    } catch (error) {
        console.error("GET sales error", error);

        return Response.json({
            success: false,
            message: "Failed to fetch sales",
        }, {
            status: 500,
        });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();

        const body = await request.json();

        const {
            customerName,
            productId,
            quantity,
        } = body;

        if (!customerName || !productId || quantity === undefined){
            return Response.json(
                {
                    success: false,
                    message: "Customer name, product ID and quantity are required",
                }, {
                    status: 400,
                }
            );
        }

        const saleQuantity = Number(quantity)

        if (!Number.isInteger(saleQuantity) || saleQuantity < 1) {
            return Response.json(
                {
                    success: false,
                    message: "Quantity must be a positive integer",
                }, {
                    status: 400,
                }
            )
        }

        // Find product and decrease stock atomically

        const product = await Product.findOneAndUpdate(
            {
                _id: productId,
                stock: { $gte: saleQuantity },
            },
            {
                $inc: { stock: -saleQuantity },
            },
            {
                new: true,
            }
        );

        if (!product) {
            return Response.json(
                {
                    success: false,
                    message: "Product not found or insufficient stock",
                },
                {status: 400}
            );
        }

        // Calulate total amount

        const totalAmount = product.price * saleQuantity;

        // Update product status

        product.status = product.stock === 0 ? "Out of Stock" : product.stock <= 10 ? "Low Stock" : "In Stock";

        await product.save();

        // Create sale

        const sale = await Sale.create({
            customerName,
            productId: product._id,
            productName: product.name,
            quantity: saleQuantity,
            price: product.price,
            totalAmount,
            status: "Completed",
        });

        return Response.json({
            success: true,
            message: "Sale created successfully",
            sale,
            updatedProduct: product,
        },
        { status: 201 }
    );
    } catch (error) {
        console.error("POST sale error:", error);

        return Response.json(
            {
                success: false,
                message: "Failed to create sale",
            },
            { status: 500 }
        )
    }
}