import React, { useEffect, useState } from 'react';
import { PieChart,pieArcLabelClasses } from '@mui/x-charts/PieChart';


const PieChartComponent = ({ transactions, tranasactionTypes }) => {

  const [transactionList,setTransactionList] = useState([])

  function getSameTransactionList(arr) {

    const filteredList = transactions.filter((value) => {

      if (value.transactionType === tranasactionTypes) {
          return true; // Keep this item
      }
      return false; // Exclude this item
  });

  console.log(filteredList);
  return filteredList;
  }

  const calculateCategoryTotals = (transactions) => {

    const categoryTotals = transactions.reduce((acc, transaction) => {
      
      const { category, amount } = transaction;
      if (acc[category] ) {
        acc[category] += amount;
      } else {
        acc[category] = amount;
      }
      
    
    return acc;
    }, {});
  
    const formattedTotals = Object.keys(categoryTotals).map(category => ({
      category,
      amount: categoryTotals[category],
  }));

  return formattedTotals;
  };

  const setTransactionsCategory = ()=>{
    let sameTransactionList = getSameTransactionList(transactions);
    setTransactionList(calculateCategoryTotals(sameTransactionList))
  }
  
  useEffect(()=>{
    setTransactionsCategory();
  },[])


  return (
    <div className="d-flex flex-column align-items-center">
      {transactionList && transactionList.length!==0 ?
        <PieChart 
        series={[
          {
              data: transactionList.map((item) => ({
                  id: item.category,
                  value: item.amount,
                  label:item.category,
                  
              })),
             
              cx: "80%",
              cy: "30%",
              arcLabel: (item) => `${item.label}`,
                  arcLabelMinAngle: 35,
          },
      ]}
      sx={{
        [`& .${pieArcLabelClasses.root}`]: {
          // fontWeight: 'bold',
        },
      }}
       width={250}
      height={250}
      slotProps={{
        legend: {
          direction: 'row',
          position: { vertical: 'bottom', horizontal: 'middle' },
          padding: 0,
        },
      }}
      
        >

        </PieChart>:
        `No ${tranasactionTypes} transaction` 
}
    </div>
  );
};

export default PieChartComponent;
