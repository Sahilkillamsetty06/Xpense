import React, { useContext, useEffect, useState } from "react";
import { Container, Table } from "react-bootstrap";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { deleteBankAccount } from "../../utils/FetchApi";
import { ToastContainer, toast } from "react-toastify";
import { AddBankModal } from "../Home/AddBankModal";
import { AppContext } from "../../components/Context/AppContext";

export const Bank =(props)=>{
    const {data,dispatch} = useContext(AppContext);
    const [email,setEmail] = useState(null);
    const [editBank,setEditBank] =useState(false)

    const [editingBankName,setEditingBankName] = useState(null);
    const [editingBankBalance,setEditingBankBalance] =useState(null);


    const toastOptions = {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: "dark",
      };

      const handleEditClick = (bankName,bankBalance)=>{
        setEditingBankName(bankName);
        setEditingBankBalance(bankBalance);
        dispatch({type:"editDetails", payload:{edit:true,bankName,bankBalance}})
        dispatch({type:"addBankModal", payload:true})
      }

      const handleEditBankClose = ()=>{
        dispatch({type:"addBankModal", payload:false})
        setEditBank(false)
      }

    const handleDeleteBank = async(bankName,bankBalance,index)=>{
        try{
            console.log(email,bankName,bankBalance,index)
            const responseData = await deleteBankAccount(email,bankName,bankBalance,index)
            if(responseData.success){
                dispatch({type:"deleteBankAccount", payload:bankName})
                toast.success(responseData.message, toastOptions);
            }else{
                toast.error(responseData.message, toastOptions);
            }
        }catch(err){
            
            console.log(err)
        }
    }

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("user"));
        setEmail(user.email);
    },[dispatch, data.reload])

    return(
        <Container >
            <Table responsive="md" className="data-table">
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Balance</td>
                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {console.log(data.banks)}
                    {data.banks && data.banks.map((bank,index)=> { 
                        return (<tr key={index}>
                            <td>{bank.bankName}</td>
                            <td>{bank.accountBalance}</td>
                            <td>
                  <div className="icons-handle">
                    <EditNoteIcon
                      sx={{ cursor: "pointer" }}
                      key={index}
                    //   id={item._id}
                      onClick={() => handleEditClick(bank.bankName,bank.accountBalance)}
                    />

                    <DeleteForeverIcon
                      sx={{ color: "red", cursor: "pointer" }}
                      key={index}
                    //   id={item._id}
                      onClick={() => handleDeleteBank(bank.bankName,bank.accountBalance,index)}
                    />
                    </div>
                    </td>
                        </tr>)
                    })}
                </tbody>
            </Table>
            {data.addBankModal && 
                <AddBankModal />
                }
        </Container>
    )
}