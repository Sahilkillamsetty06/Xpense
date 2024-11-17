import Transaction from "../models/TransactionModel.js";
import User from "../models/UserSchema.js";
import moment from "moment";

export const addTransactionController = async (req, res) => {
  try {
    const {
      title,
      amount,
      date,
      category,
      userId,
      transactionType,
      index,
    } = req.body;


    if (
      !title ||
      !amount ||
      !date ||
      !category ||
      !transactionType ||
      index === undefined
    ) {
      return res.status(408).json({
        success: false,
        messages: "Please Fill all fields",
      });
    }

    console.log("selectedBank : ", index)

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }


    const bankName = user.bankAccount[index].bankName;

    let newTransaction = await Transaction.create({
      title: title,
      amount: amount,
      category: category,
      date: date,
      user: userId,
      transactionType: transactionType,
      bankName: bankName,
    });

    user.transactions.push(newTransaction);
    const bankAccount = user.bankAccount[index];
    let updatedBankAccount;
    if (transactionType === "Credit") {

      updatedBankAccount = { ...bankAccount, accountBalance: parseInt(bankAccount.accountBalance) + parseInt(amount) }

    } else {
      const categories = user.categories;
      const updatedCategory = categories.map((userCategory) => {
        if (userCategory.category === category) {
          if (userCategory.budget) {
            userCategory.limitUtilised =parseInt(userCategory.limitUtilised) + parseInt(amount);
          }
        }
        return userCategory;
      })
      user.categories = updatedCategory;
      updatedBankAccount = { ...bankAccount, accountBalance: parseInt(bankAccount.accountBalance) - parseInt(amount) }
    }
    user.bankAccount[index] = updatedBankAccount;


    user.markModified('categories')
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Transaction Added Successfully",
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};

export const getAllTransactionController = async (req, res) => {
  try {
    const { userId, type, frequency, startDate, endDate } = req.body;

    console.log(userId, type, frequency, startDate, endDate);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Create a query object with the user and type conditions
    const query = {
      user: userId,
    };

    if (type !== 'all') {
      query.transactionType = type;
    }

    // Add date conditions based on 'frequency' and 'custom' range
    if (frequency !== 'custom') {
      query.date = {
        $gt: moment().subtract(Number(frequency), "days").toDate()
      };
    } else if (startDate && endDate) {
      query.date = {
        $gte: moment(startDate).toDate(),
        $lte: moment(endDate).toDate(),
      };
    }


    const transactions = await Transaction.find(query);


    return res.status(200).json({
      success: true,
      transactions: transactions,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};


export const deleteTransactionController = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const userId = req.body.userId;

    // console.log(transactionId, userId);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const transactionElement = await Transaction.findByIdAndDelete(
      transactionId
    );

    if (!transactionElement) {
      return res.status(400).json({
        success: false,
        message: "transaction not found",
      });
    }

   
    if (transactionElement && isSameMonth(transactionElement.date)) {
      
      const auxCategory = user.categories.map((category)=>{
        if(category.category === transactionElement.category)
          category.limitUtilised = parseInt(category.limitUtilised) - parseInt(transactionElement.amount);
        return category;
      })
      user.categories = auxCategory;
    }

    const transactionArr = user.transactions.filter(
      (transaction) => transaction._id === transactionId
    );
    

    user.transactions = transactionArr;

    user.markModified('categories');
    user.markModified('transactions');

    user.save();

    // await transactionElement.remove();

    return res.status(200).json({
      success: true,
      message: `Transaction successfully deleted`,
    });
  } catch (err) {
    console.log("inside error")
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};

export const updateTransactionController = async (req, res) => {
  try {
    const transactionId = req.params.id;

    const { title, amount, date, category, transactionType, bankName } =
      req.body;

    console.log(title, amount, date, category, transactionType, bankName);

    if (
      !title ||
      !amount ||
      !date ||
      !category ||
      !transactionType ||
      !bankName
    ) {
      return res.status(408).json({
        success: false,
        messages: "Please Fill all fields",
      });
    }

    const transactionElement = await Transaction.findById(transactionId);
    let user = await User.findById(transactionElement.user)
    let bankAccount = user.bankAccount;

    if (!transactionElement) {
      return res.status(400).json({
        success: false,
        message: "transaction not found",
      });
    }

    if(transactionElement.category != category){
      if(transactionElement.transactionType===transactionType && transactionType === "Expense"){
          const auxCategoryList = user.categories.map((categoryUser)=>{
            if(categoryUser.category === transactionElement.category){
              categoryUser.limitUtilised = parseInt(categoryUser.limitUtilised) - parseInt(transactionElement.amount);
            }else if(categoryUser.category === category){
              categoryUser.limitUtilised = parseInt(categoryUser.limitUtilised) + parseInt(amount);
            }
            return categoryUser
          })

          user.categories = auxCategoryList;

          user.markModified('categories')
          await user.save();
        }else{
          if(transactionType==="Expense"){
            const auxCategoryList = user.categories.map((categoryUser)=>{
              if(categoryUser.category === category){
                categoryUser.limitUtilised = parseInt(categoryUser.limitUtilised) + parseInt(amount);
              }
              return categoryUser
            })
  
            user.categories = auxCategoryList;
  
            user.markModified('categories')
            await user.save();
          }else{
            const auxCategoryList = user.categories.map((categoryUser)=>{
              if(categoryUser.category === transactionElement.category){
                categoryUser.limitUtilised = parseInt(categoryUser.limitUtilised) - parseInt(transactionElement.amount);
              }
              return categoryUser
            })
  
            user.categories = auxCategoryList;
  
            user.markModified('categories')
            await user.save();
          }
        }
      
    }else{
      if(transactionElement.transactionType !== transactionType){
        if(transactionType === "Credit"){
          const auxCategoryList = user.categories.map((categoryUser)=>{
            if(categoryUser.category === transactionElement.category){
              categoryUser.limitUtilised = parseInt(categoryUser.limitUtilised) - parseInt(transactionElement.amount);
            }
            return categoryUser
          })

          user.categories = auxCategoryList;

          user.markModified('categories')
          await user.save();
        }else{
          const auxCategoryList = user.categories.map((categoryUser)=>{
            if(categoryUser.category === transactionElement.category){
              categoryUser.limitUtilised = parseInt(categoryUser.limitUtilised) + parseInt(amount);
            }
            return categoryUser
          })

          user.categories = auxCategoryList;

          user.markModified('categories')
          await user.save();
        }

      }else{
        if(transactionType==="Expense"){
          if(transactionElement.amount !== amount){
            const auxCategoryList = user.categories.map((categoryUser)=>{
              if(categoryUser.category === transactionElement.category){
                categoryUser.limitUtilised = parseInt(categoryUser.limitUtilised) - parseInt(transactionElement.amount);
                categoryUser.limitUtilised = parseInt(categoryUser.limitUtilised) + amount;
              }
              return categoryUser
            })
  
            user.categories = auxCategoryList;
  
            user.markModified('categories')
            await user.save();
          }
        }
      }
    }

    let amountChanged = 0;
    if (transactionElement.bankName != bankName) {
      let bankAccountToBeChanged = bankAccount.filter((bank) => { return bank.bankName === bankName || bank.bankName === transactionElement.bankName })
      if (bankAccountToBeChanged.length === 2) {
        if (bankAccountToBeChanged[0].bankName === bankName) {
          //this ensures element 0 will always have the preexisting bankName
          [bankAccountToBeChanged[0], bankAccountToBeChanged[1]] = [bankAccountToBeChanged[1], bankAccountToBeChanged[0]]
        }

        if (transactionElement.transactionType != transactionType) {
          if (transactionType === "Credit") {
            bankAccountToBeChanged[0].accountBalance += transactionElement.amount;
            bankAccountToBeChanged[1].accountBalance += amount;
          } else {
            bankAccountToBeChanged[0].accountBalance -= transactionElement.amount;
            bankAccountToBeChanged[1].accountBalance -= amount;
          }
        } else {
          if (transactionType === "Credit") {
            bankAccountToBeChanged[0].accountBalance -= transactionElement.amount;
            bankAccountToBeChanged[1].accountBalance += amount;
          } else {
            bankAccountToBeChanged[0].accountBalance += transactionElement.amount;
            bankAccountToBeChanged[1].accountBalance -= amount;
          }

        }
        saveBankDetailsUpdate(bankAccountToBeChanged, user);
      } else if (bankAccountToBeChanged.length === 1) {
        if (transactionType === "Credit") {
          bankAccountToBeChanged[0].accountBalance += parseInt(amount);
        } else {
          bankAccountToBeChanged[0].accountBalance -= parseInt(amount);
        }
        saveBankDetailsUpdate(bankAccountToBeChanged, user);
      }

    } else {
      if (transactionElement.amount != amount) {
        let bankAccountToBeChanged = bankAccount.filter((bank) => { return bank.bankName === bankName })
        if (bankAccountToBeChanged.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Bank not found, you cannot edit this",
          });
        }
        console.log(bankAccountToBeChanged)
        amountChanged -= transactionElement.amount;
        amountChanged += parseInt(amount)

        if (transactionElement.transactionType === transactionType) {
          if (transactionType === "Credit") {
            //bankaccount + amountChanged
            bankAccountToBeChanged[0].accountBalance += amountChanged;
          }
          else {
            //bankaccount + (-1)*amountChanged
            const auxAmountChanged = (-1) * amountChanged;
            console.log("auxAmount : ", bankAccountToBeChanged[0].accountBalance, auxAmountChanged)
            bankAccountToBeChanged[0].accountBalance += auxAmountChanged
            console.log("auxAmount2 : ", bankAccountToBeChanged[0].accountBalance, auxAmountChanged)

          }
        } else {
          const amountToBeChanged = transactionElement.amount + parseInt(amount);

          if (transactionType === "Credit") {
            //bankaccount + amountToBeChanged
            bankAccountToBeChanged[0].accountBalance += amountToBeChanged;
          } else {
            // bankaccount - amountToBeChanged
            bankAccountToBeChanged[0].accountBalance -= amountToBeChanged;
          }
        }
        saveBankDetailsUpdate(bankAccountToBeChanged, user)
        //transactionElement.amount += amountChanged;
      } else {
        if (transactionElement.transactionType !== transactionType) {
          let bankAccountToBeChanged = bankAccount.filter((bank) => { return bank.bankName === bankName })
          if (transactionType === "Credit") {
            bankAccountToBeChanged[0].accountBalance += 2 * amount;
          } else {
            bankAccountToBeChanged[0].accountBalance -= 2 * amount;
          }
          saveBankDetailsUpdate(bankAccountToBeChanged, user)
        }
        // transactionElement.amount = parseInt(amount);
      }
    }





    if (transactionElement.transactionType != transactionType) {
      //TODO when updated the transaction, it should be reflected in bank balance also
    }
    transactionElement.title = title;
    transactionElement.category = category;
    transactionElement.date = date;
    transactionElement.transactionType = transactionType;
    transactionElement.bankName = bankName;
    transactionElement.amount = parseInt(amount)





    await transactionElement.save();


    return res.status(200).json({
      success: true,
      message: `Transaction Updated Successfully`,
      transaction: transactionElement,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};


const saveBankDetailsUpdate = async (bankAccountToBeChanged, user) => {
  const bankAccountAfterChanging = user.bankAccount.map((bank) => {
    if (bank.bankName === bankAccountToBeChanged[0].bankName) {
      bank.accountBalance = bankAccountToBeChanged[0].accountBalance;
    }
    return bank;
  })

  user.bankAccount = bankAccountAfterChanging;
  user.markModified('bankAccount');
  try {
    await user.save()
  } catch (err) {
    console.log("error : ", err)
  }
}

const isSameMonth = (inputDate) => {
  const dateToCheck = new Date(inputDate);
  const currentDate = new Date();

  return (
    dateToCheck.getFullYear() === currentDate.getFullYear() &&
    dateToCheck.getMonth() === currentDate.getMonth()
  );
};
