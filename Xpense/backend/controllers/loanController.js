import User from "../models/UserSchema.js";
import Loan from "../models/LoanModal.js";

export const addLoan = async (req, res) => {
    try {
        const { lender, lenderName, borrower, loanAmount, loanDescription, loanDate, borrowerName } = req.body;

        // Validate required fields
        if (
            !loanAmount ||
            !loanDescription ||
            !borrowerName ||
            !loanDate ||
             !lenderName
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter all required fields",
            });
        }

        const loan = await Loan.create({
            lender, lenderName, borrower, loanAmount, loanDescription, loanDate, borrowerName,
        });

        if (!loan) {
            return res.status(500).json({
                success: false,
                message: "Error creating the loan. Please try again later",
            });
        }

        // Update the lender if it exists
        if (lender) {
            const lenderUpdate = await User.findByIdAndUpdate(lender, { $push: { lent: loan._id } }, { new: true });
            if (!lenderUpdate) {
                return res.status(500).json({
                    success: false,
                    message: "Error updating lender's loan records",
                });
            }
        }

        // Update the borrower if it exists
        if (borrower) {
            await User.findByIdAndUpdate(borrower, { $push: { borrowed: loan._id } });
        }

        return res.status(200).json({
            success: true,
            message: "Loan Added Successfully",
            loan,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

export const updateLoan = async (req, res) => {
    try {
        const { loanId, borrower, lender, loanAmount, loanDescription, loanDate, borrowerName, lenderName } = req.body;

        if (!loanId || !loanAmount || !loanDescription || !borrowerName || !loanDate || (!lender && !lenderName)) {
            return res.status(400).json({
                success: false,
                message: "Please enter all required fields",
            });
        }

        const loan = await Loan.findById(loanId);
        if (!loan) {
            return res.status(404).json({
                success: false,
                message: "Loan not found",
            });
        }

        // Handle borrower update only if it has changed
        if (loan.borrower !== borrower) {
            if (loan.borrower) {
                await User.findByIdAndUpdate(loan.borrower, { $pull: { borrowed: loanId } });
            }
            if (borrower) {
                await User.findByIdAndUpdate(borrower, { $addToSet: { borrowed: loanId } });
            }
        }

        // Handle lender update only if it has changed and both were not previously undefined/null
        if (loan.lender !== lender) {
            if (loan.lender) {
                await User.findByIdAndUpdate(loan.lender, { $pull: { lent: loanId } });
            }
            if (lender) {
                await User.findByIdAndUpdate(lender, { $addToSet: { lent: loanId } });
            }
        }

        // Update loan fields with new values
        loan.borrower = borrower || loan.borrower;
        loan.lender = lender || loan.lender;
        loan.loanAmount = loanAmount;
        loan.loanDescription = loanDescription;
        loan.loanDate = loanDate;
        loan.borrowerName = borrowerName;
        loan.lenderName = lenderName || loan.lenderName;

        // Save the updated loan
        const updatedLoan = await loan.save();

        return res.status(200).json({
            success: true,
            message: "Loan updated successfully",
            loan: updatedLoan,
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const changeStatus = async (req, res) => {
    try {
        const { loanId, demote, repayed, repayedAmount } = req.body;
        const lenderName=""
        const borrowerName="";

        if (!loanId) {
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            })
        }

        const loan = await Loan.findById(loanId);

        if (!loan) {
            return res.status(404).json({
                success: false,
                message: "Loan not found",
            });
        }

        const statusFlow = {
            pending: "inApproval",
            inApproval: "paid",
            paid: "paid" // "paid" is the final status, so it remains unchanged
        };

        const nextStatus = statusFlow[loan.loanStatus];


        loan.loanStatus = nextStatus;
        loan.repaidLoanAmount = repayedAmount;

        
        if(repayed){
            loan.loanStatus = "paid";
        }

        if(demote || (loan.repaidLoanAmount!== loan.loanAmount)){
            loan.loanStatus = "pending";
        }


        await loan.save();

        return res.status(200).json({
            success: true,
            message: "Loan Status Changed",
            loan: loan,
        });



    } catch (err) {
        console.log(err)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}
export const deleteLoan = async (req, res) => {
    try {
        const { loanId, lender, borrower } = req.body;

        if (!loanId) {
            return res.status(400).json({
                success: false,
                message: "Please provide the loan ID",
            });
        }

        const loan = await Loan.findByIdAndDelete(loanId);

        if (!loan) {
            return res.status(404).json({
                success: false,
                message: "Loan record not found",
            });
        }

        // Remove from lender if lender exists
        if (lender) {
            await User.findByIdAndUpdate(lender, { $pull: { lent: loanId } });
        }

        // Remove from borrower if borrower exists
        if (borrower) {
            await User.findByIdAndUpdate(borrower, { $pull: { borrowed: loanId } });
        }

        return res.status(200).json({
            success: true,
            message: "Loan deleted successfully",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
