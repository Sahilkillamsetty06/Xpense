import axios from "axios";
import { loginAPI, addNewBankAccount, deleteExistingAccount,getBankDetails, deleteExistingCategory, addNewCategory, updateExistingCategory, updateExistingBankDetails, addNewLoan, deleteExistingLoan, changeStatus, addNewFriend, deleteExistingFriend, searchUserName } from "./ApiRequest";
import { Category } from "../Pages/Bank/Category";

export const logIn = async(email,password)=>{
    try{
        const { data } = await axios.post(loginAPI, {
            email,
            password,
          });
      
          console.log(data)
          return data;
    }catch(err){
        console.log("errors : ",err)
        return err.response.data
    }
}

export const addBankAccount = async(email, bankName,accountBalance)=>{
    try{
        const {data} = await axios.post(addNewBankAccount,{
            email, bankName,accountBalance
        });
        return data;
    }catch(err){
        console.log(err)
        return err.response.data
    }
}

export const deleteBankAccount = async(email,bankName,accountBalance,index)=>{
    try{
        const {data} = await axios.post(deleteExistingAccount,{
            email, bankName,accountBalance, index
        });
        return data;
    }catch(err){
        console.log(err);
        return err.response.data
    }
}

export const getBankDetail = async(email)=>{
    try{
        const {data} = await axios.post(getBankDetails,{
            email
        })
        return data;
    }catch(err){
        console.log(err);
        return err.response.data
    }
}

export const updateBankDetails = async(email,bankName,accountBalance, previousBankName)=>{
    try{
        const {data} = await axios.post(updateExistingBankDetails,{
            email,bankName,accountBalance, previousBankName
        })
        return data;
    }catch(err){
        console.log(err)
        return err.response.data;
    }
}

export const deleteCategory= async(email,category,index)=>{
    try{
        const {data} = await axios.post(deleteExistingCategory,{
            email, category, index
        });
        return data;
    }catch(err){
        console.log(err);
        return err.response.data
    }
}

export const addCategory = async(email, category,budget)=>{
    try{
        const {data} = await axios.post(addNewCategory,{
            email, category, budget
        });
        return data;
    }catch(err){
        console.log(err)
        return err.response.data
    }
}

export const updateCategory = async(email, category, previousCategoryName,budget) =>{
    try{
        const {data} = await axios.post(updateExistingCategory,{
            email, categoryName:category,previousCategoryName,budget
        });
        return data;
    }catch(err){
        console.log(err)
        return err.response.data
    }
}

export const addLoan = async(lender,lenderName, borrower, loanAmount, loanDescription, loanDate, borrowerName) =>{
    console.log("lender : ", lender,lenderName, borrower, loanAmount, loanDescription, loanDate, borrowerName)
    try{
        const {data} = await axios.post(addNewLoan,{
            lender,lenderName, borrower, loanAmount, loanDescription, loanDate, borrowerName
        });
        return data;
    }catch(err){
        console.log(err)
        return err.response.data
    }
}


export const deleteLoan = async(loanId,lender,borrower)=>{
    try{
        const {data} = await axios.post(deleteExistingLoan,{
            loanId,lender,borrower
        });
        return data;
    }catch(err){
        console.log(err)
        return err.response.data
    }
}

export const changeLoanStatus = async(loanId,demote,repayed,repayedAmount)=>{
    try{
        const {data} = await axios.post(changeStatus,{
            loanId,demote,repayed,repayedAmount
        });
        return data;
    }catch(err){
        console.log(err)
        return err.response.data
    }
}



export const sendFriendRequest = async(receiverId,senderId)=>{
    try{
        const {data} = await axios.post(addNewFriend,{
            receiverId,senderId
        });
        return data;
    }catch(err){
        console.log(err)
        return err.response.data
    }
}

export const deleteFriend = async(userId,friendId)=>{
    try{
        const {data} = await axios.post(deleteExistingFriend,{
            userId,friendId
        });
        return data;
    }catch(err){
        console.log(err)
        return err.response.data
    }
}


export const getExistingUserName = async(username)=>{
    try {
        const response = await axios.get(searchUserName, {
            params: { query: username }, // Use params to send the query
        });
        return response.data
    } catch (error) {
        console.error("Error fetching suggested friends:", error);
    }
}
