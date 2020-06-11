import React, { Component } from "react";
import { UncontrolledCollapse, Button } from "reactstrap";

//import { BrowserRouter as Router, Link, Route } from 'react-router-dom'
import "../styles.css";

class UserHome extends Component {
  render() {
    return (
      <div className="main-page">
        <div className="main-page-top">
          <h1>Welcome User</h1>
          <UserHeader />
        </div>
        <div className="main-page-bottom">
          <h3>Here are all your projects</h3>
          <UserProjects />
        </div>
      </div>
    );
  }
}

class UserHeader extends Component {
  constructor(props) {
    super(props);
    this.state = { showAddProj: false };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  toggleAddProj() {
    this.setState({ showAddProj: !this.state.showAddProj });
  }

  handleSubmit(input) {
    var name = input.name;
    var desc = input.desc;

    this.toggleAddProj();
    console.log(name + " " + desc);
  }

  handleCancel() {
    this.toggleAddProj();
  }

  render() {
    return (
      <div className="user-header">
        <button className="addProj-btn" onClick={this.toggleAddProj.bind(this)}>
          + Add Project
        </button>
        {this.state.showAddProj && (
          <AddProject
            onSubmit={this.handleSubmit}
            onCancel={this.handleCancel}
          />
        )}
      </div>
    );
  }
}

class AddProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      desc: "",
    };

    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleDescChange = this.handleDescChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleNameChange(e) {
    this.setState({ name: e.target.value });
  }

  handleDescChange(e) {
    this.setState({ desc: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onSubmit(this.state);
  }

  render() {
    return (
      <div className="addProj-popup">
        <div className="form-popup" id="popup-form">
          <form className="form-container" onSubmit={this.handleSubmit}>
            <p>Please enter the details for your new Project</p>
            <label>Project name:</label>
            <input
              type="text"
              id="projName"
              onChange={this.handleNameChange}
              required
            />
            <label>Project description:</label>
            <input
              type="text"
              id="projDesc"
              onChange={this.handleDescChange}
              required
            />
            <input
              type="button"
              value="Cancel"
              className="btn-cancel"
              onClick={this.props.onCancel}
              formNoValidate
            />
            <input type="submit" value="Create" className="btn-submit" />
          </form>
        </div>
      </div>
    );
  }
}

class UserProjects extends Component {
  getProjects = () => {
    return;
  };

  // when backend is built, this function should fetch all a users projects and
  // display them in the proper format (probably with some map involved)
  // this is just an example project for now
  getUserProjects = (props) => {
    var projects = this.getProjects();
    return (
      <tbody className="projects-list">
        <tr>
          <td>
            <Button id="toggler">See components</Button>
          </td>
          <td>Example Project</td>
          <td>04/20/20</td>
          <td>69</td>
        </tr>
        <UncontrolledCollapse
          className="collapse"
          id="components"
          toggler="#toggler"
        >
          <tr>
            <th>Expand steps button</th>
            <th>Component name</th>
          </tr>
          <tr>
            <td>
              <button className="collapse2">See steps</button>
            </td>
            <td>Example Component</td>
          </tr>
        </UncontrolledCollapse>
      </tbody>
    );
  };

  render() {
    return (
      <div className="user-projects">
        <table className="projects-table">
          <thead className="projects-header">
            <tr>
              <th>expand button</th>
              <th>Project Name</th>
              <th>Date Created</th>
              <th>Number of Components</th>
            </tr>
          </thead>
          <this.getUserProjects user="none" />
        </table>
      </div>
    );
  }
}

//=========================================================================================

export default UserHome;
