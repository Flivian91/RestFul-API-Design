// GET AND POST Blogs

import connectDB from "@/lib/db";
import Blog from "@/models/blogs";
import Category from "@/models/category";
import User from "@/models/users";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // get all Blogs
    await connectDB();
    const blogs = await Blog.find();
    return NextResponse.json(
      { status: "success", data: blogs },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error Fetching Blogs", error);
    return NextResponse.json(
      {
        status: "failed",
        message: "Error Fecthing Blogs",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST
export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userID = searchParams.get("userID");
    const categoryID = searchParams.get("categoryID");
    if (!userID || !Types.ObjectId.isValid(userID)) {
      return NextResponse.json(
        { status: "failed", message: "Invalid or Missing User ID" },
        { status: 400 }
      );
    }
    if (!categoryID || !Types.ObjectId.isValid(categoryID)) {
      return NextResponse.json(
        { status: "failed", message: "Invalid or Missing Category ID" },
        { status: 400 }
      );
    }
    // Connect to the database
    await connectDB();
    // Fetch userID
    const user = await User.findById(userID);
    if (!user) {
      return NextResponse.json(
        { status: "failed", message: "User Not Found" },
        { status: 400 }
      );
    }
    // Fetch Category
    const category = await Category.findById(categoryID);
    if (!category) {
      return NextResponse.json(
        { status: "failed", message: "Category Not Found" },
        { status: 400 }
      );
    }
    const { title, description } = await req.json();

    const newBlog = await Blog.insertOne({
      title,
      description,
      category: category.id,
      user: user.id,
    });
    return NextResponse.json(
      { status: "success", data: newBlog },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error Creating Blog", error);
    return NextResponse.json(
      {
        status: "failed",
        message: "Error Creating Blog",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
