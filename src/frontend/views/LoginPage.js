import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { Form, Label, Input, Button } from 'reactstrap'

class LoginPage extends Component {
    render() {
        return (
            <div className='login-page'>
                <Link to='/'>Back</Link>
                <div className='login-form-wrapper'>
                    <Form>
                        <Label for="email">Email or Username</Label>
                        <Input type="email" name="email" id='email' placeholder='Enter your email or Username' />
                        <Label for='password'>Password</Label>
                        <Input type='password' name='password' id='password' placeholder='Enter your password' />
                        <Button>Submit</Button>
                    </Form>
                </div>
                <Link to='/signup'>Sign Up</Link>
            </div>
        );
    }
}

export default LoginPage;