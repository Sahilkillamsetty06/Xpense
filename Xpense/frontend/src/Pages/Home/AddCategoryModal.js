import React, { useContext, useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { addBankAccount, addCategory, deleteBankAccount, updateCategory } from "../../utils/FetchApi";
import { ToastContainer, toast } from "react-toastify";
import { AppContext } from "../../components/Context/AppContext";



export const AddCategoryModal = (props)=>{

  const {data,dispatch} =useContext(AppContext)
    
    const [show,setShow] = useState(false);
    const [email,setEmail] = useState(null)

    const [category,setCategory] = useState(null);
    const [budget,setBudget] = useState(null)
    const [defaultBankAccount,setDefaultBankAccount] = useState(null)

    const [index,setIndex] = useState(null);
    const [nameAlreadyExistsError, setNameAlreadyExistsError] = useState(false)
   
    
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



    const resetCategory = ()=>{
        setCategory("");
        setIndex(null);
    }

    const handleInputChange = (setVariable,e)=>{
      setVariable(e.target.value)
      console.log(budget)
    }

    const handleCloseModal = ()=>{
      dispatch({ type:"editDetails" , payload:null    })
      dispatch({type:"addCategoryModal" , payload:false})
      
    }

    const handleCategoryNameChange = (e)=>{
      const enteredCategoryName = e.target.value.trim().toLowerCase(); // Trim and normalize case for comparison

    // Check if the bank name already exists
    const categoryExists = data.categories && data.categories.some((category) => category.category.toLowerCase() === enteredCategoryName);

    if (categoryExists) {
      setNameAlreadyExistsError(true);  // Set error state if the name already exists
    } else {
      setNameAlreadyExistsError(false); // Clear error state if name is unique
    }

    setCategory(e.target.value); 

    }


    const handleUpdate = async()=>{
      const updatedCategory = category;
      try{
        const responseData = await updateCategory(email,category.trim(), data.editValues.category.category,budget)
            if(responseData.success){                       
              handleCloseModal()
                toast.success(responseData.message, toastOptions);
                dispatch({type:"fullAppRefresh"})
            }else{
              toast.error(responseData.message, toastOptions);
            }
    }catch(err){
      console.log(err)
    }
  }





    const handleSubmit= async()=>{
        try{
            const responseData = await addCategory(email,category.trim(),budget)
            if(responseData.success){
                dispatch({type:"categories", payload : responseData.categories})
                resetCategory();                
                handleCloseModal();
                toast.success(responseData.message, toastOptions);
                dispatch({type:"reload"})
            }else{
                toast.error(responseData.message, toastOptions);
            }
            
        }catch(err){
            console.log(err)
        }
    }

    const fetchCategories = ()=>{
        if(localStorage.getItem("user")){
        const user = JSON.parse(localStorage.getItem("user"));
        setEmail(user.email)
        }
    }

    useEffect(() => {
        fetchCategories();        
    }, [localStorage.getItem("user")])

    useEffect(() => {
      if (data.addCategoryModal && data.editValues && data.editValues.edit) {
        setCategory(data.editValues.category.category);
        setBudget(data.editValues.category.budget)
      }else{
        setCategory(data.editValues);
        setBudget(data.editValues)
      }
    }, [data.editValues]);

    console.log("ddddddd -> ",data)

    return (
        <Modal show={data.addCategoryModal} onHide={handleCloseModal} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Category Details</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form>
                      <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Category Name</Form.Label>
                        <Form.Control
                          name="title"
                          type="text"
                          placeholder="Enter Category Name"
                          value={category}
                          onChange={handleCategoryNameChange}
                        />
                        {nameAlreadyExistsError && (
              <p style={{ color: 'red' }}>Category already exists!</p>
            )}
                      </Form.Group>
                    

                      <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Category Budget</Form.Label>
                        <Form.Control
                          name="budget"
                          type="number"
                          placeholder="Enter Budget for this category"
                          value={budget}
                          onChange={(e) => {handleInputChange(setBudget,e)}}
                        />
                        
                      </Form.Group>



                      

                      {/* Add more form inputs as needed */}
                    </Form>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                      Close
                    </Button>
                    {data.editValues && data.editValues.edit?<Button variant="primary" onClick={handleUpdate} disabled={nameAlreadyExistsError}>
                      Update
                    </Button>:
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