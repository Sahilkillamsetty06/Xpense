

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Navbar, Nav, Button, Container, Dropdown } from 'react-bootstrap';
import './style.css';
import { useNavigate } from 'react-router-dom';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import BarChartIcon from "@mui/icons-material/BarChart";
import { AppContext } from './Context/AppContext';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

const Header = (props) => {
  const { data, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const [user, setUser] = useState();

  const handleShowLogin = () => {
    navigate('/login');
  };

  const handleLoanVisibility = () => {
    dispatch({ type: "loanModalVisibility", payload: true })
  }

  const handleFriendsVisibility = () => {
    dispatch({ type: "friendsModalVisibility", payload: true })
  }

  const handleAddTransaction = (transactionType) => {
    dispatch({ type: "editDetails", payload: { edit: false, transactionType: transactionType } })
    dispatch({ type: "transactionModalVisibility", payload: true });
  }

  useEffect(() => {
    if (localStorage.getItem('user')) {
      const user = JSON.parse(localStorage.getItem('user'));
      setUser(user);
    }
  }, []);

  const handleShowLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // particles loaded
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <Particles
          id="tsparticles"
          init={particlesInit}
          loaded={particlesLoaded}
          options={{
            background: {
              color: {
                value: '#000',
              },
            },
            fpsLimit: 60,
            particles: {
              number: {
                value: 200,
                density: {
                  enable: true,
                  value_area: 800,
                },
              },
              color: {
                value: '#ffcc00',
              },
              shape: {
                type: 'circle',
              },
              opacity: {
                value: 0.5,
                random: true,
              },
              size: {
                value: 3,
                random: { enable: true, minimumValue: 1 },
              },
              links: {
                enable: false,
              },
              move: {
                enable: true,
                speed: 2,
              },
              life: {
                duration: {
                  sync: false,
                  value: 3,
                },
                count: 0,
                delay: {
                  random: {
                    enable: true,
                    minimumValue: 0.5,
                  },
                  value: 1,
                },
              },
            },
            detectRetina: true,
          }}
          style={{
            position: 'absolute',
            zIndex: -1,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      </div>

      <div>
        <Navbar
          className="navbarCSS"
          collapseOnSelect
          expand="lg"
          style={{ position: 'relative', zIndex: '2' }}
        >
          <Container>
            <Navbar.Brand href="/" className="text-white navTitle">
              XPENS
            </Navbar.Brand>

            <Nav>
              <div className="text-white iconBtnBox d-lg-none">

                <FormatListBulletedIcon
                  sx={{ cursor: "pointer" }}
                  onClick={() => props.handleTableClick()}
                  className={`${props.view === "table" ? "iconActive" : "iconDeactive"
                    } `}

                >

                </FormatListBulletedIcon>

                <BarChartIcon
                  sx={{ cursor: "pointer" }}
                  onClick={() => props.handleChartClick()}
                  className={`${props.view === "chart" ? "iconActive" : "iconDeactive"
                    }`}
                />
              </div>
            </Nav>
            <Nav>
              <Button
                variant="danger"
                onClick={handleShowLogout}
                className=" d-lg-none"
              // style={{ height:"40px" }}
              >
                <i className="fas fa-sign-out-alt"></i> <small></small>
              </Button>
            </Nav>


            <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
              {user ? (
                <>

                  <Nav>
                    <Button
                      variant="outline-light"
                      onClick={() => props.handleTableClick()}
                      // className="mx-1 navButton"
                      className={`${props.view === "table" ? "iconActive" : "iconDeactive"} mx-1 navButton`}
                    >
                      <i className="fas fa-th-large"></i> <small>Table view</small>
                    </Button>
                  </Nav>

                  <Nav>
                    <Button
                      variant="outline-light"
                      onClick={() => props.handleChartClick()}
                      className={`${props.view === "chart" ? "iconActive" : "iconDeactive"} mx-1 navButton`}
                    >
                      <i className="fas fa-chart-bar"></i> <small>Analysis</small>
                    </Button>
                  </Nav>
                  <Nav>

                  </Nav>
                  <Nav>
                    <Button
                      variant="outline-light"
                      onClick={() => props.setBankShow(true)}
                      className="mx-1 navButton"
                    >
                      <i className="fas fa-university"></i> <small>Bank</small>
                    </Button>
                  </Nav>
                  <Nav>
                    <Button
                      variant="outline-light"
                      onClick={() => props.setCategoryShow(true)}
                      className="mx-1 navButton"
                    >
                      <i className="fas fa-list-alt"></i> <small>Category</small>
                    </Button>
                    <Button
                      variant="outline-light"
                      onClick={() => handleAddTransaction("Credit")}
                      className="mx-1 navButton"
                    >
                      <i className="fas fa-plus-circle"></i> <small>Income</small>
                    </Button>
                    <Button
                      variant="outline-light"
                      onClick={() => handleAddTransaction("Expense")}
                      className="mx-1 navButton"
                    >
                      <i className="fas fa-minus-circle"></i> <small>Expense</small>
                    </Button>
                  </Nav>


                  <Nav>



                    {/* Laptop Avatar Dropdown */}
                      {/* Avatar with Dropdown Menu */}
                      
                        {/* <IconButton  style={{ zIndex: 3 }}> */}
                        <Button
                            variant="outline-light"
                            className="mx-1 navButton"
                            onClick={handleMenuOpen}
                            
                          >
                            <i class="fas fa-user"></i><small>{JSON.parse(localStorage.getItem("user")).userName}</small>
                           </Button>
                        {/* </IconButton> */}
                        
                        

                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                      >
                        <MenuItem onClick={() => { handleLoanVisibility(); handleMenuClose(); }}>
                          <i className="fas fa-coins" style={{ marginRight: '8px' }}></i>
                          Loans
                        </MenuItem>
                        <MenuItem onClick={() => { handleFriendsVisibility(); handleMenuClose(); }}>
                          <i className="fas fa-user-friends" style={{ marginRight: '8px' }}></i>
                          Friends
                        </MenuItem>
                        <MenuItem
                          onClick={() => { handleShowLogout(); handleMenuClose(); }}
                          style={{ color: 'red' }} // Set Logout text color to red
                        >
                          <i className="fas fa-sign-out-alt" style={{ marginRight: '8px' }}></i>
                          Logout
                        </MenuItem>
                      </Menu>
                   



                  </Nav>

                </>
              ) : (
                <Nav>
                  <Button
                    variant="primary"
                    onClick={handleShowLogin}
                    className="mx-1 navButton"
                  >
                    Login
                  </Button>
                </Nav>
              )}
            </Navbar.Collapse>
          </Container>

          {/* Mobile Bottom Navbar */}
          {/* Mobile Bottom Navbar */}
          {user && (
            <div className="navButtons-bottom d-lg-none" style={{ display: 'flex', overflowX: 'auto', whiteSpace: 'nowrap' }}>
              <Button
                variant="outline-light"
                onClick={() => props.setBankShow(true)}
                className="mx-1 navButton"
              >
                <i className="fas fa-university"></i> <small>Bank</small>
              </Button>
              <Button
                variant="outline-light"
                onClick={() => props.setCategoryShow(true)}
                className="mx-1 navButton"
              >
                <i className="fas fa-list-alt"></i> <small>Category</small>
              </Button>
              <Button
                variant="outline-light"
                onClick={() => handleAddTransaction("Credit")}
                className="mx-1 navButton"
              >
                <i className="fas fa-plus-circle"></i> <small>Income</small>
              </Button>
              <Button
                variant="outline-light"
                onClick={() => handleAddTransaction("Expense")}
                className="mx-1 navButton"
              >
                <i className="fas fa-minus-circle"></i> <small>Expense</small>
              </Button>

              {/* Additional Buttons */}
              <Button
                variant="outline-light"
                onClick={handleLoanVisibility}
                className="mx-1 navButton"
              >
                <i className="fas fa-coins"></i> <small>Loans</small>
              </Button>
              <Button
                variant="outline-light"
                onClick={handleFriendsVisibility}
                className="mx-1 navButton"
              >
                <i className="fas fa-user-friends"></i> <small>Friends</small>
              </Button>
            </div>
          )}
        </Navbar>
      </div>
    </>
  );
};

export default Header;
