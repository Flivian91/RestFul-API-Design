// Get Single user

import connectDB from "@/lib/db";
import User from "@/models/users";
import { Types } from "mongoose";
import { NextResponse } from "next/server";
export async function GET(req, segmentData) {
  try {
    await connectDB();
    const { userID } = await segmentData.params;
    if (!userID) {
      return NextResponse.json(
        { status: "failed", message: "User ID is required" },
        { status: 404 }
      );
    }
    // Check if User ID is on The right format.
    if (!Types.ObjectId.isValid(userID)) {
      return NextResponse.json(
        { status: "failed", message: "Invalid UserID Format" },
        { status: 400 }
      );
    }
    // Get the user
    const user = await User.findById(userID);
    if (!user) {
      return NextResponse.json(
        { status: "failed", message: "No User Found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { status: "success", data: user },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error Feching user", error);
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

// Update User data
export async function PATCH(req, segmentData) {
  try {
    await connectDB();
    const { userID } = await segmentData.params;
    const body = await req.json();
    if (!userID) {
      return NextResponse.json(
        { status: "failed", message: "User ID is required" },
        { status: 404 }
      );
    }
    // Check if User ID is on The right format.
    if (!Types.ObjectId.isValid(userID)) {
      return NextResponse.json(
        { status: "failed", message: "Invalid UserID Format" },
        { status: 400 }
      );
    }
    // Check if the user Exists
    const user = await User.findById(userID);

    if (!user) {
      return NextResponse.json(
        { status: "failed", message: "No User Found" },
        { status: 404 }
      );
    }
    // Update user
    const updatedUser = await User.findByIdAndUpdate(userID, body, {
      upsert: false,
      new: true,
    });
    return NextResponse.json(
      { status: "success", data: updatedUser },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error Updating User Data", error);
    return NextResponse.json(
      {
        status: "failed",
        message: "Error Updating User Data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
// Delete User
export async function DELETE(req, segmentData) {
  try {
    await connectDB();
    const { userID } = await segmentData.params;
    if (!userID) {
      return NextResponse.json(
        { status: "failed", message: "User ID is required" },
        { status: 404 }
      );
    }
    // Check if User ID is on The right format.
    if (!Types.ObjectId.isValid(userID)) {
      return NextResponse.json(
        { status: "failed", message: "Invalid UserID Format" },
        { status: 400 }
      );
    }
    // Check if the user exists on the database
    const user = await User.findById(userID);
    if (!user) {
      return NextResponse.json(
        { status: "failed", message: "No User Found" },
        { status: 404 }
      );
    }
    // delete User
    const deletedUser = await User.findByIdAndDelete(userID);
    return NextResponse.json(
      {
        status: "success",
        message: "User Deleted successfully",
        data: deletedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error Deleting user", error);
    return NextResponse.json(
      {
        status: "failed",
        message: "Error Deleting User",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
