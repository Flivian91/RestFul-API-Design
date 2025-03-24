// GET and POST

import connectDB from "@/lib/db";
import Category from "@/models/category";
import User from "@/models/users";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userID = searchParams.get("userID");

    if (!userID || !Types.ObjectId.isValid(userID)) {
      return NextResponse.json(
        { status: "failed", message: "Invalid or Missing User ID" },
        { status: 400 }
      );
    }
    const user = await User.findById(userID);
    if (!user) {
      return NextResponse.json(
        { status: "failed", message: "User not found in the database" },
        { status: 400 }
      );
    }
    const categories = await Category.find({
      user: userID,
    });
    return NextResponse.json(
      { status: "success", data: categories },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error Fetching Categories", error);
    return NextResponse.json(
      {
        status: "failed",
        message: "Error Fetchin Categories",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Create New Categories
export async function POST(req) {
  try {
    await connectDB();
    const { title } = await req.json();
    const { searchParams } = new URL(req.url);
    const userID = searchParams.get("userID");
    if (!title) {
      return NextResponse.json(
        { status: "failed", message: "Category Title is required" },
        { status: 400 }
      );
    }
    if (!userID || !Types.ObjectId.isValid(userID)) {
      return NextResponse.json(
        { status: "failed", message: "Invalid or Missing User ID" },
        { status: 400 }
      );
    }
    const user = await User.findById(userID);
    if (!user) {
      return NextResponse.json(
        { status: "failed", message: "User Not found in the database" },
        { status: 400 }
      );
    }

    const newCategory = await Category.insertOne({ title, user: user.id });
    return NextResponse.json(
      {
        status: "success",
        message: "Category Created Successfully",
        data: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error Creating Categories", error);
    return NextResponse.json(
      {
        status: "failed",
        message: "Error in Creating Category",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
