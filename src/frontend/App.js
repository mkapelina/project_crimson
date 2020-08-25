import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import '../index.css'

// Views
import MainPage from './views/MainPage'
import LoginPage from './views/LoginPage'
import SignUpPage from './views/SignUpPage'
import LandingPage from './views/landingPage'
import ProjectView from './views/projectView'

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={MainPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path='/signup' component={SignUpPage} />
        <Route exact path='/u/:User' component={LandingPage} />
        <Route exact path='/u/:User/:Project' component={ProjectView} />
      </Router>
    );
  }
}

export default App;
