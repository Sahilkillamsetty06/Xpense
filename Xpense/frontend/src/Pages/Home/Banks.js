import React, { useContext, useState } from "react";
import { Button, Container, Row, Col, OverlayTrigger, Tooltip } from "react-bootstrap";
import AnimatedSection from "../../utils/AnimatedSection";
import { AppContext } from "../../components/Context/AppContext";


const Banks = ({banks }) => {

    const {data,dispatch} = useContext(AppContext);
   
    const [visibleBanks, setVisibleBanks] = useState(window.innerWidth < 768 ? 3 : 12); // Set initial visible data.banks based on screen width

    const handleShowMore = () => {

         setVisibleBanks((prev) => {
            if (prev >= data.banks.length) {
                return window.innerWidth < 768 ? 3 : 12;
            } else {
                return Math.min(prev + (window.innerWidth < 768 ? 3 : 12), data.banks.length);
            }
        });
        
    };

    let isExpanded
    if(data.banks)
     isExpanded = visibleBanks >= data.banks.length;
    // Effect to handle window resize
    
    return (
        <>
            <Container>
            
                <Row className="data.banks">
                    {data.banks && data.banks.length === 0 ? (
                        <p>No banks available</p>
                    ) : (
                       data.banks && data.banks.slice(0, visibleBanks).map((bank, index) => (
                            
                                <Col xs={4} md={1}>
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={<Tooltip>{`Balance: ₹${bank.accountBalance}`}</Tooltip>}
                                    >
                                        {/* <AnimatedSection key={index} transitionType="animate__fadeIn"> */}
                                        <Button className="mb-3 same-size-button bank-button" variant="dark">
                                            {bank.bankName}
                                        </Button>
                                        {/* </AnimatedSection> */}
                                    </OverlayTrigger>
                                </Col>
                           
                        ))
                    )}
                </Row>
                {data.banks && data.banks.length >= visibleBanks && ( // Show "Show More" button if there are more data.banks
                //    <AnimatedSection transitionType="animate__fadeIn">
                    <Row className="justify-content-center">
                    
                    <Button onClick={handleShowMore} className="mt-3 no-bg bankNames" variant="dark">
                                    {isExpanded ? "Show Less" : "Show More"}{" "}
                                    <i className={isExpanded ? "fas fa-chevron-up" : "fas fa-chevron-down"} />
                        </Button>
                    </Row>
                    // </AnimatedSection>
                )}
               
            </Container>
        </>
    );
};

export default Banks;
