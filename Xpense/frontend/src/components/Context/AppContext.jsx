import React, { createContext, useReducer } from 'react';

const statusFlow = {
    pending: "inApproval",
    inApproval: "paid",
    paid: "paid" // "paid" is the final status, so it remains unchanged
};

export const appState = {
    banks: null,
    categories: null,
    loading: false,
    addCategoryModal: false,
    addBankModal: false,
    transactionModalVisibility: false,
    editValues: null,
    reload: false,
    fullAppRefresh: false,
    loansLent: null,
    loansBorrowed: null,
    loanSummaryVisibility :false,
    friendRequest: null,
    myFriends: null,
    friendRequestSent:null,
    loanModalVisibility: false,
    addLoanModalVisibility: false,
    friendsModalVisibility: false,
    searchFriendModalVisibility: false,
}

export const appReducer = (state, action) => {
    switch (action.type) {
        case "banks": return { ...state, banks: action.payload };

        case "deleteBankAccount": {
            let bankAccount = state.banks;
            bankAccount.splice(bankAccount.findIndex((bank) => bank.bankName === action.payload), 1)
            return {
                ...state,
                banks: bankAccount,
            }
        }

        case "addBankAccount": {
            let bankAccount = state.banks;
            bankAccount.push({ bankName: action.payload.bankName, accountBalance: action.payload.bankBalance })
            return {
                ...state,
                banks: bankAccount,
            }
        }



        case "categories": return { ...state, categories: action.payload };

        case "deleteCategory": {
            let categories = state.categories;
            categories.splice(categories.findIndex((category) => category.category === action.payload), 1)
            return {
                ...state,
                categories: categories,
            }
        }

        case "addCategory": {
            let categories = state.categories;
            categories.push({ category: action.payload.category, budget: action.payload.budget })
            return {
                ...state,
                categories: categories,
            }
        }



        case "loading": return { ...state, loading: action.payload };

        case "addCategoryModal": return { ...state, addCategoryModal: action.payload };

        case "addBankModal": return { ...state, addBankModal: action.payload };

        case "transactionModalVisibility": return { ...state, transactionModalVisibility: action.payload }

        case "editDetails": return { ...state, editValues: action.payload }

        case "reload": return { ...state, reload: !state.reload }

        case "fullAppRefresh": return { ...state, fullAppRefresh: !state.fullAppRefresh }

        case "loansLent": return { ...state, loansLent: action.payload }

        case "loansBorrowed": return { ...state, loansBorrowed: action.payload }

        case "loanSummaryVisibility" : return {...state, loanSummaryVisibility:action.payload}

        case "friendRequest": return { ...state, friendRequest: action.payload }

        case "friendRequestSent" : return {...state, friendRequestSent:action.payload}

        case "addFriendRequestId" : return { ...state, friendRequestSent: [...state.friendRequestSent, action.payload] }

        case "myFriends": return { ...state, myFriends: action.payload };

        case "acceptFriendRequest":return{
            ...state,
            friendRequest: state.friendRequest.filter(req =>req._id !== action.payload._id),
            myFriends :  [...state.myFriends, action.payload]
        }

        case "deleteFriendRequest" :return{
            ...state,
            friendRequest: state.friendRequest.filter(req =>req._id !== action.payload),
        }

        case "deleteFriend" : return{
            ...state,
            myFriends: state.myFriends.filter(req =>req._id !== action.payload),
        }

        case "loanModalVisibility": return { ...state, loanModalVisibility: action.payload }

        case "addLoanModalVisibility": return { ...state, addLoanModalVisibility: action.payload }

        case "addNewLoanBorrowed": return { ...state, loansBorrowed: [...state.loansBorrowed, action.payload] }

        case "addNewLoanLent": return { ...state, loansLent: [...state.loansLent, action.payload] }

        case "deleteLoan":
            return {
                ...state,
                loansLent: state.loansLent.filter(loan => loan._id !== action.payload),
                loansBorrowed: state.loansBorrowed.filter(loan => loan._id !== action.payload)
            };

        case "updateLoanStatus":
            return {
                ...state,
                loansLent: state.loansLent.map(loan =>
                 {
                    if (loan._id === action.payload.loanId) {
                        const updatedLoan = {
                            ...loan,
                            repaidLoanAmount: action.payload.repayedAmount, // Update repaid amount
                        };
        
                        // Determine loanStatus based on conditions
                        if (action.payload.repayed) {
                            updatedLoan.loanStatus = "paid";
                        } 
                        if (action.payload.demote || (updatedLoan.repaidLoanAmount !== loan.loanAmount)) {
                            updatedLoan.loanStatus = "pending";
                        }
        
                        return updatedLoan;
                    }
                    return loan;
                 }
                ),
                loansBorrowed: state.loansBorrowed.map(loan =>
                {
                    if (loan._id === action.payload.loanId) {
                        const updatedLoan = {
                            ...loan,
                            repaidLoanAmount: action.payload.repayedAmount, // Update repaid amount
                        };
        
                        // Determine loanStatus based on conditions
                        if (action.payload.repayed) {
                            updatedLoan.loanStatus = "paid";
                        } else if (action.payload.demote || updatedLoan.repaidLoanAmount !== loan.loanAmount) {
                            updatedLoan.loanStatus = "pending";
                        }else{
                            updatedLoan.loanStatus = "inApproval";
                        }
        
                        return updatedLoan;
                    }
                    return loan;
                }
                )
            };

        case "friendsModalVisibility": return { ...state, friendsModalVisibility: action.payload }

        case "searchFriendModalVisibility": return { ...state, searchFriendModalVisibility: action.payload }

    }
}

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
    const [data, dispatch] = useReducer(appReducer, appState);

    return (
        <AppContext.Provider value={{ data, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};