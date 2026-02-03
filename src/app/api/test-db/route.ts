import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        console.log("Testing DB connection...");
        const userCount = await prisma.user.count();
        console.log("User count:", userCount);
        return NextResponse.json({ status: "ok", userCount });
    } catch (error: any) {
        console.error("DB Connection Error:", error);
        return NextResponse.json({ status: "error", message: error.message, stack: error.stack }, { status: 500 });
    }
}
