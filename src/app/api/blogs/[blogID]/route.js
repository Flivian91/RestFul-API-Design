// GET, PATCH and DELETE

import connectDB from "@/lib/db";
import Blog from "@/models/blogs";
import Category from "@/models/category";
import User from "@/models/users";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

// Get Single Blog based on user and category
export async function GET(req, segmentData) {
  try {
    // Get Blog ID from url
    const { blogID } = await segmentData.params;
    if (!blogID || !Types.ObjectId.isValid(blogID)) {
      return NextResponse.json(
        { status: "failed", message: "Invalid or Missing Blog ID" },
        { status: 400 }
      );
    }
    // Get CategoryID and UserID form SearchParams
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
    const user = await User.findById(userID);
    if (!user) {
      return NextResponse.json(
        { status: "failed", message: "User Not Found" },
        { status: 400 }
      );
    }
    const category = await Category.findById(categoryID);
    if (!category) {
      return NextResponse.json(
        { status: "failed", message: "No Category Found" },
        { status: 400 }
      );
    }
    const blog = await Blog.findOne({
      _id: blogID,
      category: categoryID,
      user: userID,
    });
    if (!blog) {
      return NextResponse.json(
        { status: "failed", message: "No Blog Found" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { status: "success", data: blog },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error Fetching Blog", error);
    return NextResponse.json(
      {
        status: "failed",
        message: "Error Fetching Blog",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// UPDATE Blog Data
export async function PATCH(req, segmentData) {
  try {
    // Get Blog ID from url
    const { blogID } = await segmentData.params;
    if (!blogID || !Types.ObjectId.isValid(blogID)) {
      return NextResponse.json(
        { status: "failed", message: "Invalid or Missing Blog ID" },
        { status: 400 }
      );
    }
    // Get CategoryID and UserID form SearchParams
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
    const user = await User.findById(userID);
    if (!user) {
      return NextResponse.json(
        { status: "failed", message: "User Not Found" },
        { status: 400 }
      );
    }
    const category = await Category.findById(categoryID);
    if (!category) {
      return NextResponse.json(
        { status: "failed", message: "No Category Found" },
        { status: 400 }
      );
    }
    const blog = await Blog.findOne({
      _id: blogID,
      category: category.id,
      user: user.id,
    });
    if (!blog) {
      return NextResponse.json(
        { status: "failed", message: "No blog Found" },
        { status: 400 }
      );
    }
    const body = await req.json();
    const data = { ...body, user: user.id, category: category.id };
    const updatedBlog = await Blog.findByIdAndUpdate(blogID, data, {
      new: true,
    });

    return NextResponse.json(
      {
        status: "success",
        message: "Blog Updated Successfully",
        data: updatedBlog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error Updating Blog", error);
    NextResponse.json(
      {
        status: "failed",
        message: "Error Updating Blog",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
export async function DELETE(req, segmentData) {
  try {
    // Get Blog ID from url
    const { blogID } = await segmentData.params;
    if (!blogID || !Types.ObjectId.isValid(blogID)) {
      return NextResponse.json(
        { status: "failed", message: "Invalid or Missing Blog ID" },
        { status: 400 }
      );
    }
    // Get CategoryID and UserID form SearchParams
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
    const user = await User.findById(userID);
    if (!user) {
      return NextResponse.json(
        { status: "failed", message: "User Not Found" },
        { status: 400 }
      );
    }
    const category = await Category.findById(categoryID);
    if (!category) {
      return NextResponse.json(
        { status: "failed", message: "No Category Found" },
        { status: 400 }
      );
    }
    const blog = await Blog.findOne({
      _id: blogID,
      category: category.id,
      user: user.id,
    });
    if (!blog) {
      return NextResponse.json(
        { status: "failed", message: "No blog Found" },
        { status: 400 }
      );
    }
    const deletedBlog = await Blog.findByIdAndDelete(blogID, { new: true });
    return NextResponse.json(
      {
        status: "success",
        message: "Blog Deleted Successfully",
        data: deletedBlog,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error Deleteing Blog", error);
    NextResponse.json(
      {
        status: "failed",
        message: "Error Deleteing Blog",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
