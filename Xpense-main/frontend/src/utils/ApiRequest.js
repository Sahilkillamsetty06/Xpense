// const host = "http://localhost:8000";
const host = "https://xpense-chi.vercel.app";
// const host = "http://192.168.40.198:8000";
// const host = "http://192.168.40.44:8000";
export const setAvatarAPI = `${host}/api/auth/setAvatar`;
export const registerAPI = `${host}/api/auth/register`;
export const loginAPI = `${host}/api/auth/login`;
export const addNewBankAccount = `${host}/api/auth/addBankAccount`;
export const deleteExistingAccount = `${host}/api/auth/deleteBankAccount`;
export const deleteExistingCategory = `${host}/api/auth/deleteCategory`;
export const addNewCategory = `${host}/api/auth/addCategory`;
export const updateExistingBankDetails = `${host}/api/auth/updateBankDetails`;
export const updateExistingCategory = `${host}/api/auth/updateCategory`;
export const getBankDetails = `${host}/api/auth/getBankDetails`;
export const addTransaction = `${host}/api/v1/addTransaction`;
export const getTransactions = `${host}/api/v1/getTransaction`;
export const editTransactions = `${host}/api/v1/updateTransaction`;
export const deleteTransactions = `${host}/api/v1/deleteTransaction`;

export const addNewLoan = `${host}/api/loan/addLoan`;
export const deleteExistingLoan = `${host}/api/loan/deleteLoan`;
export const changeStatus = `${host}/api/loan/changeStatus`;

export const searchFriend = `${host}/api/friends/search`;
export const addNewFriend = `${host}/api/friends/send-request`;
export const acceptNewFriendRequest = `${host}/api/friends/accept-request`;
export const deleteNewFriendRequest = `${host}/api/friends/reject-request`;
export const deleteExistingFriend = `${host}/api/friends/delete-friend`;

export const searchUserName = `${host}/api/friends/check-username`;
