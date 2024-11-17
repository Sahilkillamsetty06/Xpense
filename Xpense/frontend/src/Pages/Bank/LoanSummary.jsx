import React, { useContext } from "react";
import { AppContext } from "../../components/Context/AppContext";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { Box, Button } from "@mui/material";
import { Modal } from "react-bootstrap";
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';


const StyledCard = styled(Card)(({ theme }) => ({
    margin: "10px 5%",
    padding: "5px",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    height: 'auto', // Auto height to adjust based on content
}));

const StyledCardHeader = styled(CardHeader)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '64px', // Fixed height for the header
});


export const LoanSummary = () => {
    const { data, dispatch } = useContext(AppContext);

    const handleModalClose = () => {
        dispatch({ type: "loanSummaryVisibility", payload: false })
    }

    const borrowed = data.loansBorrowed || [];
    const lent = data.loansLent || [];



    // Helper function to calculate person-wise totals
    let consoldatedList = {};
    let letAuxList = {}
    const calculatePersonWiseTotal = (loans, isLent) => {
        const personTotals =  loans.reduce((acc, loan) => {
            const personId = isLent ? loan.borrowerName : loan.lenderName;
            const personName = isLent ? loan.borrowerName : loan.lenderName;

            // Initialize if person not in accumulator
            if (loan.loanStatus === "pending") {
                if (!acc[personName]) {
                    acc[personName] = { name: personName, total: 0 };
                }

                // Add loan amount to person's total
                if (isLent) {
                    acc[personName].total = acc[personName].total + loan.loanAmount - loan.repaidLoanAmount;
                } else {
                    acc[personName].total =  acc[personName].total - loan.loanAmount + loan.repaidLoanAmount;
                }
            }

            return acc;

        },letAuxList);

        consoldatedList = Object.values(personTotals);
        return consoldatedList;
    };

    // Calculate person-wise totals for borrowed and lent


    const borrowedTotals = calculatePersonWiseTotal(borrowed, false);
    const lentTotals = calculatePersonWiseTotal(lent, true);

    console.log(borrowedTotals, lentTotals, consoldatedList)

    return (
        <Modal show={data.loanSummaryVisibility} onHide={handleModalClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Loan Summary</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ height: '70vh', overflowY: 'auto' }}>
                {consoldatedList ?
                    consoldatedList.map((list,index)=>{
                        return(
                            <StyledCard>
                                <StyledCardHeader
                                avatar={
                                    <Avatar sx={{bgcolor: list.total < 0 ? 'green' : 'red' }}>
                                        
                                    </Avatar>
                                }
                                title={<Typography variant="h6" sx={{ fontSize: '1rem' }}>{list.name}</Typography>}
                                subheader={<Typography variant="body2" sx={{ fontSize: '0.875rem' }}>{list.total<0? `You need to pay ${list.name}` : `${list.name} needs to pay you`} {list.total>0?list.total: (-1*list.total)}</Typography>}
                                action={
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                        {/* {loan.loanStatus === "pending" &&
                                            <IconButton
                                                aria-label="edit"
                                                onClick={() => handleEditLoan(loan._id)}
                                                sx={{ color: 'black' }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        } */}
                                        {/* {loan.loanStatus !== "inApproval" &&
                                            <IconButton
                                                aria-label="delete"
                                                onClick={() => {
                                                    handleDeleteLoan(loan._id, loan.lender, loan.borrower)
                                                }}
                                                sx={{ color: 'red' }}
                                            >
                                                <DeleteForeverSharpIcon />
                                            </IconButton>
                                        }

                                        {loan.loanStatus === "pending" &&
                                            <IconButton
                                                aria-label="edit"
                                                sx={{ color: 'black' }}
                                            >
                                                <HourglassEmptyIcon />
                                            </IconButton>
                                        }

                                        {loan.loanStatus === "inApproval" &&
                                            <IconButton
                                                aria-label="Approve this request"
                                                sx={{ color: 'black' }}
                                                onClick={() => handleMarkAsPaid(loan._id)}
                                            >
                                                <ThumbUpIcon />
                                            </IconButton>}

                                            {loan.loanStatus === "inApproval" &&
                                            <IconButton
                                                aria-label="Reject this request"
                                                sx={{ color: 'black' }}
                                                onClick={() => handleDemoteRequest(loan._id)}
                                            >
                                                <ThumbDownIcon />
                                            </IconButton>} */}
                                        
                                    </Box>
                                }
                            />
                            </StyledCard>
                        )
                    })
            : <div>No loans taken</div>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary">
                    Close
                </Button>

                <Button variant="primary" >
                    Ok
                </Button>
                {/* <Button variant="primary" onClick={handleSubmit} disabled={nameAlreadyExistsError}>
                      Submit
                    </Button> */}
            </Modal.Footer>
        </Modal>
    )
}