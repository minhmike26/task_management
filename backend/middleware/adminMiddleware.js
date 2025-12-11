import User from "../models/userModel.js";

// Middleware to check if user is admin
export default async function adminMiddleware(req, res, next) {
  try {
    // req.user should already be set by authMiddleware
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    // Check if user is admin
    const user = await User.findById(req.user._id || req.user.id).select("role");
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    if (user.role !== "admin") {
      console.log(`❌ Access denied. User ${user._id} has role: ${user.role}, required: admin`);
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin privileges required." 
      });
    }

    // User is admin, proceed
    console.log(`✅ Admin access granted for user: ${user._id}`);
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
}

