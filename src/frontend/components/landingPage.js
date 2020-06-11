import React, { Component } from "react";
import {
    CardDeck,
    Card,
    CardTitle,
    CardText,
    CardBody,
    Button,
    CardHeader,
} from "reactstrap";

import "../styles.css";

class LandingPage extends Component {
    render() {
        return (
            <div className="main-page">
                <div className="main-page-top">
                    <h1>Project Crimson</h1>
                </div>
                <div className="all-projects">
                    <h3>Project List</h3>
                    <ProjectList user="none" />
                </div>
            </div>
        );
    }
}

class ProjectList extends Component {
    render() {
        return (
            <div className="project-cards-view">
                <GetProjectCards user={this.props.user} />
            </div>
        );
    }
}

class GetProjectCards extends Component {
    // get all projects associated with a user in JSON form,
    // currently only returns a single example project in json form
    getUserProjects(user) {
        var example_proj =
            '{ "name" : "example project", ' +
            ' "description" : "Hello world project", ' +
            ' "components" : [ ' +
            '{ "name" : "say hello", "description" : "im lonely", "steps" : [ ' +
            '{ "name" : "step 1", "description" : "type print(hello)" } ] }, ' +
            '{ "name" : "say world", "description" : "i want friends", "steps" : [ ' +
            '{ "name" : "step 1", "description" : "type print(world)" } ] } ] }';
        return example_proj;
    }

    // format a single projects json string into proper html/bootstrap card view
    FormatProjectJSON(props) {
        var project = JSON.parse(props.json);

        return (
            <div className="project-card-box">
                <Card className="project-card">
                    <CardHeader>
                        <CardTitle>{project["name"]}</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <CardText>{project["description"]}</CardText>
                    </CardBody>
                </Card>
            </div>
        );
    }

    render() {
        var userProjects = this.getUserProjects(this.props.user);
        return (
            <div className="all-project-cards">
                <CardDeck>
                    <this.FormatProjectJSON json={userProjects} />
                    <AddProjectCard />
                </CardDeck>
            </div>
        );
    }
}

class AddProjectCard extends Component {
    constructor(props) {
        super(props);
        this.state = { showAddProj: false };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.toggleAddProj = this.toggleAddProj.bind(this);
    }

    // for add project form
    toggleAddProj() {
        this.setState({ showAddProj: !this.state.showAddProj });
    }

    // for add project form
    handleSubmit(input) {
        var name = input.name;
        var desc = input.desc;

        this.toggleAddProj();
        console.log(name + " " + desc);
    }

    // for add project form
    handleCancel() {
        this.toggleAddProj();
    }

    render() {
        return (
            <div className="add-project-box">
                <Card style={{ backgroundColor: "#6495ed", border: "0px" }}>
                    <button className="add-project-button" onClick={this.toggleAddProj}>
                        +
                    </button>
                    {this.state.showAddProj && (<AddProjectForm
                        onSubmit={this.handleSubmit} onCancel={this.handleCancel} />)}
                    <CardText>Add Project</CardText>
                </Card>
            </div>
        );
    }
}

class AddProjectForm extends Component {
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

export default LandingPage;
