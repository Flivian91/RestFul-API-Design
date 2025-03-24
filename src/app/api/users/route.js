import connectDB from "@/lib/db";
import User from "@/models/users";
import { NextResponse } from "next/server";

// Get all the Users
export async function GET(req) {
  try {
    await connectDB();
    const user = await User.find();
    return NextResponse.json({ status: "success", user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        status: "failed",
        message: "Error Fetching Users",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Create a User
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const newUser = await User.insertOne(body);
    return NextResponse.json(
      {
        status: "success",
        message: "User created Successfully",
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "failed",
        message: "Error Creating User",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
