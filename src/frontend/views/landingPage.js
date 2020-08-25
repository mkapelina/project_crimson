import React, { Component } from "react";
import { Link } from 'react-router-dom'

import {
    Card,
    CardTitle,
    CardText,
    CardBody,
    CardHeader,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Row,
    Container,
    UncontrolledButtonDropdown,
    Progress,
    ListGroup,
    ListGroupItem,
    Badge,
    Popover,
    PopoverHeader,
    PopoverBody,
    CardFooter
} from "reactstrap";

import menuIcon from './icons/threeLineMenu.png';
import threeDotIcon from './icons/verticalThreeDotsMenu.png';
import "./styles/landingPageStyles.css";

class LandingPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            projects: [],
            isLoading: true,
            isAdding: false,
        }
    }

    callGetProjectAPI = () => fetch("http://localhost:9000/getProjects")
        .then(res => res.json())
        .then(res => this.setState({ projects: res.projects, isLoading: false, isAdding: false }))
        .catch(err => err);

    componentDidMount = () => this.callGetProjectAPI();

    refreshProjList = (res) => res.status === 200 ?
        this.callGetProjectAPI() : console.log("error: failed to get projects");

    toggleIsAdding = () => this.setState({ isAdding: !this.state.isAdding });

    render() {
        return (
            <div className="main-page">
                <div className="main-page-top">
                    <div className="nav-drop-down">
                        <UncontrolledDropdown>
                            <DropdownToggle className="nav-drop-down-button">
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
                    <SearchBar suggestions={this.state.projects.reverse()} />
                    <div className='logo'>
                        <h5>Project Crimson</h5>
                    </div>
                </div>
                <div className="project-list-header">
                    <p>Your Portfolio</p>
                </div>
                <div className="all-projects">
                    <Container className="mt-3" fluid >
                        <Row className='d-flex flex-row flex-nowrap'>
                            {!this.state.isLoading && this.state.isAdding ? <ProjectView
                                onChange={this.refreshProjList}
                                projNames={this.state.projects.map(project => project.name)}
                                isEditing={true}
                                handleCancel={this.toggleIsAdding} /> :
                                <Card className="add-project-card">
                                    <button className="add-project-button" onClick={this.toggleIsAdding}>
                                        +
                                    </button>
                                    <CardText style={{ fontSize: "18px" }}>Add Project</CardText>
                                </Card>}
                            {!this.state.isLoading && this.state.projects.reverse().map(project =>
                                <ProjectView
                                    key={project.name}
                                    project={project}
                                    isEditing={false}
                                    onChange={this.refreshProjList}
                                    projNames={this.state.projects.map(project => project.name)} />).reverse()}
                        </Row>
                    </Container>
                </div>
                <div className="main-page-bottom"/> {/* included to style the bottom of the page */}
            </div>
        );
    }
}

class SearchBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeSugg: 0,
            filteredSuggs: [],
            showSuggs: false,
            userInput: ''
        };
    }

    static defaltProp = {
        suggestions: []
    };

    onChange = e => {
        const { suggestions } = this.props;
        const userInput = e.currentTarget.value;

        const filteredSuggs = suggestions.filter(
            sugg => sugg.name.toLowerCase().includes(userInput.toLowerCase())
        );

        this.setState({
            filteredSuggs,
            showSuggs: true,
            userInput: e.currentTarget.value
        });
    }

    onClick = e => {
        this.setState({
            filteredSuggs: [],
            showSuggs: false,
            userInput: e.currentTarget.innerText
        })
    }

    render() {
        const {
            onChange,
            onClick,
            onKeyDown,
            state: {
                filteredSuggs,
                showSuggs,
                userInput
            }
        } = this;

        let suggestionsListComponent;
        if (showSuggs && userInput) {
            if (filteredSuggs.length) {
                suggestionsListComponent = (
                    <div className='search-suggestions'>
                        {filteredSuggs.map(sugg => {
                            return (
                                <div className='search-result'>
                                    <Link to={`/u/defaultUser/${sugg.name}`}> {/* Requires attention!!!!!! */}
                                        <p key={sugg.name} onClick={onClick}>
                                            {sugg.name}
                                        </p>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                );
            }
            else {
                suggestionsListComponent = (
                    <div className='search-suggestions'>
                        <p>No Projects found</p>
                    </div>
                );
            }
        }

        return (
            <React.Fragment>
                <input
                    type='text'
                    className='search-bar'
                    placeholder='Search your projects...'
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    value={userInput}
                />
                {suggestionsListComponent}
            </React.Fragment>
        );
    }
}

class ProjectView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            willDelete: false,
            isEditing: this.props.isEditing,
            name: this.props.project ? this.props.project.name : "",
            desc: this.props.project ? this.props.project.description : "",
            isValid: true,
            validMsg: 'valid',
        }
    }

    toggleWillDelete = () => this.setState({ willDelete: !this.state.willDelete });

    toggleIsEditing = () => this.setState({ isEditing: !this.state.isEditing });

    handleNameChange = (e) => this.setState({ name: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) });

    handleDescChange = (e) => this.setState({ desc: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) });

    handleCancel = () => this.props.project ? this.setState({ isEditing: false }) : this.props.handleCancel();

    checkName = async () => {
        var name = this.state.name;
        var desc = this.state.desc;
        var projectNames = this.props.projNames;


        if (name.length === 0) {
            this.setState({ isValid: false, validMsg: 'name cannot be blank' });
            return;
        }
        if (desc.length === 0) {
            this.setState({ isValid: false, validMsg: 'description cannot be blank' });
            return;
        }

        if (projectNames.includes(name)) {
            if (this.props.project && name !== this.props.project.name) {
                this.setState({ isValid: false, validMsg: 'cannot have duplicate project names' });
                return;
            }
            else if (!this.props.project) {
                this.setState({ isValid: false, validMsg: 'cannot have duplicate project names' });
                return;
            }
        }

        this.handleSubmit();
    }

    handleSubmit = () => {
        var body = { "name": this.state.name, "desc": this.state.desc };

        if (this.props.project) {
            body['projectName'] = this.props.project.name;

            fetch("http://localhost:9000/modifyProject", {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(body)
            }).then(res => res.json()).then(res => this.props.onChange(res));
        }
        else {
            fetch("http://localhost:9000/addProject", {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(body)
            }).then(res => res.json()).then(res => this.props.onChange(res));
        }
    }

    deleteProject = (projName) => {
        var body = { name: projName }

        var req = {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body)
        };

        this.toggleWillDelete();
        fetch('http://localhost:9000/deleteProject', req)
            .then(res => res.json())
            .then(res => this.props.onChange(res));
    }

    render() {
        const project = this.props.project;
        return (
            <Card className='card-block project-card'>
                <CardHeader>
                    {!this.state.isEditing && <UncontrolledButtonDropdown className="card-menu" size="sm" direction='left'>
                        <DropdownToggle className="card-menu-dropdown-button" color="white">
                            <img src={threeDotIcon} alt="menu" />
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem onClick={this.toggleIsEditing}>Edit</DropdownItem>
                            <DropdownItem onClick={this.toggleWillDelete}>Delete</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledButtonDropdown>}
                    {!this.state.isEditing && this.state.willDelete && <div className='delete-project-popup'>
                        <p>Are you sure you want to delete {project.name}?</p>
                        <button className='delete-project-popup-no' onClick={this.toggleWillDelete}>No</button>
                        <button className='delete-project-popup-yes' onClick={() => this.deleteProject(project.name)}>Yes</button>
                    </div>}
                    {this.state.isEditing ? <input
                        className='edit-name'
                        type='text'
                        defaultValue={this.state.name}
                        placeholder='Name'
                        onChange={this.handleNameChange} /> :
                        <Link to={`/u/defaultUser/${project.name}`}> {/* Requires attention !!!!!!*/}
                            <CardTitle>{project.name}</CardTitle>
                        </Link>}
                </CardHeader>
                <CardBody className="project-card-body">
                    {this.state.isEditing ? <textarea
                        className='edit-desc'
                        defaultValue={this.state.desc}
                        placeholder='Description'
                        onChange={this.handleDescChange} /> : project.description}
                </CardBody>
                {!this.state.isEditing && <ListGroup className="card-footer-list" flush>
                    <ListGroupItem id="project-progress-bar" className="card-footer-list-items">
                        <Progress 
                            animated
                            value={project.pComplete < 0.92 ? Math.round(project.pComplete * 100) + 8 : Math.round(project.pComplete * 100)}
                            color="success">{Math.round(project.pComplete * 100)}%
                        </Progress>
                    </ListGroupItem>
                    <ListGroupItem id="component-tally" className="card-footer-list-items">
                        <ComponentListPopover project={project} />
                    </ListGroupItem>
                </ListGroup>}
                {this.state.isEditing && <CardFooter className='edit-project-options'>
                    <button className='cancel-edit-project' onClick={this.handleCancel}>Cancel</button>
                    <button className='submit-edit-project' onClick={this.checkName}>Done</button>
                    {!this.state.isValid && <p>{this.state.validMsg}</p>}
                </CardFooter>}
            </Card>
        );
    }
}

class ComponentListPopover extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowingComps: false
        }
    }

    toggleComponentView = () => this.setState({ isShowingComponents: !this.state.isShowingComponents });

    openComponentView = () => this.setState({ isShowingComponents: true });

    closeComponentView = () => this.setState({ isShowingComponents: false });

    render() {
        const project = this.props.project;
        return (
            <div className='comp-list-popup'>
                <div onMouseEnter={this.openComponentView} onMouseLeave={this.closeComponentView}
                    id={project.name.replace(/ /g, '-') + '-comp-listview'}>
                    Components: <Badge pill>{project.components.length}</Badge>
                </div>
                <Popover placement='left' isOpen={this.state.isShowingComponents}
                    target={project.name.replace(/ /g, '-') + '-comp-listview'} popperClassName='comp-listview-popover'>
                    <PopoverHeader>Components:</PopoverHeader>
                    <PopoverBody>
                        {project.components.length === 0 ? <p>This project has no components</p> :
                            <ol>
                                {project.components.map(comp => <li key={comp.name} >
                                    <b>{comp.name}</b>
                                </li>)}
                            </ol>}
                    </PopoverBody>
                </Popover>
            </div>
        );
    }
}

export default LandingPage;
