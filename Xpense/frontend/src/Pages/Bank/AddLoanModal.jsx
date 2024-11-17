import { useControlled } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Form, Container } from "react-bootstrap";
import { AppContext } from "../../components/Context/AppContext";
import { addLoan } from "../../utils/FetchApi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AddLoanModal = (props) => {

    const { data, dispatch } = useContext(AppContext);

    const [loanDescription, setLoanDescription] = useState(null);
    const [loanAmount, setLoanAmount] = useState(null);
    const [loanType, setLoanType] = useState(null);
    const [secondUser, setSecondUser] = useState(null);
    const [loanDate, setLoanDate] = useState(null);
    const [borrowerName, setBorrowerName] = useState(null);
    const [auxBorrower, setAuxBorrower] = useState(null);


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


    const handleInputChange = (setVariable, e) => {

        setVariable(e.target.value)



    }


    const handleModalClose = () => {
        dispatch({ type: "addLoanModalVisibility", payload: false })
    }

    const handleSubmit = async () => {
        let finalBorrowName;
        let lender = null
        let borrower = null
        let lenderName = null;
        if (loanType === "lent") {
            lender = JSON.parse(localStorage.getItem("user"))._id
            lenderName = JSON.parse(localStorage.getItem("user")).userName
            borrower = secondUser;
            finalBorrowName = borrowerName === ""?auxBorrower:borrowerName;

        } else {
            console.log("borrower name : ", borrowerName)
            borrower = JSON.parse(localStorage.getItem("user"))._id
            lender = secondUser;
            lenderName = borrowerName === "" ? auxBorrower : borrowerName;
            finalBorrowName = JSON.parse(localStorage.getItem("user")).userName

        }

        console.log("second : ", lenderName, borrower, loanAmount, loanDescription, loanDate, finalBorrowName)
        const responseData = await addLoan(lender, lenderName, borrower, loanAmount, loanDescription, loanDate, finalBorrowName);
        if (responseData.success) {
            toast.success(data.message, toastOptions);
            if (loanType === "lent") {
                dispatch({ type: "addNewLoanLent", payload: responseData.loan })
            } else {
                dispatch({ type: "addNewLoanBorrowed", payload: responseData.loan })
            }
            dispatch({ type: "addLoanModalVisibility", payload: false })
        }
    }

    useEffect(()=>{
        setLoanDescription(null);
        setLoanAmount(null);
        setLoanType(null);
        setSecondUser(null);
        setLoanDate(null);
        setBorrowerName(null);
        setAuxBorrower(null);
    },[data.addLoanModalVisibility])

    return (
        <Modal show={data.addLoanModalVisibility} onHide={handleModalClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Loan Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Loan Description</Form.Label>
                        <Form.Control
                            name="loanDescription"
                            type="text"
                            placeholder="Enter Loan Description"
                            value={loanDescription}
                            onChange={(e) => { handleInputChange(setLoanDescription, e) }}
                        />

                    </Form.Group>


                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Loan Amount</Form.Label>
                        <Form.Control
                            name="loanAmount"
                            type="number"
                            placeholder="Enter Loan Amount"
                            value={loanAmount}
                            onChange={(e) => { handleInputChange(setLoanAmount, e) }}
                        />

                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formSelect">
                        <Form.Label>Loan Type</Form.Label>
                        <Form.Select
                            name="loanType"
                            value={loanType}
                            onChange={(e) => { handleInputChange(setLoanType, e) }}
                        >
                            <option value="borrowed">Borrowed</option>
                            <option value="lent">Lent</option>
                        </Form.Select>
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="formSelect">
                        {loanType === "lent" ?
                            <Form.Label>Lent To</Form.Label> :
                            <Form.Label>Borrowed From</Form.Label>
                        }

                        <Form.Select
                            name="secondUser"
                            value={borrowerName}
                            onChange={(e) => {
                                handleInputChange(setBorrowerName, e)
                                const selectedFriend = data.myFriends.find(friend => friend.name === e.target.value);
                                selectedFriend && setSecondUser(selectedFriend._id)
                                console.log("second in onclick : ",selectedFriend)
                            }}

                        >
                            <option value=" ">Select one from below</option>
                            {data.myFriends && data.myFriends.map((friend, index) => {
                                return <option value={friend.name}
                                    onClick={() => { console.log(friend) }}
                                >
                                    {friend.name}
                                </option>
                            })}
                            <option value="">Other</option>
                        </Form.Select>
                    </Form.Group>

                    {borrowerName === "" &&
                        <Form.Group className="mb-3" controlId="formName">
                            {loanType === "lent" ?
                                <Form.Label>Lent To</Form.Label> :
                                <Form.Label>Borrowed From</Form.Label>
                            }
                            <Form.Control
                                name="auxBorrower"
                                type="text"
                                placeholder="Enter the name of the user"
                                value={auxBorrower}
                                onChange={(e) => { handleInputChange(setAuxBorrower, e) }}
                            />

                        </Form.Group>
                    }


                    <Form.Group className="mb-3" controlId="formDate">
                        <Form.Label>Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="loanDate"
                            value={loanDate}
                            onChange={(e) => { handleInputChange(setLoanDate, e) }}
                        />
                    </Form.Group>





                    {/* Add more form inputs as needed */}
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose}>
                    Close
                </Button>
                {data.editValues && data.editValues.edit ? <Button variant="primary" >
                    Update
                </Button> :
                    <Button variant="primary" onClick={handleSubmit} >
                        Submit
                    </Button>}
                {/* <Button variant="primary" onClick={handleSubmit} disabled={nameAlreadyExistsError}>
                      Submit
                    </Button> */}
            </Modal.Footer>
        </Modal>
    )
}