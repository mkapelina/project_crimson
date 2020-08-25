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

class SignUpPopup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSigningUp: false,
            name: '',
            username: '',
            email: '',
            password: '',
            passwordConfirm: '',
            isValid: true,
            wasSuccessful: true
        }
    }

    toggleSignup = () => this.setState({ isSigningUp: !this.state.isSigningUp });

    updateName = (event) => this.setState({ name: event.target.value });

    updateUsername = (event) => this.setState({ username: event.target.value });

    updateEmail = (event) => this.setState({ email: event.target.value });

    updatePassword = (event) => this.setState({ password: event.target.value });

    updatePasswordConfirm = (event) => this.setState({ passwordConfirm: event.target.value });

    isEntryValid = () => this.state.name && this.state.username && this.state.email && 
        this.state.password.length >= 6 && this.state.password === this.state.passwordConfirm;

    signup = () => {
        if (this.isEntryValid()) {
            console.log('signing up user with details' + JSON.stringify(this.state));
            this.setState({ isSigningUp: false });
        }
        else {
            this.setState({ isValid: false });
        }
    }

    render() {
        return (
            <div>
                <Button color='secondary' size='lg' onClick={this.toggleSignup} style={{marginRight: '10px'}}>Sign Up</Button>
                <Modal isOpen={this.state.isSigningUp} toggle={this.toggleSignup} className='Signup-popup'>
                    <ModalHeader toggle={this.toggleSignup}>Sign Up</ModalHeader>
                    <ModalBody>
                        <Form>
                            <InputGroup style={{ marginBottom: '10px' }}>
                                <InputGroupAddon addonType='prepend'>Name</InputGroupAddon>
                                <Input id='name' placeholder='Enter your full name' onChange={this.updateName} />
                            </InputGroup>
                            <InputGroup style={{ marginBottom: '10px' }}>
                                <InputGroupAddon addonType='prepend'>Username</InputGroupAddon>
                                <Input id='username' placeholder='Enter your new Username' onChange={this.updateUsername} />
                            </InputGroup>
                            <InputGroup style={{ marginBottom: '10px' }}>
                                <InputGroupAddon addonType='prepend'>Email</InputGroupAddon>
                                <Input type='email' id='email' placeholder='Enter your Email Address' onChange={this.updateEmail} />
                            </InputGroup>
                            <InputGroup style={{ marginBottom: '10px' }}>
                                <InputGroupAddon addonType='prepend'>Password</InputGroupAddon>
                                <Input type='password' id='password' placeholder='Enter your new Password (at least 6 characters)' onChange={this.updatePassword} />
                            </InputGroup>
                            <InputGroup style={{ marginBottom: '10px' }}>
                                <InputGroupAddon addonType='prepend'>Confirm Password</InputGroupAddon>
                                <Input type='password' id='password-confirm' placeholder='Confirm your new Password' onChange={this.updatePasswordConfirm} />
                            </InputGroup>
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        {!this.state.isValid && <span>Please fill out all fields</span>}
                        {!this.state.wasSuccessful && <span>Error, unable to create account with provided details</span>}
                        <Button color='primary' onClick={this.signup}>Submit</Button>
                        <Button color='primary' onClick={this.toggleSignup}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default SignUpPopup;