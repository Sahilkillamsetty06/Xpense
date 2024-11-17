import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { AppContext } from "../../components/Context/AppContext";
import axios from "axios";
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addTransaction } from "../../utils/ApiRequest";

const ModelForm = () => {


  // console.log(transaction);

  const {data,dispatch} = useContext(AppContext);

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

  const [show, setShow] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null)
  const [transactionType,setTransactionType] =useState(null)

  const [values, setValues] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    transactionType: "",
    selectedBank: 0,
  });

  const handleChange = (e) => {
    setValues({...values , [e.target.name]: e.target.value});
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(JSON.parse(localStorage.getItem("user"))._id)

    const { title, amount, category, date, selectedBank } =
      values;

    if (
      !title ||
      !amount ||
      !category ||
      !date ||
      !selectedBank
    ) {
      toast.error("Please enter all the fields", toastOptions);
    }
    dispatch({type:"loading",payload:true})
    try {
      const { data } = await axios.post(addTransaction, {
        title: title,
        amount: amount,
        category: category,
        date: date,
        transactionType: transactionType,
        userId: JSON.parse(localStorage.getItem("user"))._id,
        index: selectedBank,
      });

      if (data.success === true) {
        toast.success(data.message, toastOptions);
        handleClose();
        dispatch({type:"fullAppRefresh"})
      }





    } catch (err) {


      console.log(err)
      dispatch({type:"loading",payload:false})
      toast.error(err.response.data.message, toastOptions);

    }


  };



  const handleClose = () => {
    dispatch({type:"transactionModalVisibility" , payload:false})
  };

  // const handleShow = (index) => {
  //   setShow(true)
  // };

  useEffect(()=>{
    if(data.editValues && !data.editValues.edit){
      setTransactionType(data.editValues.transactionType)
    }
  },[data.editValues])

  return (
    <div>
     <Modal show={data.transactionModalVisibility} onHide={handleClose} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Transaction Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          name="title"
                          type="text"
                          placeholder="Enter Transaction Name"
                          value={values.name}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formAmount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                          name="amount"
                          type="number"
                          placeholder="Enter your Amount"
                          value={values.amount}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formSelect">
                        <Form.Label>Bank</Form.Label>
                        <Form.Select
                          name="selectedBank"
                          value={selectedBank && data.banks[selectedBank]}
                          onChange={handleChange}
                        >
                          {
                            data.banks && data.banks.map((bank, index) => {
                              return <option value={index}>{bank.bankName}</option>
                            })
                          }
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formSelect">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                          name="category"
                          value={values.category}
                          onChange={handleChange}
                        >
                          <option value="">{data.categories && data.categories.length === 0 ? "No categories found, please add" : ""}</option>
                          {data.categories ? data.categories.map((category, index) => {
                            
                            return (<option key={index} value={category.category}>{category.category}</option>)
                          }) : ""}
                        </Form.Select>
                      </Form.Group>



                      <Form.Group className="mb-3" controlId="formSelect1">
                        <Form.Label>Transaction Type : </Form.Label>
                        {/* <Form.Select
                          name="transactionType"
                          value={values.transactionType}
                          onChange={handleChange}
                        >
                          <option value="">Choose...</option>
                          <option value="credit">Credit</option>
                          <option value="expense">Expense</option>
                        </Form.Select> */}
                        <Form.Label> {transactionType}</Form.Label>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="formDate">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                          type="date"
                          name="date"
                          value={values.date}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      {/* Add more form inputs as needed */}
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </Modal.Footer>
                </Modal>
    </div>
  );
};

export default ModelForm;
