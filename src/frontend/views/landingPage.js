import React, { Component } from "react";

import {
    CardDeck,
    Card,
    CardTitle,
    CardText,
    CardBody,
    Button,
    CardHeader,
    CardFooter,
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
    constructor(props) {
        super(props);

        this.state = {
            projects : {},
            isLoading : true,
            willDelete : false,
        };
        this.refreshProjList = this.refreshProjList.bind(this);
        this.deleteProject = this.deleteProject.bind(this);
        this.toggleWillDelete = this.toggleWillDelete.bind(this);
    }

    callGetProjectAPI() {
        fetch("http://localhost:9000/getProjects")
            .then(res => res.json())
            .then(res => this.setState({ projects : res, isLoading : false }))
            .catch(err => err);
    }

    componentDidMount() {
        this.callGetProjectAPI();
    }

    refreshProjList(res) {
        if (res.status === 200) {
            this.callGetProjectAPI();
        }
        else {
            console.log("error: failed to get projects");
        }
    }

    toggleWillDelete() {
        this.setState({ willDelete : !this.state.willDelete });
    }

    deleteProject(projName) {
        var body = {name: projName}
        body["option"] = "DELETE"

        var req = {
            headers: { 'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify(body)
        };

        fetch('http://localhost:9000/editProjects', req)
            .then(res => res.json())
            .then(res => this.refreshProjList(res));
    }

    // format a single projects json string into proper html/bootstrap card view
    formatProject(project) {
        return (
            <div className="project-card-box">
                <Card>
                    <CardHeader>
                        <CardTitle>{project["name"]}</CardTitle>
                    </CardHeader>
                    <CardBody>
                        <CardText>{project["description"]}</CardText>
                    </CardBody>
                    <CardFooter>
                        <Button onClick={this.toggleWillDelete}>Delete</Button>
                    </CardFooter>
                </Card>
                {this.state.willDelete && <DeleteProjectConfirm
                    project={project["name"]}
                    onNo={this.toggleWillDelete} 
                    onYes={() => this.deleteProject(project["name"])} />}
            </div>
        );
    }

    render() {
        return (
            <div className="all-project-cards">
                <CardDeck>
                    {!this.state.isLoading && this.state.projects.projects.map(project => (
                        <div key={project.name}>{this.formatProject(project)}</div>))
                    }
                    {!this.state.isLoading && <AddProjectCard 
                        onAddProj={this.refreshProjList} 
                        projNames={this.state.projects.projects.map(project => project.name)} />
                    }
                </CardDeck>
            </div>
        );
    }
}

class DeleteProjectConfirm extends Component {
    render() {
        return (
            <div className='delete-project-popup'>
                <p>Are you sure you want to delete {this.props.project}?</p>
                <button onClick={this.props.onNo}>No</button>
                <button onClick={this.props.onYes}>Yes</button>
            </div>
        )
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
        var body = { "name" : name, "desc" : desc };
        body['option'] = 'ADD'

        this.toggleAddProj();
        fetch("http://localhost:9000/editProjects", {
            headers: { 'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(res => this.props.onAddProj(res));
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
                        onSubmit={this.handleSubmit} 
                        onCancel={this.handleCancel} 
                        projNames={this.props.projNames}/>)}
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
            isValid: true,
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
        if (this.props.projNames.includes(this.state.name)) {
            this.setState({ isValid : false });
        } else {
            this.props.onSubmit(this.state);
        }
    }

    render() {
        return (
            <div className="addProj-popup">
                <div className="form-popup">
                    <form className="form-container" onSubmit={this.handleSubmit}>
                        <p>Please enter the details for your new Project</p>
                        <label>Project name:</label>
                        <input
                            type="text"
                            id="projName"
                            onChange={this.handleNameChange}
                            required
                        />
                        {!this.state.isValid && <p>You cannot have two projects with the same name</p>}
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
