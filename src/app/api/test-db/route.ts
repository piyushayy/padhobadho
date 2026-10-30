import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userCount = await prisma.user.count();
        return NextResponse.json({ status: "ok", userCount });
    } catch (error: any) {
        console.error("DB Connection Error:", error);
        return NextResponse.json({ status: "error", message: "Database connection failed" }, { status: 500 });
    }
}
