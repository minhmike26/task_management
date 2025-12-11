import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import "dotenv/config";

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const adminEmail = "admin@gmail.com";
    const adminPassword = "123456";
    const adminName = "Admin User";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log("Current admin info:", {
        email: existingAdmin.email,
        role: existingAdmin.role,
        name: existingAdmin.name,
      });

      // Update to admin if not already
      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        await existingAdmin.save();
        console.log("✅ Updated user role to admin");
      }

      await mongoose.disconnect();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const admin = await User.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin user created successfully!");
    console.log("Admin details:", {
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });
    console.log("\n📝 Login credentials:");
    console.log("Email: admin@gmail.com");
    console.log("Password: 123456");

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();
