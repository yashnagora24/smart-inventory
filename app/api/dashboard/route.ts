import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import Sale from "@/models/Sale";

export async function GET() {
  try {
    await connectDB();

    const totalProducts = await Product.countDocuments();

    const outOfStockProducts = await Product.countDocuments({
      status: "Out of Stock",
    });

    // Sales stats

    const totalSales = await Sale.countDocuments();

    const revenueResult = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Recent sales
    const recentSales = await Sale.find().sort({ createdAt: -1 }).limit(5);

    const lowStockProducts = await Product.find({
      status: "Low Stock",
    })
      .sort({ stock: 1 })
      .limit(5);

      const monthlySales = await Sale.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt"},
            },
            revenue: {
              $sum: "$totalAmount",
            },
            sales: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            "-id.year": 1,
            "_id.month": 1,
          },
        },
      ]);
      
    return Response.json({
      success: true,
      Stats: {
        totalProducts,
        lowStockProducts: await Product.countDocuments({
          status: "Low Stock",
        }),
        outOfStockProducts,
        totalSales,
        totalRevenue,
      },

      recentSales,
      lowStockProducts,
      monthlySales,
    });
  } catch (error) {
    console.error("Dashbord API error:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch Dashboard data",
      },
      { status: 500 },
    );
  }
}
