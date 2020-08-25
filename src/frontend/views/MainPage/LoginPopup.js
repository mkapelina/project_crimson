import React, { Component } from 'react';
import { 
    Form, 
    Input, 
    Button, 
    Modal, 
    ModalHeader, 
    ModalBody, 
    ModalFooter, 
    InputGroup, 
    InputGroupAddon 
} from 'reactstrap';

class LoginPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggingIn: false,
            email: '',
            password: '',
            isValid: true,
            // use when incorporating backend user auth
            wasSuccessful: true
        }
    }

    toggleLogin = () => this.setState({ isLoggingIn: !this.state.isLoggingIn });

    updateEmail = (event) => this.setState({ email: event.target.value });

    updatePassword = (event) => this.setState({ password: event.target.value });

    isEntryValid = () => this.state.email && this.state.password;

    login = () => {
        if (this.isEntryValid()) {
            console.log('logging in ' + this.state.email + ' with password ' + this.state.password);
            this.setState({ isLoggingIn: false });
        } 
        else {
            this.setState({ isValid: false });
        }
    }

    render() {
        return (
            <div>
                <Button color='secondary' size='lg' onClick={this.toggleLogin}>Log In</Button>
                <Modal isOpen={this.state.isLoggingIn} toggle={this.toggleLogin} className='login-popup'>
                    <ModalHeader toggle={this.toggleLogin}>Log In</ModalHeader>
                    <ModalBody>
                        <Form>
                            <InputGroup style={{ marginBottom: '10px' }}>
                                <InputGroupAddon addonType='prepend'>Username/Email</InputGroupAddon>
                                <Input type='email' id='email' placeholder='Enter your email or Username' onChange={this.updateEmail} />
                            </InputGroup>
                            <InputGroup style={{ marginBottom: '10px' }}>
                                <InputGroupAddon addonType='prepend'>Password</InputGroupAddon>
                                <Input type='password' id='password' placeholder='Enter your Password' onChange={this.updatePassword} />
                            </InputGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        {!this.state.isValid && <span>Please fill out all fields</span>}
                        {!this.state.wasSuccessful && <span>Invalid Email or Password</span>}
                        <Button color='primary' onClick={this.login}>Submit</Button>
                        <Button color='primary' onClick={this.toggleLogin}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default LoginPopup;