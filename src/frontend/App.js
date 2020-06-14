import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// Views
import LandingPage from './views/landingPage'

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
