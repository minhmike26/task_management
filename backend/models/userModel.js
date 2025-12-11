import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password required only if not Google user
        }
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows multiple null values
    },
    avatar: {
        type: String
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;