import React, { Component } from 'react';
import { Media } from 'reactstrap';
import {
    Card, CardImg, CardImgOverlay, CardText, CardBody, CardSubtitle, Alert, Label,
    CardTitle, Breadcrumb, BreadcrumbItem, CardHeader, Row, Col, ListGroupItem, ListGroup, Badge, CardFooter
} from 'reactstrap';
import { Link } from "react-router-dom";
import { Button, ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap';
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css";
import OfferDeliveryPage from "./OfferDeliveryPage";
import Moment from "react-moment"
import {connect} from "react-redux";


const payment = (venmo, cash) => {
    if(venmo === true && cash === true){
        return (<CardText> {<strong>Method(s) of Payment </strong>}:  Venmo, Cash</CardText>)
    }
    else if(venmo === true){
        return (<CardText> {<strong>Method(s) of Payment </strong>}:  Venmo</CardText>)
    }
    else{
        return (<CardText> {<strong>Method(s) of Payment </strong>}:  Cash</CardText>)
    }
}

const RenderRequestOrder = (props) => {
    return (
        <Card style={{ marginBottom: "20px", border: "solid", borderColor: "green" }}>

            <CardBody>
                <CardTitle>
                    <Row>
                        <Col xs={9}>
                            <b><p style={{ fontSize: "1.5rem", display: "inline" }}>{props.request.zipcode}, {props.request.city} </p></b>
                        </Col>
                        <Col xs={2}>
                            <h4><Badge color="info" >{props.request.store}</Badge></h4>
                        </Col>
                    </Row>
                </CardTitle>
                <CardSubtitle>{props.request.buyerName}</CardSubtitle>
                <br></br>
                <CardText>{<strong>Need before : </strong>} <Moment format = "MMM DD">{props.request.buyerDate}</Moment></CardText>
                {payment(props.request.venmo, props.request.cash)}

                <CardText> {<strong>Shopping List consists of </strong>} </CardText>
                <CardText className="text-center"> {props.request.numItems} {props.request.typeErrand} items</CardText>
                <hr />

                <div className="text-center">
                    <Button size="lg" variant = 'success' onClick = {() => props.toggleModal(props.request)}>
                        Offer to deliver <i class="fa fa-heart" aria-hidden="true"></i>

                    </Button>
                </div>

            </CardBody>



        </Card>
    );
}



class RequestPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            refresh: false,
            filters:{
                typeErrand: null,
                store: null,
                miles: "15",
                date: new Date(),
            },
            modalInfo: {
                modalOpen: false,
                id: null,
                buyerName: null, 
                buyerDate: null,
                store: null,
            }

        }
        this.changeErrand = this.changeErrand.bind(this);
        this.changeStore = this.changeStore.bind(this);
        this.changeMiles = this.changeMiles.bind(this);
        this.changeDate = this.changeDate.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
    }

    toggleModal = (request) => {
        // alert("toggleModal", this.state.modalInfo.modalOpen);
        this.setState({
            modalInfo :{
                modalOpen: !this.state.modalInfo.modalOpen,
                id: request._id,
                buyerName: request.buyerName, 
                buyerDate: request.buyerDate,
                store: request.store,
            }
            
        })
    }

    changeDate = (e) => {
        this.setState({
            filters: {...this.state.filters,date: e}
        })
        this.props.filterRequests(this.state.filters)
    }
    changeMiles = (e) => {
        this.setState({
            filters: {...this.state.filters,miles: e.target.value,}
            
        })
        this.props.filterRequests(this.state.filters)
        // this.props.dispatch(actions.change("requestPost.typeErrand", e.target.value));

    }
    changeErrand = (e) => {
        // alert(e.target.value);

        this.setState({
            filters: {...this.state.filters,typeErrand: e.target.value,}
            
        })
        this.props.filterRequests(this.state.filters)
        // this.props.dispatch(actions.change("requestPost.typeErrand", e.target.value));
    }

    changeStore = (e) => {
        this.setState({
            filters: {...this.state.filters,store: e.target.value}
            
        })
        this.props.filterRequests(this.state.filters)
        // this.props.dispatch(actions.change("requestPost.store", e.target.value));

    }

    getData = () => {
        this.props.fetchUnmatchedRequests();
        this.props.fetchUpdates();        
    }
    
    componentDidMount(){
        this.intervalID = setInterval(this.getData.bind(this), 5000);
    }

    componentWillUnmount(){
        clearInterval(this.intervalID);

    }
    render() {

        let stores = <></>;
        if (this.state.filters.typeErrand) {
            stores = this.props.nearbystores.filter((obj) => { return obj.type === this.state.filters.typeErrand; })[0].stores.map((store) =>
                <option value={store}>{store}</option>
            )
        }
        const menu = this.props.requests.map((request) => {
            return (
                <div key={request.id} className="col-12 col-md-6">
                    <RenderRequestOrder request={request} toggleModal = {this.toggleModal} />
                </div>

            );
        });

        const updates = this.props.updates.map((update) => {
            return (
                <div key={update.id} className="col-12">
                    <Alert light> <b>{update.name}: </b>{update.content}</Alert>
                </div>
            );
        });

        
        


        const filters = <>
            <div className="row">
                <Col md={3}>
                    <select className="browser-default custom-select" onChange={this.changeErrand}
                        required value={this.state.filters.typeErrand}>
                        <option value="">Store Category</option>
                        <option data-divider="true"></option>

                        {this.props.nearbystores.map((obj) =>
                            <option value={obj.type}>{obj.type}</option>

                        )}
                    </select>
                </Col>
                <Col md={2}>
                    <select className="browser-default custom-select" onChange={this.changeStore}
                        required value={this.state.filters.store}>
                        <option value="">Store</option>
                        <option data-divider="true"></option>
                        {stores}
                    </select>
                </Col>
                <Col md={3}>
                    <select className="browser-default custom-select" onChange={this.changeMiles}
                        required value={this.state.filters.miles}>
                        <option value="15">Within 15 miles</option>
                        <option value="10">Within 10 miles</option>
                        <option value="5">Within 5 miles</option>
                    </select>
                </Col>
                <Col md={3}>
                    <Row>
                        <Label xs={5}>Need by:</Label>
                        <Col xs={7}>
                            <DatePicker

                                selected={this.state.filters.date}
                                onChange={this.changeDate}
                                dateFormat="MMMM d"
                                isClearable={false}
                                required
                                className="form-control"
                                minDate={new Date()}
                            />
                        </Col>
                    </Row>
                </Col>
            </div>

        </>

        return (
            <>

            <div className="container">
            <div className="row" style = {{marginBottom:10}}><Col><b>Filter requests based on store, distance, and date:</b></Col></div>

                <div className="row">
                    <div className="col-md-10" style = {{marginBottom:5}}>
                        {filters}
                    </div>
                    <div style={{position:"relative", top:"-15px"}}>
                        <Link to = "/postARequest"><Button size = "lg" variant = "primary">Post a Request</Button></Link> 
                    </div>
                </div>
                <br></br>

                <div className="row">
                    <div className="col-12 col-md-10">
                        <div className="row">
                            {menu}
                        </div>
                    </div>
                    <div className="col-12 col-md-2">

                        <div className="row">
                            {updates}
                        </div>
                    </div>
                </div>
                
            </div>
            <OfferDeliveryPage isModalOpen = {this.state.modalInfo.modalOpen} toggleModal = {this.toggleModal} modalInfo = {this.state.modalInfo}  updateOfferDelivery = {this.props.updateOfferDelivery} postUpdate = {this.props.postUpdate} postNotification = {this.props.postNotification}/> 
            <Link to = "/postARequest"><Button size = "lg" variant = "danger" style = {{right: 50, bottom: 50, position: 'fixed', zIndex: 10}}>Post A Request</Button></Link>
            
            </>

        );
    }


}

export default RequestPage;
