import React from "react";
// import CardBox from "./CardBox";
import { Container, Row } from "react-bootstrap";
import CircularProgressBar from "../../components/CircularProgressBar";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
// import MovingIcon from '@mui/icons-material/Moving';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PieChartComponent from "../../components/LineProgressBar";


const Analytics = ({ transactions }) => {
  const TotalTransactions = transactions.length;
  const totalIncomeTransactions = transactions.filter(
    (item) => item.transactionType === "Credit"
  );
  const totalExpenseTransactions = transactions.filter(
    (item) => item.transactionType === "Expense"
  );

  let totalIncomePercent =
    (totalIncomeTransactions.length / TotalTransactions) * 100;
  let totalExpensePercent =
    (totalExpenseTransactions.length / TotalTransactions) * 100;

  // console.log(totalIncomePercent, totalExpensePercent);

  const totalTurnOver = transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );
  const totalTurnOverIncome = transactions
    .filter((item) => item.transactionType === "Credit")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalTurnOverExpense = transactions
    .filter((item) => item.transactionType === "Expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const TurnOverIncomePercent = (totalTurnOverIncome / totalTurnOver) * 100;
  const TurnOverExpensePercent = (totalTurnOverExpense / totalTurnOver) * 100;

  // const categories = 

  let categories = transactions && transactions.map((transaction) => { return transaction.category });
    categories = Array.from(new Set(categories))
    console.log(categories)


  const colors = {
    "Groceries": '#FF6384',
    "Rent": '#36A2EB',
    "Salary": '#FFCE56',
    "Tip": '#4BC0C0',
    "Food": '#9966FF',
    "Medical": '#FF9F40',
    "Utilities": '#8AC926',
    "Entertainment": '#6A4C93',
    "Transportation": '#1982C4',
    "Other": '#F45B69',
  };
  
  

  return (
    <>
      <Container   className="mt-5 ">
        <Row>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header bg-black text-white">
                <span style={{ fontWeight: "bold" }}>Total Transactions:</span>{" "}
                {TotalTransactions}
              </div>
              <div className="card-body">
                <h5 className="card-title " style={{color: "green"}}>
                  Income: <ArrowDropUpIcon/>{totalIncomeTransactions.length}
                </h5>
                <h5 className="card-title" style={{color: "red"}}>
                  Expense: <ArrowDropDownIcon />{totalExpenseTransactions.length}
                </h5>

                <div className="d-flex justify-content-center mt-3">
                  <CircularProgressBar
                    percentage={totalIncomePercent.toFixed(0)}
                    color="green"
                  />
                </div>

                <div className="d-flex justify-content-center mt-4 mb-2">
                  <CircularProgressBar
                    percentage={totalExpensePercent.toFixed(0)}
                    color="red"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header bg-black text-white ">
                <span style={{ fontWeight: "bold" }}>Total TurnOver:</span>{" "}
                {totalTurnOver}
              </div>
              <div className="card-body">
                <h5 className="card-title" style={{color: "green"}}>Income: <ArrowDropUpIcon /> {totalTurnOverIncome} <CurrencyRupeeIcon /></h5>
                <h5 className="card-title" style={{color: "red"}}>Expense: <ArrowDropDownIcon />{totalTurnOverExpense} <CurrencyRupeeIcon /></h5>
                <div className="d-flex justify-content-center mt-3">
                  <CircularProgressBar
                    percentage={TurnOverIncomePercent.toFixed(0)}
                    color="green"
                  />
                </div>

                <div className="d-flex justify-content-center mt-4 mb-4">
                  <CircularProgressBar
                    percentage={TurnOverExpensePercent.toFixed(0)}
                    color="red"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header  bg-black text-white">
                <span style={{ fontWeight: "bold" }}>Categorywise Income</span>{" "}
              </div>
              <div className="card-body">
              
                      <PieChartComponent  transactions={transactions} tranasactionTypes="Credit"/>


              </div>
            </div>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-header  bg-black text-white">
                <span style={{ fontWeight: "bold" }}>Categorywise Expense</span>{" "}
              </div>
              <div className="card-body">
               
                    <PieChartComponent  transactions={transactions} tranasactionTypes="Expense"/>


              </div>
            </div>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Analytics;
