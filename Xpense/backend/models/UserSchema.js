import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// User Schema Model - (Name, email, password, creation Date) with validation rules
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        validate: validator.isEmail,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password Must Be Atleast 6 characters"],
    },
    isAvatarImageSet: {
        type: Boolean,
        default: false,
    },

    avatarImage: {
        type: String,
        default: ""
    },
    transactions: {
        type: [],
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },

    bankAccount: {
        type: [],
    },

    categories: {
        type: [{
            category: {
                type: String,
                required: true,
            },
            budget: {
                type: Number,
            },
            limitUtilised: {
                type: Number,
                default: 0,
            }
        }],
        default: [
            { category: 'Food' },
            { category: 'Travel' },
            { category: 'Shopping' },
            { category: 'Bills' },
            { category: 'Others' }
        ]
    },

    lent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Loan'
        }
    ],
    borrowed: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Loan'
        }
    ],

    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    friendRequestsSent: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    friendRequestsReceived: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

});

const User = mongoose.model("User", userSchema);

export default User;