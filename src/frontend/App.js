import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import '../index.css'

// Views
import LandingPage from './views/landingPage'
import ProjectView from './views/projectView'

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={LandingPage} />
        <Route exact path='/:Project' component={ProjectView} />
      </Router>
    );
  }
}

export default App;
