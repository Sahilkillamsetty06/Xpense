import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios'; // Import axios
import { debounce } from 'lodash'; // Use lodash for debouncing

import { AppContext } from '../../components/Context/AppContext';
import { addNewFriend, searchFriend } from '../../utils/ApiRequest';
import { Modal, Button, Form, ListGroup } from 'react-bootstrap';
import { FaUserPlus, FaUserFriends } from 'react-icons/fa';
import { styled } from '@mui/material/styles';
import { sendFriendRequest } from '../../utils/FetchApi';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { CheckCircle } from '@mui/icons-material';

const FriendSearch = () => {
    const { data, dispatch } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestedFriends, setSuggestedFriends] = useState([]);
    const [requestSent, setRequestSent] = useState(false); // New state for tracking sent requests
    const myFriendIds = new Set(data.myFriends && data.myFriends.map(friend => friend._id)); 
    const requestSentIds = new Set(data.friendRequestSent && data.friendRequestSent.map(friend => friend._id)); 

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

    const handleModalClose = () => {
        dispatch({ type: "searchFriendModalVisibility", payload: false });
    }

    // Function to handle input change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Fetch suggested friends based on the search term
    const fetchSuggestedFriends = async (term) => {
        if (term.length < 3) {
            setSuggestedFriends([]); // Return early if search term is too short
            return;
        }

        try {
            const response = await axios.get(searchFriend, {
                params: { query: term }, // Use params to send the query
            });
            setSuggestedFriends(response.data); // Assume the response contains an array of user objects
        } catch (error) {
            console.error("Error fetching suggested friends:", error);
        }
    };

    // Debounce the search input
    const debouncedFetch = debounce(fetchSuggestedFriends, 300);

    useEffect(() => {
        debouncedFetch(searchTerm);
        return () => {
            debouncedFetch.cancel(); // Cancel the debounced function on cleanup
        };
    }, [searchTerm]);

    // Use effect to fetch suggested friends when a request is sent
    useEffect(() => {
        if (requestSent) {
            debouncedFetch(searchTerm);
            setRequestSent(false); // Reset the request sent state
        }
    }, [requestSent, searchTerm]);

    const addFriend = async (friend) => {
        if (myFriendIds.has(friend._id)) {
            alert("This user is already your friend!");
            return;
        }

        try {
            const responseData = await sendFriendRequest(friend._id, JSON.parse(localStorage.getItem("user"))._id);
            if (responseData.success) {
                dispatch({ type: "addFriendRequestId", payload: {_id:friend._id, avatarImage:friend.avatarImage, name:friend.name} });
                setRequestSent(true); // Set request sent state to true
                toast.success(responseData.message, toastOptions);
            } else {
                toast.error(responseData.message, toastOptions);
            }
        } catch (error) {
            console.error("Error adding friend:", error);
            alert("Failed to add friend.");
        }
    };

    return (
        <Modal show={data.searchFriendModalVisibility} onHide={handleModalClose} aria-labelledby="add-friend-modal">
            <Modal.Header closeButton>
                <Modal.Title>Add a Friend</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ height: '70vh', overflowY: 'auto' }}>
                {/* Search Input */}
                <Form>
                    <Form.Group controlId="searchFriend">
                        <Form.Control
                            type="text"
                            placeholder="Search for friends..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </Form.Group>
                </Form>

                {/* Friends List */}
                <ListGroup>
                    {suggestedFriends.length > 0 && console.log("suggested friends : ", suggestedFriends)}
                    {suggestedFriends.length > 0 ? (
                        suggestedFriends.map((friend) => (
                            <ListGroup.Item key={friend._id} className="d-flex justify-content-between align-items-center">
                                <div>
                                    <img src={friend.avatarImage} style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                                    <strong>{friend.name}</strong>
                                </div>
                                <div>
                                    {myFriendIds.has(friend._id) ? (
                                        <Button variant="white" title="Already Friends">
                                            <CheckCircle />
                                        </Button>
                                    ) : (
                                        requestSentIds.has(friend._id) ? (
                                            <Button variant="white" title="Request sent">
                                                <HourglassEmptyIcon />
                                            </Button>
                                        ) : (
                                            <Button
                                                size="sm"
                                                onClick={() => addFriend(friend)}
                                               
                                            >
                                                <i class="fas fa-user-plus"></i>
                                            </Button>
                                        )
                                    )}
                                </div>
                            </ListGroup.Item>
                        ))
                    ) : (
                        <div className="text-center mt-3">No friends found. Try a different search term.</div>
                    )}
                </ListGroup>
            </Modal.Body>
        </Modal>
    );
};

export default FriendSearch;
