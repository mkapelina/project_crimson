import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import UserHome from './components/UserHome';

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={UserHome} />
      </Router>
    );
  }
}

export default App;
