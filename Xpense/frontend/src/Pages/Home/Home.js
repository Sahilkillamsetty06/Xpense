import React, { useContext, useEffect, useState } from "react";
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Form, Container } from "react-bootstrap";
// import loading from "../../assets/loader.gif";
import "./home.css";
import { addTransaction, getTransactions } from "../../utils/ApiRequest";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from "../../components/Spinner";
import TableData from "./TableData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";
import Analytics from "./Analytics";
import Banks from "./Banks";
import { getBankDetail } from "../../utils/FetchApi";
import { Bank } from "../Bank/Bank";
import { AddBankModal } from "./AddBankModal";
import { Category } from "../Bank/Category";
import { AddCategoryModal } from "./AddCategoryModal";
import AnimatedSection from "../../utils/AnimatedSection";
import { AppContext } from "../../components/Context/AppContext";
import ModelForm from "./ModelForm";
import { Loans } from "../Bank/Loans";
import { AddLoanModal } from "../Bank/AddLoanModal";
import { Friends } from "../Bank/Friends";
import FriendSearch from "../Bank/AddFriendsModal";
import { LoanSummary } from "../Bank/LoanSummary";

const Home = () => {
  const navigate = useNavigate();

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

  const { data, dispatch } = useContext(AppContext);

  const [cUser, setcUser] = useState();
  const [show, setShow] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [frequency, setFrequency] = useState("7");
  const [type, setType] = useState("all");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [view, setView] = useState("table");
  const [typeOfTransaction, setTypeOfTransaction] = useState(null);
  const [filterApplied, setFilterApplied] = useState(false)
  const [banks, setBanks] = useState(null);
  const [selectedBank, setSelectedBank] = useState(null)
  const [bankShow, setBankShow] = useState(false);
  const [showAddBankModal, setShowAddBankModal] = useState(false)
  const [categoryShow, setCategoryShow] = useState(false);
  const [addCategoryShow, setAddCategoryShow] = useState(false);
  const [categories, setCategories] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [addNewBank, setAddNewBank] = useState(false);



  const handleStartChange = (date) => {
    setStartDate(date);
  };

  const handleEndChange = (date) => {
    setEndDate(date);
  };

  const handleBankClose = () => setBankShow(false)

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleAddExpense = () => {
    setTypeOfTransaction("Expense")
    handleShow();
  }

  const handleAddIncome = () => {
    setTypeOfTransaction("Credit")
    handleShow();
  }


  useEffect(() => {
    const avatarFunc = async () => {
      if (localStorage.getItem("user")) {
        const user = JSON.parse(localStorage.getItem("user"));
        console.log(user);

        if (user.isAvatarImageSet === false || user.avatarImage === "") {
          navigate("/setAvatar");
        }
        setcUser(user);
        setRefresh(true);
      } else {
        navigate("/login");
      }
    };

    avatarFunc();
  }, [navigate]);

  //to give the padding below if its mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [values, setValues] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    transactionType: "",
    selectedBank: 0,
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    console.log(e.target.value, values)
  };

  const handleAddNewBankAccount = () => {
    dispatch({ type: "addBankModal", payload: true })
  }

  const handleAddNewBankAccountClose = () => {
    dispatch({ type: "addBankModal", payload: false })
  }

  const handleCategoryClose = () => {
    setCategoryShow(false);
  }

  const handleAddNewCategory = () => {
    dispatch({ type: "addCategoryModal", payload: true })
  }

  const handleCloseLoanModal = () => {
    dispatch({ type: "loanModalVisibility", payload: false })
  }

  const handleOpenLoanSummary = ()=>{
    dispatch({ type: "loanSummaryVisibility", payload: true })
  }

  const handleOpenAddLoanModal = ()=>{
    dispatch({ type: "addLoanModalVisibility", payload: true })
  }

  const handleCloseFriendModal =()=>{
    dispatch({ type: "friendsModalVisibility", payload: false })
  }

  const handleOpenSearchFriendModal = ()=>{
    dispatch({ type: "searchFriendModalVisibility", payload: true })
  }





  const handleResetButtonVisibility = () => {
    if (type === "all" && frequency === "7")
      setFilterApplied(true)
    else
      setFilterApplied(false)
  }
  const handleChangeFrequency = (e) => {
    setFrequency(e.target.value);
    handleResetButtonVisibility()
  };

  const handleSetType = (e) => {
    setType(e.target.value);
    handleResetButtonVisibility()
  };

  const setBankAndCategories = async () => {
    const responseData = await getBankDetail(cUser.email);
    console.log("resppp : ", responseData)
    dispatch({ type: "banks", payload: responseData.bankDetaile })
    dispatch({ type: "categories", payload: responseData.categories })
    dispatch({ type: "loansLent", payload: responseData.loansLent })
    dispatch({ type: "loansBorrowed", payload: responseData.loansBorrowed })
    dispatch({ type: "friendRequest", payload: responseData.receivedFriendRequests })
    dispatch({ type: "myFriends", payload: responseData.myFriends })
    dispatch({ type: "friendRequestSent", payload: responseData.sentFriendRequests })
  }



  const handleReset = () => {
    setType("all");
    setStartDate(null);
    setEndDate(null);
    setFrequency("7");
    setFilterApplied(false);
  };

  const fetchAllTransactions = async () => {
    try {
      dispatch({ type: "loading", payload: true })
      console.log(cUser._id, frequency, startDate, endDate, type);
      await setBankAndCategories();
      const { data } = await axios.post(getTransactions, {
        userId: cUser._id,
        frequency: frequency,
        startDate: startDate,
        endDate: endDate,
        type: type,
      });
      console.log(data);

      setTransactions(data.transactions);
      // let category = ;
      // category = category.categories

      // setCategories(JSON.parse(localStorage.getItem("user")).categories);
      // dispatch({type:"categories" , payload:categories})
      console.log("categorye : ", categories)
      dispatch({ type: "loading", payload: false })
    } catch (err) {
      // toast.error("Error please Try again...", toastOptions);
      dispatch({ type: "loading", payload: false })
    }
  };



  useEffect(() => {



    fetchAllTransactions();
  }, [refresh, frequency, endDate, type, startDate, data.fullAppRefresh]);

  const handleTableClick = (e) => {
    setView("table");
  };

  const handleChartClick = (e) => {
    setView("chart");
  };

  return (
    <>
      <Header view={view} setBankShow={setBankShow} setCategoryShow={setCategoryShow} handleAddIncome={handleAddIncome} handleAddExpense={handleAddExpense} handleTableClick={handleTableClick} handleChartClick={handleChartClick} />

      {data.loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          {console.log("category , bank", data.banks, data.categories)}
          <Container
            style={{ position: "relative", zIndex: "2 !important", paddingBottom: isMobile ? "25%" : "0", }}
            className="mt-3"
          >
            <div className="filterRow">


              <div>

                {data.transactionModalVisibility && <ModelForm />}



                <Modal show={bankShow} onHide={handleBankClose} centered>
                  <Modal.Header closeButton>
                    <div className="d-flex justify-content-between w-100 align-items-center">
                      <Modal.Title>Bank Details</Modal.Title>
                      <Button variant="success" onClick={handleAddNewBankAccount}>
                      <i class="fas fa-plus"></i>
                      </Button>
                    </div>
                  </Modal.Header>
                  <Modal.Body style={{ height: '70vh', overflowY: 'auto' }}>
                  < Bank handleAddNewBankAccount={handleAddNewBankAccount} refresh={refresh} setRefresh={setRefresh} />
                  </Modal.Body>
                </Modal>
                <AddBankModal />
                <Modal show={categoryShow} onHide={handleCategoryClose} centered>

                  <Modal.Header closeButton>
                    <div className="d-flex justify-content-between w-100 align-items-center">
                      <Modal.Title className="">Category Details</Modal.Title>
                      <Button variant="success" onClick={handleAddNewCategory}>
                      <i class="fas fa-plus"></i>
                      </Button>
                    </div>
                  </Modal.Header>
                  <Modal.Body style={{ height: '70vh', overflowY: 'auto' }}>
                  <Category refresh={refresh} setRefresh={setRefresh}></Category>
                  
                  </Modal.Body>
                </Modal>
                <AddCategoryModal />

               

                <Modal show={data.loanModalVisibility} onHide={handleCloseLoanModal} centered >

                  <Modal.Header closeButton>
                    <div className="d-flex justify-content-between w-100 align-items-center">
                      <Modal.Title className="">Loan Details</Modal.Title>
                      <div >
                      <Button variant="success" className="m-2" onClick={handleOpenLoanSummary}>
                      <i class="fas fa-receipt"></i>
                      </Button>
                      <Button variant="success" onClick={handleOpenAddLoanModal}>
                      <i class="fas fa-plus"></i>
                      </Button>
                      </div>
                    </div>
                  </Modal.Header>
                  <Modal.Body style={{ height: '70vh', overflowY: 'auto' }}>
                  <Loans></Loans>
                  </Modal.Body>
                  

                </Modal>
                <AddLoanModal />
                <LoanSummary />

                <Modal show={data.friendsModalVisibility} onHide={handleCloseFriendModal} centered  style={{ minHeight: '50%' }}>

                  <Modal.Header closeButton>
                    <div className="d-flex justify-content-between w-100 align-items-center">
                      <Modal.Title className="">Friend Details</Modal.Title>
                      <Button variant="success" onClick={handleOpenSearchFriendModal}>
                      <i class="fas fa-user-plus"></i>

                      </Button>
                    </div>
                  </Modal.Header>
                  <Modal.Body style={{ height: '70vh', overflowY: 'auto' }}>
                  <Friends></Friends>
                  </Modal.Body>
                  

                </Modal>
                <FriendSearch></FriendSearch>

              </div>
            </div>
            <br style={{ color: "white" }}></br>

            {frequency === "custom" ? (
              <>
                <div className="date">
                  <div className="form-group">
                    <label htmlFor="startDate" className="text-white">
                      Start Date:
                    </label>
                    <div>
                      <DatePicker
                        selected={startDate}
                        onChange={handleStartChange}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="endDate" className="text-white">
                      End Date:
                    </label>
                    <div>
                      <DatePicker
                        selected={endDate}
                        onChange={handleEndChange}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}






            {view === "table" ? (
              <>
                {console.log("hehehe")}
                <Banks banks={banks}></Banks>
                <TableData data={transactions} user={cUser} banks={banks} frequency={frequency} setFrequency={setFrequency} />
              </>
            ) : (
              <>
                <Analytics transactions={transactions} />
              </>
            )}
           
            <ToastContainer />
          </Container>
        </>
      )}
    </>
  );
};

export default Home;
