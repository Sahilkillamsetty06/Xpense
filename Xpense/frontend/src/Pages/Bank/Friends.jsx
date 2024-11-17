import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import { Box, Button } from "@mui/material";
import DeleteForeverSharpIcon from '@mui/icons-material/DeleteForeverSharp';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AppContext } from '../../components/Context/AppContext';
import { acceptNewFriendRequest, deleteNewFriendRequest } from '../../utils/ApiRequest';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteFriend } from '../../utils/FetchApi';

const StyledCard = styled(Card)(({ theme }) => ({
  margin: "10px 5%",
  padding: "5px",
  borderRadius: "8px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  height: 'auto', // Auto height to adjust based on content
}));

const StyledCardHeader = styled(CardHeader)( {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: '64px', // Fixed height for the header
});

function getAvatarColor(name) {
  const colors = [red[500]];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export const Friends = (props) => {
  const { data, dispatch } = React.useContext(AppContext);  // Assuming `data` is passed as a prop
  const [friendsView, setFriendsView] = React.useState("request");
  const myName = JSON.parse(localStorage.getItem("user")).userName;

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

  const handleChangefriendsView = (loanType) => {
    setFriendsView(loanType);
  };

  const handleDeleteLoan = (loanId) => {
    // Handle loan deletion logic here
    console.log("Delete Loan:", loanId);
  };

  const acceptFriendRequest = async (friend)=>{
    try {
        const response = await axios.post(acceptNewFriendRequest, { receiverId:friend._id, senderId:JSON.parse(localStorage.getItem("user"))._id });
        if (response.status === 200) {
            // dispatch
            dispatch({type:"acceptFriendRequest" , payload:friend});
            toast.success(response.data.message, toastOptions);
            
        }
    } catch (error) {
        console.error("Error accepting request:", error);
        alert("Error accepting request.");
    }
  }

  const deleteFriendRequest = async (friendId)=>{
    try {
        const response = await axios.post(deleteNewFriendRequest, { receiverId:friendId, senderId:JSON.parse(localStorage.getItem("user"))._id });
        if (response.status === 200) {
            dispatch({type:"deleteFriendRequest" , payload:friendId});
            toast.success(response.data.message, toastOptions);
        }
    } catch (error) {
        console.error("Error adding friend:", error);
        alert("Failed to reject request.");
    }
  }

  const handleDeleteFriend = async (friendId)=>{
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    try{
        const responseData = await deleteFriend(userId,friendId);
        console.log(responseData)
        if(responseData.success){
            dispatch({type:"deleteFriend", payload:friendId});
            toast.success(responseData.message, toastOptions);
        }else{
            toast.error(responseData.message,toastOptions)
        }
    }catch(err){
        console.log(err)
    }
  }

  React.useEffect(()=>{
    console.log("useeffect called")
  },[data.friendRequest, data.myFriends])

  return (
    <Box>
      <div className="d-flex justify-content-around w-100 align-items-center data-table">
        <Button 
          variant="text" 
          onClick={() => handleChangefriendsView("request")} 
          sx={{
            textDecoration: friendsView === "request" ? "underline" : "none",
            fontSize: friendsView === "request" ? "0.875rem" : "1rem",
          }}
        >
          Friend Requests
        </Button>
        <Button 
          variant="text" 
          onClick={() => handleChangefriendsView("friends")} 
          sx={{
            textDecoration: friendsView === "friends" ? "underline" : "none",
            fontSize: friendsView === "friends" ? "0.875rem" : "1rem",
          }}
        >
          My Friends
        </Button>
      </div>
      {console.log("request : ",data.friendRequest)}
      {friendsView === "request" ? (
        data.friendRequest && data.friendRequest.length !== 0 ? (
          data.friendRequest.map((friendReq) => (
            <StyledCard key={friendReq._id}>
              <StyledCardHeader
                avatar={
                //   <Avatar sx={{ bgcolor: getAvatarColor(loan.borrowerName) }}>
                <Avatar src={friendReq.avatarImage}>
                  </Avatar>
                }
                title={<Typography variant="h6" sx={{ fontSize: '1rem' }}>{friendReq.name}</Typography>}
                action={
                  <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                     <IconButton
                      aria-label="mark as paid"
                      onClick={() => acceptFriendRequest(friendReq)}
                      sx={{ color: 'green' }}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      onClick={() => deleteFriendRequest(friendReq._id)}
                      sx={{ color: 'red' }}
                    >
                      <DeleteForeverSharpIcon />
                    </IconButton>
                   
                  </Box>
                }
              />
              
            </StyledCard>
          ))
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography>No Requests</Typography>
          </Box>
        )
      ) : (
        data.myFriends && data.myFriends.length !== 0 ? (
          data.myFriends.map((friends) => (
            <StyledCard key={friends._id}>
              <StyledCardHeader
                avatar={
                //   <Avatar sx={{ bgcolor: getAvatarColor(myName) }}>
                <Avatar  src={friends.avatarImage}>    
               
                  </Avatar>
                }
                title={<Typography variant="h6" sx={{ fontSize: '1rem' }}>{friends.name}</Typography>}
                action={
                  <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                    {/* <IconButton
                      aria-label="edit"
                    //   onClick={() => handleEditLoan(friends._id)}
                      sx={{ color: 'black' }}
                    >
                      <EditIcon />
                    </IconButton> */}
                    <IconButton
                      aria-label="delete"
                      onClick={() => handleDeleteFriend(friends._id)}
                      sx={{ color: 'red' }}
                    >
                      <DeleteForeverSharpIcon />
                    </IconButton>
                    
                  </Box>
                }
              />
              <CardContent sx={{ padding: '8px' }}>
               {/* TODO to give consiladated loan amount */}
               </CardContent>
            </StyledCard>
          ))
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography>No Friends </Typography>
          </Box>
        )
      )}
    </Box>
  );
};
