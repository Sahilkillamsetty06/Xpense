import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Overlay, Row, Table } from "react-bootstrap";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { deleteCategory } from "../../utils/FetchApi";
import { ToastContainer, toast } from "react-toastify";
import { AddCategoryModal } from "../Home/AddCategoryModal";
import { AppContext } from "../../components/Context/AppContext";
import LinearProgress from '@mui/material/LinearProgress';
import { red } from '@mui/material/colors';
import { Box, Tooltip  } from "@mui/material";
import { Typography } from "@mui/material";
import Button from 'react-bootstrap/Button';

import Card from "./Cards";

export const Category = (props) => {
    const { data, dispatch } = useContext(AppContext)
    const [categories, setCategories] = useState(null);
    const [email, setEmail] = useState(null)
    const [addCategoryShow, setAddCategoryShow] = useState(false);
    const [category, setCategory] = useState(null)

    const handleAddNewCategory = (category) => {
        dispatch({ type: "editDetails", payload: { edit: true, category } })
        dispatch({ type: "addCategoryModal", payload: true })
    }



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

    const handleDeleteCategory = async (category, index) => {
        try {
            console.log(email, category, index)
            const responseData = await deleteCategory(email, category, index)
            if (responseData.success) {
                dispatch({ type: "deleteCategory", payload: category });
                toast.success(responseData.message, toastOptions);
            } else {
                toast.error(responseData.message, toastOptions);
            }
        } catch (err) {

            console.log(err)
        }
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        setEmail(user.email);
    }, [dispatch, data.reload])

    return (
        <Container  >
            {/* <Table className="data-table">
                <thead>
                    <tr>
                        <td>Category Name</td>
                        <td>Budget</td>

                        <td>Action</td>
                    </tr>
                </thead>
                <tbody>
                    {data.categories && data.categories.map((category, index) => {
                        console.log("category : ", category)
                        return (<tr key={index}>

                            <td>{category.category}</td>
                            <td>{category.budget ?
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Tooltip 
                                    title={`${category.limitUtilised} / ${category.budget} used (${((category.limitUtilised / category.budget) * 100).toFixed(1)}%)`}
                                    enterTouchDelay={0} 
                                    leaveTouchDelay={2000}
                                    >
                                    <LinearProgress variant="determinate"

                                        value={(category.limitUtilised / category.budget * 100) > 100 ? 100 : (category.limitUtilised / category.budget * 100)}
                                        sx={{
                                            width: "80%",
                                            backgroundColor: '#777777',
                                            "& .MuiLinearProgress-bar": {
                                                backgroundColor: (category.limitUtilised / category.budget * 100) > 80 ? 'red' : 'green' // red if over 80%, otherwise green
                                            },
                                            marginTop: "7%",
                                        }} />
                                    </Tooltip>

                                </Box>

                                : "No budget set"
                            }</td>
                           

                            <td>

                                <div className="icons-handle">
                                    <EditNoteIcon
                                        sx={{ cursor: "pointer" }}

                                        onClick={() => handleAddNewCategory(category)}
                                    />
                                    {console.log("---> cat : ", category)}



                                    <DeleteForeverIcon
                                        sx={{ color: "red", cursor: "pointer" }}
                                        key={index}
                                        onClick={() => handleDeleteCategory(category.category, index)}
                                    />
                                </div>
                            </td>

                        </tr>)
                    })}
                    
                </tbody>
               
            </Table> */}
            {data.categories && data.categories.map((category,index)=>{
               return <Card name={category.category} budget={category.budget} limitUtilised={category.limitUtilised} handleEditCategory={()=>handleAddNewCategory(category)} handleDeleteCategory={()=>handleDeleteCategory(category.category,index)}></Card>
            })}
            
            {data.addCategoryModal &&
                <AddCategoryModal />
            }
        </Container>

    )
}