import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
    lender :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    lenderName:{
        type:String,
        // required :true,
    },

    borrower :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },

    borrowerName:{
        type:String,
        required :true,

    },

    loanAmount :{
        type:Number,
        required:true,
    },

    loanDescription:{
        type:String,
        required:true
    },

    loanDate:{
        type:Date,
        default:Date.now,
    },

    loanStatus:{
        type:String,
        enum:["pending", "paid","inApproval"],
        default:"pending"
    },

    repaidLoanAmount :{
        type:Number,
        default:0
    },

    repayDueDate :{
        type:Date,
    }
})

const Loan = mongoose.model("Loan",loanSchema);

export default Loan;