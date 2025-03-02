const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
        },
        Email: {
            type: String,
            required: true,
            unique: true,
        },
        Password: {
            type: String,
            required: true
        },
        ContactNumber: {
            type: Number,
            required: true,
            unique: true,
        },
        isActive: {
            type: Boolean,
            default: false,
        },

        Role: {
            type: String,
            enum: ["User", "Admin"],
            default: "User",
        },
        isMobileVerifed:{
            type: Boolean,
            default: false,
        },
        
        OtpForVerification: {
            type: Number
        },
        ForgetPasswordOtp: {
            type: String
        },
        ForgetPasswordExpired:{
            type: Date,
        },
        OtpGeneratedAt: {
            type: Date,
        },
        tempPassword:{
            type: String,
            default: null,
          
        }
    },

    { timestamps: true }
);


UserSchema.pre("save", async function (next) {

    const user = this;

    if (!user.isModified("Password")) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.Password, salt);
        user.Password = hash;
        next();
    } catch (error) {
        return next("Password Hashing Error", error);

    }
});

// Add the method to compare passwords
UserSchema.methods.comparePassword = async function (enteredPassword) {
    try {
        if (!enteredPassword || !this.Password) {
            throw new Error("Entered password or stored password is missing");
        }

        const isMatch = await bcrypt.compare(enteredPassword, this.Password);

        if (!isMatch) {
            throw new Error("Incorrect password");
        }

        return isMatch;
    } catch (error) {
        throw new Error("Password comparison failed: " + error.message);
    }


}
const User = mongoose.model("User", UserSchema);

module.exports = User;