import React, { Component } from "react";
import { Link } from 'react-router-dom'

import {
    Card,
    CardTitle,
    CardText,
    CardBody,
    Button,
    CardHeader,
    CardFooter,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Row,
    Container,
    ButtonDropdown,
    UncontrolledButtonDropdown,
    Progress, 
    ListGroup,
    ListGroupItem,
    Badge
} from "reactstrap";

import menuIcon from './icons/threeLineMenu.png';
import threeDotIcon from './icons/verticalThreeDotsMenu.png';
import "./styles/landingPageStyles.css";

class LandingPage extends Component {
    render() {
        return (
            <div className="main-page">
                <div className="main-page-top">
                    <div className="drop-down">
                        <UncontrolledDropdown>
                            <DropdownToggle className="drop-down-button">
                                <img src={menuIcon} alt="menu" />
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem><a href="#marketplace">Marketplace</a></DropdownItem>
                                <DropdownItem><a href="#forum">Forum</a></DropdownItem>
                                <DropdownItem><a href="#profile">My Profile</a></DropdownItem>
                                <DropdownItem><a href="#porn">Maxim's phat a$$</a></DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                    <input className="search-bar" type="text" placeholder="Search your projects.." title="Search your projects"></input>
                    <h5> Project Crimson</h5>
                </div>

                <div className="all-projects">
                    <div className="all-projects-ghost">
                        <h3>Your Portfolio</h3>
                        <ProjectCards user="none" />
                    </div>
                </div>
                <div className="main-page-bottom">

                </div>
            </div>
        );
    }
}

class ProjectCards extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projects: {},
            isLoading: true,
        };
        this.refreshProjList = this.refreshProjList.bind(this);
        this.callGetProjectAPI = this.callGetProjectAPI.bind(this);
    }

    callGetProjectAPI() {
        fetch("http://localhost:9000/getProjects")
            .then(res => res.json())
            .then(res => this.setState({ projects: res, isLoading: false }))
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

    // format a single projects json string into proper html/bootstrap card view
    formatProject(project) {
        return (
            <Card className='project-card'>
                <CardHeader>
                    <UncontrolledButtonDropdown className="card-menu" size="sm">
                        <DropdownToggle className="card-menu-dropdown-button" color="white">
                            <img src={threeDotIcon} alt="menu"/>
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>Edit</DropdownItem>
                            <DropdownItem divider />
                            <DeleteProjectConfirm
                                    project={project["name"]}
                                    onDeleteProj={this.refreshProjList} />
                        </DropdownMenu>
                    </UncontrolledButtonDropdown>
                    <Link to={`/${project.name}`}>
                        <CardTitle>{project["name"]}</CardTitle>
                    </Link>
                </CardHeader>
                <CardBody className="card-body">
                    <CardText>{project["description"]}</CardText>
                </CardBody>
                    <ListGroup className="card-footer-list" flush>
                        <ListGroupItem id="component-tally" className="card-footer-list-items">Components: <Badge pill>{project["components"].length}</Badge></ListGroupItem>
                        <ListGroupItem id="project-progress-bar" className="card-footer-list-items"> <Progress animated value={100} color="success">100% Complete</Progress></ListGroupItem>
                    </ListGroup>
            </Card>
        );

    }

    render() {
        return (
            <Container className="mt-3" fluid >
                <Row>
                    {!this.state.isLoading && <AddProjectCard
                        onAddProj={this.refreshProjList}
                        projNames={this.state.projects.projects.map(project => project.name)} />
                    }
                    {!this.state.isLoading && this.state.projects.projects.map(project => (
                        <div key={project.name}>{this.formatProject(project)}</div>))
                    }
                </Row>
            </Container>
        );
    }
}

class DeleteProjectConfirm extends Component {
    constructor(props) {
        super(props);

        this.state = { willDelete: false };
    }

    deleteProject(projName) {
        var body = { name: projName }

        var req = {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body)
        };

        this.toggleWillDelete();
        fetch('http://localhost:9000/deleteProject', req)
            .then(res => res.json())
            .then(res => this.props.onDeleteProj(res));
    }

    toggleWillDelete = () => this.setState({ willDelete: !this.state.willDelete });

    render() {
        return (
            <div className='delete-project'>
                <Button onClick={this.toggleWillDelete} color="white">Delete Project</Button>
                {this.state.willDelete && <div className='delete-project-popup'>
                    <p>Are you sure you want to delete {this.props.project}?</p>
                    <button onClick={this.toggleWillDelete}>No</button>
                    <button onClick={() => this.deleteProject(this.props.project)}>Yes</button>
                </div>}
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
        var body = { "name": name, "desc": desc };

        this.toggleAddProj();
        fetch("http://localhost:9000/addProject", {
            headers: { 'Content-Type': 'application/json' },
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
            <Card className="add-project-card">
                <button className="add-project-button" onClick={this.toggleAddProj}>
                    +
                    </button>
                {this.state.showAddProj && (<AddProjectForm
                    onSubmit={this.handleSubmit}
                    onCancel={this.handleCancel}
                    projNames={this.props.projNames} />)}
                <CardText style={{ fontSize: "18px" }}>Add Project</CardText>
            </Card>
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
        var newName = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
        this.setState({ name: newName });
    }

    handleDescChange(e) {
        var newDesc = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
        this.setState({ desc: newDesc });
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.props.projNames.includes(this.state.name)) {
            this.setState({ isValid: false });
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
