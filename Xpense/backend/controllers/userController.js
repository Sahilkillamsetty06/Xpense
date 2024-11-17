import User from "../models/UserSchema.js";
import bcrypt from "bcrypt";
import Transaction from "../models/TransactionModel.js";

export const registerControllers = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // console.log(name, email, password);

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            })
        }

        let user = await User.findOne({ email });

        if (user) {
            return res.status(409).json({
                success: false,
                message: "User already Exists",
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        // console.log(hashedPassword);

        let newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
            user:{_id:newUser._id,email:newUser.email,isAvatarImageSet:newUser.isAvatarImageSet,avatarImage:newUser.avatarImage, userName:newUser.name},
        });
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }

}
export const loginControllers = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // console.log(email, password);

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect Email or Password",
            });
        }


        return res.status(200).json({
            success: true,
            message: `Welcome back, ${user.name}`,
            user:{_id:user._id,email:user.email,isAvatarImageSet:user.isAvatarImageSet,avatarImage:user.avatarImage, userName:user.name},
        });

    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export const setAvatarController = async (req, res, next) => {
    try {

        const userId = req.params.id;

        const imageData = req.body.image;

        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage: imageData,
        },
            { new: true });

        return res.status(200).json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
        });


    } catch (err) {
        next(err);
    }
}

export const allUsers = async (req, res, next) => {
    try {
        const user = await User.find({ _id: { $ne: req.params.id } }).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);

        return res.json(user);
    }
    catch (err) {
        next(err);
    }
}

export const addNewBankAccount = async (req, res) => {
    try {
        const { email, bankName, accountBalance } = req.body;
        if (!email || !bankName || !accountBalance) {
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        user.bankAccount.push({ bankName, accountBalance:parseInt(accountBalance) })
        user.save();

        return res.status(200).json({ success: true, message: "Bank account added successfully" })
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const updateBankDetails = async(req,res)=>{
    try{
        const {email,bankName,accountBalance, previousBankName} = req.body;
        console.log(email,bankName,accountBalance, previousBankName);
        if (!email || !bankName || !accountBalance) {
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        user.bankAccount = user.bankAccount.map((bank)=>{
            if(bank.bankName === previousBankName){
                bank.bankName = bankName;
                bank.accountBalance = parseInt(accountBalance);
            }
            return bank
        })

        if(previousBankName !== bankName){
            const transactions = await Transaction.find({user:user._id})
            for (let transaction of transactions) {
                if (transaction.bankName === previousBankName) {
                    transaction.bankName = bankName;
                    await transaction.save();  // Save the modified transaction
                }
            }
        }
        const transactions = await Transaction.find({user:user._id})
        user.transactions = transactions;
        user.markModified('transactions');
        user.markModified('bankAccount');
        try{
            await user.save();
        }catch(err){
            console.log("error updating the bank account : ",err)
        }
        return res.status(200).json({ success: true, message: "Bank Updated"})
    }catch(err){
        console.log("error in update bank details : ",err)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}


export const deleteBankAccount = async (req, res) => {
    try {
        const { email, bankName, accountBalance, index } = req.body;
        console.log(email, bankName, accountBalance, index)
        if (!email || !bankName || !accountBalance || index === undefined) {
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        user.bankAccount.splice(user.bankAccount.findIndex((bank)=>bank.bankName === bankName), 1)
        user.save();

        return res.status(200).json({ success: true, message: "Bank account deleted successfully" })
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const getBankDetails = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please login",
            });
        }

        const user = await User.findOne({ email }).populate('lent').populate('borrowed')
        .populate({
            path: 'friends',
            select: 'name  avatarImage _id',
        })
        .populate({
            path: 'friendRequestsSent',
            select: 'name  avatarImage _id',
        })
        .populate({
            path: 'friendRequestsReceived',
            select: 'name  avatarImage _id',
        })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({ success: true, 
            message: "Bank details fetched", 
            bankDetaile: user.bankAccount , 
            categories : user.categories, 
            loansLent : user.lent, 
            loansBorrowed : user.borrowed,
            myFriends: user.friends,
            receivedFriendRequests: user.friendRequestsReceived,
            sentFriendRequests : user.friendRequestsSent
            
        })

    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const addCategory = async (req, res) => {
    try {
        const { email, category, budget } = req.body;
        if (!email || !category) {
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }
        console.log("budget : ",budget)
        user.categories.push({ category, budget })
        user.save();

        return res.status(200).json({ success: true, message: "Category added successfully", categories:user.categories })
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }


}

export const deleteCategory = async(req,res)=>{
    try {
        const { email, category, index } = req.body;
        console.log(email, category, index)
        if (!email || !category || index === undefined) {
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        user.categories.splice(index, 1)
        user.save();

        return res.status(200).json({ success: true, message: "Category deleted successfully" })
    } catch (err) {
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const updateCategory = async(req,res)=>{
    try{
        const {categoryName,previousCategoryName, email, budget} = req.body;
        if (!categoryName || !previousCategoryName) {
            return res.status(400).json({
                success: false,
                message: "Please enter Category Name",
            });
        }

        if (!email) {
            return res.status(401).json({
                success: false,
                message: "Please verify yourself",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        user.categories = user.categories.map((category)=>{
            console.log(category.category, categoryName, category.category == categoryName)
            if(category.category === previousCategoryName){
                category.category = categoryName;
                category.budget = budget || category.budget;
            }
                
            return category;
        })
        user.markModified('categories'); 
        let transactions = await Transaction.find({user:user._id})
       
        for (let transaction of transactions) {
            if (transaction.category === previousCategoryName) {
                transaction.category = categoryName;
                await transaction.save();  // Save the modified transaction
            }
        }

        // transactions.markModified('category')
        transactions = await Transaction.find({user:user._id})
        user.transactions = transactions;
        user.markModified('transactions');
        user.markModified('categories');
        
        try{
            await user.save();
        }catch(err){
            console.log(err)
        }

        return res.status(200).json({ success: true, message: "Category updated successfully" })
        
    }catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}

export const getLoans = async(req,res)=>{
    try{
        const {userEmail} = req.body;
        if(!userEmail){
            return res.status(403).json({ success: false, message: "Please log in" })
        }

        const user = User.findOne({ email }).populate('lent').populate('borrowed');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({ success: true, message: "Loan details fetched",loanLent : user.lent, loanBorrowed : user.borrowed})

    }catch(err){
        console.log(err)
        return res.status(500).json({ success: false, message: "Internal server error" })
    }
}






