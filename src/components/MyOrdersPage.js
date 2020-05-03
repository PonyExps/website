import React, { Component } from 'react';
import { Media } from 'reactstrap';
import {
    Card, CardImg, CardImgOverlay, CardText, CardBody,
    CardTitle, Breadcrumb, BreadcrumbItem, CardSubtitle, CardHeader, CardFooter,
    Alert, ListGroup, ListGroupItem, Badge
} from 'reactstrap';
import { TabContent, TabPane, Nav, NavItem, NavLink, Button, Row, Col } from 'reactstrap';
import SendThankYouNote from "./SendThankYouNote"
import {RenderRequestOrder, RenderDeliveryOrder} from "./MyOrdersPageComponents"


class MyOrdersPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            key: "requests",
            modalInfo:{
                id: null,
                buyerName: null, 
                modalOpen: false,
                driverName:"",
            }
        }
        this.toggleModal = this.toggleModal.bind(this);

    }


    toggleModal = (request) => {
        this.setState({
            modalInfo :{
                modalOpen: !this.state.modalInfo.modalOpen,
                id: request._id,
                buyerName: request.buyerName, 
                driverName: request.driverName
            }
            
        })
    }

    
    getData = () => {
        this.props.fetchMyRequests();
        this.props.fetchMyDeliveries();
    }

    componentWillUnmount(){
        // clearInterval(this.intervalID);
    }

    componentDidMount(){
        // this.intervalID = setInterval(this.getData.bind(this), 5000);
        // console.log("my order's page", this.props.myrequests)
    }
    render() {

        return (
            <>
            <div className="container">
                <Nav  tabs style = {{marginBottom:"20px", marginTop:"20px"}}>
                    <NavItem >
                        <NavLink
                            active={this.state.key === 'requests'}
                            onClick={() => { this.setState({ key: "requests" }) }}
                        >
                            <strong>My Requests</strong>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            active={this.state.key === 'deliveries'}
                            onClick={() => { this.setState({ key: "deliveries" }) }}
                        >
                            <strong>My Deliveries</strong>
                        </NavLink>
                    </NavItem>
                </Nav>
                
                <TabContent activeTab={this.state.key}>
                    <TabPane tabId="requests">
                        <Row>
                            {
                                this.props.myrequests.map((request) => {
                                    return (
                                        <div key={request._id} className="col-md-6">
                                            <RenderRequestOrder request={request} toggleModal = {this.toggleModal}/>
                                        </div>
                                    );
                                })
                            }

                        </Row>
                    </TabPane>
                    <TabPane tabId="deliveries">
                        <Row >
                            {
                                this.props.mydeliveries.map((delivery) => {
                                    return (
                                        <div key={delivery._id} className="col-md-6">
                                            <RenderDeliveryOrder delivery={delivery} />
                                        </div>
                                    );
                                })
                            }
                        </Row>
                    </TabPane>
                </TabContent>

            </div>
            <SendThankYouNote isModalOpen = {this.state.modalInfo.modalOpen} 
            toggleModal = {this.toggleModal} 
            driverName = {this.state.modalInfo.driverName} 
            buyerName = {this.state.modalInfo.buyerName}
            postUpdate = {this.props.postUpdate} 
            sendThankYouNote = {this.props.sendThankYouNote}
            orderId = {this.state.modalInfo.id}
            
            /> 
            </>
        );

    }

}


export default MyOrdersPage;