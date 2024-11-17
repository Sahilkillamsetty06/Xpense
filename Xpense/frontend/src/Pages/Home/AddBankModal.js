import React, { useContext, useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { addBankAccount, deleteBankAccount, updateBankDetails } from "../../utils/FetchApi";
import { ToastContainer, toast } from "react-toastify";
import { AppContext } from "../../components/Context/AppContext";


export const AddBankModal = () => {

  const {data,dispatch} = useContext(AppContext);
  const [email, setEmail] = useState(null)

  const [bankName, setBankName] = useState(null);
  const [bankBalance, setBankBalance] = useState(null);
  const [nameAlreadyExistsError, setNameAlreadyExistsError] = useState(false)

  const [index, setIndex] = useState(null);

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

  const handleCloseModal = ()=>{
    dispatch({ type:"editDetails" , payload:null    })
    dispatch({type:"addBankModal", payload:false})

  }


  const resetBankDetails = () => {
    setBankName("");
    setBankBalance(null);
    setIndex(null);
  }

  const handleBankNameChange = (e) => {
    const enteredBankName = e.target.value.trim().toLowerCase(); // Trim and normalize case for comparison

    // Check if the bank name already exists
    const bankExists = data.banks && data.banks.some((bank) => bank.bankName.toLowerCase() === enteredBankName);

    if (bankExists) {
      setNameAlreadyExistsError(true);  // Set error state if the name already exists
    } else {
      setNameAlreadyExistsError(false); // Clear error state if name is unique
    }

    setBankName(e.target.value); // Still update the entered bank name
  };

  const handleBankBalanceChange = (e) => {
    setBankBalance(e.target.value)
  }




  const handleUpdate = async()=>{
    try{
      const responseData = await updateBankDetails(email,bankName.trim(),bankBalance, data.editValues.bankName)
      if(responseData.success){
        toast.success(responseData.message, toastOptions);
        handleCloseModal();
        dispatch({type:"fullAppRefresh"})
      }else {
        toast.error(responseData.message, toastOptions);
      }
    }catch(err){
      console.log(err)
    }
  }

  const handleSubmit = async () => {
    try {
      const responseData = await addBankAccount(email, bankName.trim(), bankBalance)
      if (responseData.success) {
        dispatch({type:"addBankAccount",payload:{bankName,bankBalance}});
        resetBankDetails();
        handleCloseModal();
        dispatch({type:"reload"})
        toast.success(responseData.message, toastOptions);
      } else {
        toast.error(responseData.message, toastOptions);
      }

    } catch (err) {
      console.log(err)
    }
  }

  const fetchBanks = () => {
    console.log("dataaaaa --> ",data)
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      setEmail(user.email)
    }

  }

  useEffect(() => {
    fetchBanks();
  }, [dispatch])

  useEffect(() => {
    if (data.editValues && data.editValues.edit) {
      setBankName(data.editValues.bankName);
      setBankBalance(data.editValues.bankBalance);
    }else{
      setBankName(data.editValues);
      setBankBalance(data.editValues);
    }
  }, [data.editValues]);

  return (
    <Modal show={data.addBankModal} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Bank Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Bank Name</Form.Label>
            <Form.Control
              name="title"
              type="text"
              placeholder="Enter Bank Name"
              value={bankName}
              onChange={handleBankNameChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAmount">
            <Form.Label>Current Balance</Form.Label>
            <Form.Control
              name="amount"
              type="number"
              placeholder="Enter your current balance"
              value={bankBalance}
              onChange={handleBankBalanceChange}
            />
            {nameAlreadyExistsError && (
              <p style={{ color: 'red' }}>Bank name already exists!</p>
            )}
          </Form.Group>



          {/* Add more form inputs as needed */}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        {data.editValues && data.editValues.bankName ? (<Button variant="primary" onClick={handleUpdate} disabled={nameAlreadyExistsError}>
          Update
        </Button>) :
        <Button variant="primary" onClick={handleSubmit} disabled={nameAlreadyExistsError}>
        Submit
      </Button>}
        {/* <Button variant="primary" onClick={handleSubmit} disabled={nameAlreadyExistsError}>
          Submit
        </Button> */}
      </Modal.Footer>
    </Modal>
  )
}