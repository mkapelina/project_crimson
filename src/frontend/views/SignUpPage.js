import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Form, Label, Input, Button } from 'reactstrap'

class SignUpPage extends Component {
    render() {
        return (
            <div className='signup-page'>
                <h1>Sign Up</h1>
                <div className='signup-form-wrapper'>
                    <Form>
                        <Label for='name'>Full Name</Label>
                        <Input type='text' name='name' id='name' placeholder='Enter your name' />
                        <Label for='username'>Username</Label>
                        <Input type='text' name='username' id='username' placeholder='Enter your new username' />
                        <Label for='email'>Email</Label>
                        <Input type='email' name='email' id='email' placeholder='Enter your email' />
                        <Label for='password'>Password</Label>
                        <Input type='password' name='password' id='password' placeholder='Enter your password' />
                        <Label for='pass-confirm'>Confirm new password</Label>
                        <Input type='password' name='pass-confirm' id='pass-confirm' placeholder='Confirm your password' />
                        <Button>Submit</Button>
                    </Form>
                </div>
            </div>
        );
    }
}

export default SignUpPage;