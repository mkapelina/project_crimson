import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Navbar, NavbarBrand, Jumbotron, CardGroup, Card, CardImg, CardBody, CardTitle, CardSubtitle, CardText } from "reactstrap";

import './MainPage.css';
import CoDesignLogo from '../icons/CoDesignLogo.png';
import codeImage from '../images/CodeDefaultImg.png';
import PVScreenshot from '../images/ProjectViewScreenshot7-15.png';
import LPScreenshot from '../images/UserLandingPageScreenshot7-15.png';
import LoginPopup from './LoginPopup';
import SignUpPopup from './SignUpPopup'

class MainPage extends Component {
    render() {
        return (
            <div className='main-page'>
                <div className='header-wrapper'>
                    <div className='page-header'>
                        <MainHeader />
                    </div>
                </div>
                <div className='page-body'>
                    <JumboHeader />
                    <TheProcess />
                    <Link to={'/u/defaultUser'}>Go to default user page</Link>
                </div>
            </div>
        );
    }
}

const MainHeader = (props) => {
    return (
        <Navbar style={{ 'width': '100%' }}>
            <NavbarBrand href='/'>
                <img className='logo-img' src={CoDesignLogo} alt='Co-Design' />
            </NavbarBrand>
            <MainLogo />
            <div className='sign-in-wrapper'>
                <SignUpPopup />
                <LoginPopup />
            </div>
        </Navbar>
    )
}

const MainLogo = (props) => {
    return (
        <div className='main-logo'>
            <h2 className='company-name'>Co-Design</h2>
            <h4 className='rotating-message'>
                <span>Design</span>
                <div className='rotating-words'>
                    <span>together</span>
                    <span>freely</span>
                    <span>intelligently</span>
                    <span>creatively</span>
                    <span>collaboratively</span>
                    <span>effortlessly</span>
                    <span>powerfully</span>
                </div>
            </h4>
        </div>
    )
}

const JumboHeader = (props) => {
    return (
        <Jumbotron className='jumboheader' style={{ 'backgroundImage': `url(${codeImage})` }} fluid>
            <h1 className='jumboheader-top-text'>A project design and development app</h1>
            <h3 className='jumboheader-bottom-text'>Built for You</h3>
            <h3 className='jumboheader-desc-title'>What is Co-Design?</h3>
            <span className='jumboheader-desc'>
                Co-Design is an application built to connect great ideas with great developers. Our application lets you easily design projects,
                then access a pool of developers willing to help implement your ideas. If you are a great thinker who needs help with a project,
                use Co-Design. If you are a developer with a little free time looking for some work on the side, use Co-Design, and join the pool
                of developers already on our app. If you are a small team looking for a way to collaboratively design your project, use Co-Design.
                The point is, we want to help you, so start designing or developing today, and see how much the power of collaboration can accomplish.
            </span>
        </Jumbotron>
    )
}

const TheProcess = (props) => {
    return (
        <div className='process-wrapper'>
            <h2 className='process-title'>The Process</h2>
            <CardGroup>
                <Card>
                    <CardBody>
                        <CardTitle className='process-step'>1</CardTitle>
                        <CardSubtitle className='process-step-title'>Design your app</CardSubtitle>
                        <CardText className='process-step-desc'>Our project design view gives you the freedom to dynamically design your project, being as specific or as general as you want</CardText>
                    </CardBody>
                    <CardImg bottom width='100%' src={PVScreenshot} alt='screenshot' />
                </Card>
                <Card>
                    <CardBody>
                        <CardTitle className='process-step'>2</CardTitle>
                        <CardSubtitle className='process-step-title'>Take your project to market</CardSubtitle>
                        <CardText className='process-step-desc'>Our development marketplace allows you to access a pool of third party developers who you can auction your project, component, or step for development</CardText>
                    </CardBody>
                    <CardImg bottom width='100%' src={codeImage} alt='screenshot' />
                </Card>
                <Card>
                    <CardBody>
                        <CardTitle className='process-step'>3</CardTitle>
                        <CardSubtitle className='process-step-title'>See the results</CardSubtitle>
                        <CardText className='process-step-desc'>Once your project has been auctioned on the market and the developer has completed their work, see the results in your main user page</CardText>
                    </CardBody>
                    <CardImg bottom width='100%' src={LPScreenshot} alt='screenshot' />
                </Card>
            </CardGroup>
        </div>
    )
}

export default MainPage;