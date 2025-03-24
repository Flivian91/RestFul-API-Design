//GET, PATCH and DELETE

import connectDB from "@/lib/db";
import Category from "@/models/category";
import User from "@/models/users";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

// Get A single Category
export async function GET(req, segmentData) {
  try {
    // Fetch Category ID from URl
    const { categoryID } = await segmentData.params;
    if (!categoryID || !Types.ObjectId.isValid(categoryID)) {
      return NextResponse.json(
        { status: "failed", message: "Invalid or missing category ID" },
        { status: 400 }
      );
    }
    // Connect to the database
    await connectDB();
    // Make sure the correct user is fetching the category
    const { searchParams } = new URL(req.url);
    const userID = searchParams.get("userID");
    if (!userID || !Types.ObjectId.isValid(userID)) {
      return NextResponse.json(
        { status: "failed", message: "Invalid or missing User ID" },
        { status: 400 }
      );
    }
    const user = await User.findById(userID);
    if (!user) {
      return NextResponse.json(
        { status: "failed", message: "No User Found" },
        { status: 400 }
      );
    }
    // Find the Category with ID
    const category = await Category.findOne({ _id: categoryID, user: user.id });
    if (!category || category.length === 0) {
      return NextResponse.json(
        { status: "failed", message: "No Category Found" },
        { status: 400 }
      );
    }
    // return Success
    return NextResponse.json(
      { status: "success", data: category },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error Fetching User", error);
    return NextResponse.json(
      {
        status: "failed",
        message: "Error Fetching User",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Update Category data
export async function PATCH(req, segmentData) {
  try {
    // Fetch category ID from the url
    const { categoryID } = await segmentData.params;
    if (!categoryID || !Types.ObjectId.isValid(categoryID)) {
      return NextResponse.json(
        { status: "failed", message: "Invalid or missing category ID" },
        { status: 400 }
      );
    }
    // Connect to the database
    await connectDB();
    // check user who is updating the category if there the one who uploaded the category
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
        { status: "failed", message: "User Not Found" },
        { status: 404 }
      );
    }
    // Check if category exists
    const category = await Category.findOne({ _id: categoryID, user: user.id });
    if (!category || category.length === 0) {
      return NextResponse.json(
        { status: "failed", message: "No category Found" },
        { status: 404 }
      );
    }
    // Update Category
    const body = await req.json();
    const newCategory = await Category.findByIdAndUpdate(categoryID, body, {
      upsert: false,
      new: true,
    });
    return NextResponse.json(
      {
        status: "success",
        message: "Category Updated Successfully",
        data: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error Updating Category", error);
    return NextResponse.json(
      {
        status: "failed",
        message: "Error Updating Category",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
// DELETE Category
export async function DELETE(req, segmentData) {
  try {
    // Get the Category ID from the URL
    const { categoryID } = await segmentData.params;
    if (!categoryID || !Types.ObjectId.isValid(categoryID)) {
      return NextResponse.json(
        {
          status: "failed", 
          message: "Invalid or missing category ID",
        },
        { status: 400 }
      );
    }
    // Connect to database
    await connectDB();
    // Get the current User
    const { searchParams } = new URL(req.url);
    const userID = searchParams.get("userID");
    if (!userID || !Types.ObjectId.isValid(userID)) {
      return NextResponse.json(
        { status: "failed", message: "Invalid or Missing User ID" },
        { status: 400 }
      );
    }
    // find user data
    const user = await User.findById(userID);
    if (!user) {
      return NextResponse.json(
        { status: "failed", message: "No user Found" },
        { status: 400 }
      );
    }
    // Get the category to be deleted
    const category = await Category.findOne({ _id: categoryID, user: userID });
    if (!category || category.length === 0) {
      return NextResponse.json(
        { status: "failed", message: "No category Found" },
        { status: 400 }
      );
    }
    // Delete the Category
    const deletedCategory = await Category.findByIdAndDelete(categoryID);
    return NextResponse.json(
      {
        status: "success",
        message: "Category Deleted successfully",
        data: deletedCategory,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error Deleting Category", error);
    return NextResponse.json(
      {
        status: "failed",
        message: "Error deleting Category",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
