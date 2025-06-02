import { clerkClient } from "@clerk/express";

export const authMiddleware = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    // console.log("Authenticated User ID:", userId);
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized Access" });
    }
    const user = await clerkClient.users.getUser(userId);
    if (user.publicMetadata.role !== 'educator') {
      return res.status(403).json({ success: false, message: "Access denied. only eduator allowed to add course" });
    }
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}  