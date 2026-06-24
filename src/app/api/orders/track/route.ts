import { NextRequest, NextResponse } from "next/server";
import { getOrderByNumberAndToken } from "@/services/orders.service";

export async function GET(request: NextRequest) {
  const orderNumber = request.nextUrl.searchParams.get("orderNumber");
  const token = request.nextUrl.searchParams.get("token");

  if (!orderNumber || !token) {
    return NextResponse.json(
      { error: "Order number and token are required" },
      { status: 400 }
    );
  }

  try {
    const order = await getOrderByNumberAndToken(orderNumber, token);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Track order API error:", error);
    return NextResponse.json(
      { error: "Failed to track order" },
      { status: 500 }
    );
  }
}
