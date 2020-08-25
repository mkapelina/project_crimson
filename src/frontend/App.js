import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import '../index.css';

// Views
import MainPage from './views/MainPage/MainPage';
import LandingPage from './views/LandingPage/LandingPage';
import ProjectView from './views/ProjectView/ProjectView';

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={MainPage} />
        <Route exact path='/u/:User' component={LandingPage} />
        <Route exact path='/u/:User/:Project' component={ProjectView} />
      </Router>
    );
  }
}

export default App;
