import React, { useContext, useEffect, useState } from "react";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import moment from "moment";
import EditNoteIcon from "@mui/icons-material/EditNote";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./home.css";
import { deleteTransactions, editTransactions } from "../../utils/ApiRequest";
import axios from "axios";
import "./TableData.css"
import AnimatedSection from "../../utils/AnimatedSection";
import { AppContext } from "../../components/Context/AppContext";
import { Box, Tooltip } from "@mui/material";
import Zoom from '@mui/material/Zoom';

const TableData = (props) => {
  const { data, dispatch } = useContext(AppContext)
  const [show, setShow] = useState(false);
  const [transactions, setTransactions] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [currId, setCurrId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [user, setUser] = useState(null);
  const [type, setType] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0);
  const [bankUniqueValues, setBankUniqueValues] = useState(null)
  const [categoryUniqueValues, setCategoryUniqueValues] = useState(null)

  const [dateFilter, setDateFilter] = useState(false);
  const [typeFilter, setTypeFilter] = useState(false);
  const [bankFilter, setBankFilter] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState(false);
  const [values, setValues] = useState({
    title: "",
    amount: "",
    description: "",
    category: "",
    date: "",
    transactionType: "",
  });

  const [isValidBank, setIsValidBank] = useState(false);




  const handleEditClick = (itemKey) => {
    // const buttonId = e.target.id;
    console.log("Clicked button ID:", itemKey);
    if (transactions.length > 0) {
      const editTran = props.data.filter((item) => item._id === itemKey);
      setCurrId(itemKey);
      setEditingTransaction(editTran);
      setValues(editTran[0]);
      handleShow();
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axios.put(`${editTransactions}/${currId}`, {
      ...values,
    });

    if (data.success === true) {
      handleClose();
      setRefresh(!refresh);
      window.location.reload();
    }
    else {
      console.log("error");
    }

  }

  const handleDeleteClick = async (itemKey) => {
    console.log("Clicked button ID delete:", itemKey);
    setCurrId(itemKey);
    const { data } = await axios.post(`${deleteTransactions}/${itemKey}`, {
      userId: props.user._id,
    });

    if (data.success === true) {
      setRefresh(!refresh);
      window.location.reload();
    }
    else {
      console.log("error");
    }

  };



  useEffect(() => {
    // Check if the selected bankName is valid (exists in the list)
    const bankExists = data.banks && data.banks.some(bank => bank.bankName === values.bankName);
    setIsValidBank(bankExists);
  }, [values.bankName, props.banks]);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };

  const handleSorting = (param, direction) => {
    setType(direction);
    const sortedData = [...transactions].sort((a, b) => {
      if (a[param] < b[param]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[param] > b[param]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setTransactions([...sortedData]);
    setRefreshKey(refreshKey + 1);

  }

  const handleTypeChange = (type) => {
    setTypeFilter(true)
    const selectedTransaction = props.data.filter((transaction) => transaction.transactionType === type);
    setTransactions(selectedTransaction);
  }

  const handleClearTypeFilter = () => {
    setTransactions(props.data)
    setTypeFilter(false)
  }

  const handleBankAccount = (bank) => {
    setBankFilter(true);
    const selectedTransaction = props.data.filter((transaction) => transaction.bankName === bank);
    setTransactions(selectedTransaction);
  }

  const handleClearBankFilter = () => {
    setTransactions(props.data);
    setBankFilter(false)
  }

  const handleCategoryFilter = (category) => {
    setCategoryFilter(true);
    const filteredCategories = props.data.filter((transaction) => transaction.category === category)
    setTransactions(filteredCategories);
  }

  const handleClearCategoryFilter = () => {
    setTransactions(props.data);
    setCategoryFilter(false);
  }

  const handleChangeFrequency = (frequency) => {
    props.setFrequency(frequency);
  }

  const handleClearDateFilter = () => {
    props.setFrequency("7");
    setDateFilter(false);
  }


  const setBankAccounts = () => {
    console.log("props : ", props)

    let banks = props.data && props.data.map((bank) => { return bank.bankName });
    banks = Array.from(new Set(banks))
    setBankUniqueValues(banks);
  }

  const setCategoriesForFilter = () => {
    let categories = props.data && props.data.map((category) => { return category.category });
    categories = Array.from(new Set(categories))
    setCategoryUniqueValues(categories);
  }

  useEffect(() => {
    setUser(props.user);
    setTransactions(props.data);
    setBankAccounts();
    setCategoriesForFilter();
  }, [props.data, props.user, refresh]);

  return (
    <>
      <Container  >
        <Table responsive="md" className="data-table">
          <thead>
            <tr>
              <th><div className="dropdown">
                <button className="dropbtn" style={{ display: 'flex', alignItems: 'center' }}><th>Date</th>
                  {props.frequency !== "7" && (
                    <span
                      onClick={() => handleClearDateFilter()}
                      style={{ marginLeft: '8px', cursor: 'pointer', color: 'red' }}
                    >
                      X
                    </span>
                  )}
                </button>
                <div className="dropdown-content">
                  <a onClick={() => { handleSorting('date', 'ascending') }}>Sort Ascending</a>
                  <a onClick={() => { handleSorting('date', 'descending') }}>Sort Descending</a>
                  <a onClick={() => { handleChangeFrequency("30") }}>Last 30 days</a>
                  <a onClick={() => { handleChangeFrequency("custom") }}>Custom</a>
                </div>
              </div></th>
              <th><div className="dropdown">
                <button className="dropbtn" style={{ display: 'flex', alignItems: 'center' }}><th>Title</th>

                </button>

                <div className="dropdown-content">
                  <a onClick={() => { handleSorting('title', 'ascending') }}>Sort Ascending</a>
                  <a onClick={() => { handleSorting('title', 'descending') }}>Sort Descending</a>
                </div>
              </div></th>
              <th><div className="dropdown">
                <button className="dropbtn" style={{ display: 'flex', alignItems: 'center' }}><th>Amount</th>
                  {typeFilter && (
                    <span
                      onClick={() => handleClearTypeFilter()}
                      style={{ marginLeft: '8px', cursor: 'pointer', color: 'red' }}
                    >
                      X
                    </span>
                  )}
                </button>
                <div className="dropdown-content">
                  {typeFilter ? (<><a onClick={() => { handleSorting('amount', 'ascending') }}>Sort Ascending</a>
                    <a onClick={() => { handleSorting('amount', 'descending') }}>Sort Descending</a></>) :
                    (
                      <>
                        <a onClick={() => handleTypeChange('Credit')}>Credit</a>
                        <a onClick={() => handleTypeChange('Expense')}>Expense</a>
                      </>
                    )}


                </div>
              </div></th>
              {/* <th>
                <div className="dropdown">
                  <button className="dropbtn" style={{ display: 'flex', alignItems: 'center' }}>
                    <th>Type</th>
                    {typeFilter && (
                      <span
                        onClick={() => handleClearTypeFilter()}
                        style={{ marginLeft: '8px', cursor: 'pointer', color: 'red' }}
                      >
                        X 
                      </span>
                    )}
                  </button>
                  <div className="dropdown-content">
                    <a onClick={() => handleTypeChange('Credit')}>Credit</a>
                    <a onClick={() => handleTypeChange('Expense')}>Expense</a>
                  </div>
                </div>

              </th> */}
              <th><div className="dropdown">
                <button className="dropbtn" style={{ display: 'flex', alignItems: 'center' }}><th>Bank Acc</th>
                  {bankFilter && (
                    <span
                      onClick={() => handleClearBankFilter()}
                      style={{ marginLeft: '8px', cursor: 'pointer', color: 'red' }}
                    >
                      X {/* or <i className="fas fa-times"></i> for an icon */}
                    </span>
                  )}</button>
                <div className="dropdown-content">
                  {bankUniqueValues && bankUniqueValues.map((bank) => { return <a onClick={() => { handleBankAccount(bank) }}>{bank}</a> })}

                </div>
              </div></th>
              <th><div className="dropdown">
                <button className="dropbtn" style={{ display: 'flex', alignItems: 'center' }}><th>Category</th>
                  {categoryFilter && (
                    <span
                      onClick={() => handleClearCategoryFilter()}
                      style={{ marginLeft: '8px', cursor: 'pointer', color: 'red' }}
                    >
                      X {/* or <i className="fas fa-times"></i> for an icon */}
                    </span>
                  )}</button>
                <div className="dropdown-content">
                  {console.log("CCCCCCCCCCCC ----> ", categoryUniqueValues)}
                  {categoryUniqueValues && categoryUniqueValues.map((category) => { return <a onClick={() => { handleCategoryFilter(category) }}>{category}</a> })}

                </div>
              </div></th>
              <th><div className="dropdown">
                <button className="dropbtn" disabled><th>Action</th></button>

              </div></th>
            </tr>
          </thead>
          <tbody className="text-white">
            {transactions && transactions.map((item, index) => (
              <AnimatedSection transitionType="animate__fadeInLeft">
                <tr key={index}>
               
                 
                  <td> <ToolTipForTable title={moment(item.date).format("DD-MM-YYYY")} children={moment(item.date).format("DD-MM-YYYY")} /></td>
                  {/* </ToolTipForTable> */}
                  
                  <td><ToolTipForTable title={item.title} children={item.title} /></td>
                  
                  <td className={(item.transactionType === "Credit" ? "text-success" : "text-danger")}>{(item.transactionType === "Credit" ? "+" : "-") + item.amount}</td>
                 
                  <td> <ToolTipForTable title={item.bankName || ""} children={item.bankName || ""} /></td>
                 
                  <td> <ToolTipForTable title={item.category} children={item.category}/></td>
                  <td>
                    <div className="icons-handle">
                    
                      <EditNoteIcon
                        sx={{ cursor: "pointer" }}
                        key={item._id}
                        id={item._id}
                        onClick={() => handleEditClick(item._id)}
                      />
                     

                     
                      <DeleteForeverIcon
                        sx={{ color: "red", cursor: "pointer" }}
                        key={index}
                        id={item._id}
                        onClick={() => handleDeleteClick(item._id)}
                      />
                      


                    </div>
                  </td>

                </tr>
              </AnimatedSection>
            ))}
          </tbody>
        </Table>
      </Container>
      {editingTransaction ? (
        <>
          {/* <div> */}
          <Modal show={show} onHide={handleClose} centered >
            <Modal.Header closeButton>
              <Modal.Title>
                Update Transaction Details
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleEditSubmit}>
                <Form.Group
                  className="mb-3"
                  controlId="formName"
                >
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    name="title"
                    type="text"
                    placeholder={editingTransaction[0].title}
                    value={values.title}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="formAmount"
                >
                  <Form.Label>Amount</Form.Label>
                  <Form.Control
                    name="amount"
                    type="number"
                    placeholder={editingTransaction[0].amount}
                    value={values.amount}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formSelect">
                  <Form.Label>Bank</Form.Label>
                  <Form.Select
                    name="bankName"
                    value={values.bankName || ""}
                    onChange={handleChange}
                  >
                    {!isValidBank && values.bankName && (
                      <option value={values.bankName} disabled>
                        {values.bankName} (Invalid or Unlisted)
                      </option>
                    )}
                    {
                      data.banks && data.banks.map((bank, index) => {
                        return <option key={index} value={bank.bankName}>{bank.bankName}</option>
                      })
                    }
                  </Form.Select>
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="formSelect"
                >
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


                <Form.Group
                  className="mb-3"
                  controlId="formSelect1"
                >
                  <Form.Label>Transaction Type</Form.Label>
                  <Form.Select
                    name="transactionType"
                    value={values.transactionType}
                    onChange={handleChange}
                  >

                    <option value="Credit">Credit</option>
                    <option value="Expense">Expense</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="formDate"
                >
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={values.date ? new Date(values.date).toISOString().slice(0, 10) : ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit" onClick={handleEditSubmit} disabled={!isValidBank}>Submit</Button>
            </Modal.Footer>
          </Modal>
          {/* </div> */}
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default TableData;

const ToolTipForTable = (props) => {
  return (<Tooltip
    title={props.title}
    enterTouchDelay={0}
    leaveTouchDelay={800}
     placement="bottom-start"
     TransitionComponent={Zoom}
     arrow
  >{props.children}</Tooltip>)
}
