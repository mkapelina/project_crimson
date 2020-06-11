import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// import UserHome from './components/UserHome';
import LandingPage from './components/landingPage'

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={LandingPage} />
      </Router>
    );
  }
}

export default App;
