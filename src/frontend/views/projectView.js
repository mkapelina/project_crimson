import React, { Component } from 'react'
import { ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import expandArrow from './icons/expandArrowMenu.png'
import dotMenu from './icons/threeDotMenu.png'
import './styles/projectViewStyles.css'

class ProjectView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            project: {},
            isLoading: true,
        }
        this.callGetProjectAPI = this.callGetProjectAPI.bind(this);
    }

    callGetProjectAPI() {
        var body = { "name": this.props.match.url.slice(1)}

        fetch('http://localhost:9000/getProject', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(res => res.status === 200 ?
                this.setState({ project: res, isLoading: false }) : console.log(res.message));
    }

    refreshCompList = (res) => this.callGetProjectAPI();

    componentDidMount() {
        this.callGetProjectAPI();
    }

    render() {
        return (
            <div className='project-view-main'>
                {!this.state.isLoading &&
                    <div>
                        <h1>Now viewing project '{this.state.project.name}'</h1>
                        <h3>Components:</h3>
                        <ul className="component-list">
                            {this.state.project.components.length === 0 ?
                                <p>This project has no components, click add component to get started</p> :
                                this.state.project.components.map(comp => <div key={comp.name}>
                                    <ComponentView comp={comp} project={this.state.project} onChange={this.refreshCompList} />
                                </div>)}
                        </ul>
                        <AddComponent
                            project={this.state.project}
                            onAddComp={this.refreshCompList} />
                    </div>
                }
            </div>
        );
    }
}

class ComponentView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowing: false,
            isEditing: false,
            name: "",
            desc: "",
            isValid: true
        };

        this.DeleteComponent = this.DeleteComponent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleIsShowing = () => this.setState({ isShowing: !this.state.isShowing });

    toggleIsEditing = () => this.setState({ isEditing: !this.state.isEditing });

    handleNameChange = (e) => this.setState({ name: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) });

    handleDescChange = (e) => this.setState({ desc: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) });

    handleSubmit(input) {
        var name = input.name;
        var desc = input.desc;

        if (name.length === 0) {
            name = this.props.comp.name;
        }

        if (desc.length === 0) {
            desc = this.props.comp.description;
        }

        var body = { 'name': name, 'desc': desc, 'projectName': this.props.project.name, 'compName': this.props.comp.name };
        

        this.toggleIsEditing();
        fetch('http://localhost:9000/modifyComponent', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(res => res.status === 200 ? this.props.onChange() : console.log(res.message));
    }

    DeleteComponent(comp) {
        var body = { "name": comp.name, "desc": comp.desc, "projectName": this.props.project.name };
        

        fetch('http://localhost:9000/deleteComponent', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body),
        }).then(res => res.json()).then(res => res.status === 200 ?
            this.props.onChange(res) : console.log(res.message));
    }

    render() {
        var comp = this.props.comp;
        return (
            <ListGroup className='comp-li'>
                <ListGroupItem>
                    <ListGroupItemHeading>
                        <button className={this.state.isShowing ? "comp-li-btn-r" : "comp-li-btn"}
                            onClick={this.toggleIsShowing}>
                            <img src={expandArrow} alt="expand" width="10px" height="10px" />
                        </button>
                        {this.state.isEditing ? <input
                            type="text"
                            defaultValue={comp.name}
                            onChange={this.handleNameChange} /> : comp.name}
                        <div className="comp-options">
                            <UncontrolledButtonDropdown direction="left">
                                <DropdownToggle>
                                    <img src={dotMenu} alt="more options" width="10px" height="10px" />
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={this.toggleIsEditing}>
                                        Edit
                                    </DropdownItem>
                                    <DropdownItem onClick={() => this.DeleteComponent(comp)}>
                                        Delete
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledButtonDropdown>
                        </div>
                    </ListGroupItemHeading>
                    <ListGroupItemText>
                        Description: {this.state.isEditing ? <input
                            type="text"
                            defaultValue={comp.description}
                            onChange={this.handleDescChange} /> : comp.description}
                    </ListGroupItemText>
                    {this.state.isEditing && <button className='done-editing' onClick={() => this.handleSubmit(this.state)}>Done</button>}

                    {this.state.isShowing && <div className="expand-comp">
                        <SubCompListView comp={comp} project={this.props.project} />
                        <StepListView comp={comp} project={this.props.project} onChange={this.props.onChange} />
                    </div>}
                </ListGroupItem>
            </ListGroup>
        );
    }
}

class SubCompListView extends Component {
    render() {
        //const subCompList = this.props.comp.subComponents;
        return (
            <div className="subComp-list-view">
                <h6>Sub-Components:</h6>
                <p>Ugh, this will be a bitch to implement</p>
            </div>
        );
    }
}

class StepListView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            steps: this.props.comp.steps,
            isEditing: false,
            name: "",
            desc: "",
            isValid: true
        };
        this.callGetProjectAPI = this.callGetProjectAPI.bind(this);
        this.DeleteStep = this.DeleteStep.bind(this);
    }

    callGetProjectAPI() {
        var body = { 'name': this.props.project.name, 'compName': this.props.comp.name}

        fetch('http://localhost:9000/getSteps', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(res => res.status === 200 ?
            this.setState({ steps: res.steps }) : console.log(res.message));
    }

    refreshStepList = (res) => this.callGetProjectAPI();

    isEditing = () => this.setState({ isEditing: !this.state.isEditing });

    toggleIsShowing = () => this.setState({ isShowing: !this.state.isShowing });

    toggleIsEditing = () => this.setState({ isEditing: !this.state.isEditing });

    handleNameChange = (e) => this.setState({ name: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) });

    handleDescChange = (e) => this.setState({ desc: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) });

    handleSubmit(input, step) {
        var name = input.name;
        var desc = input.desc;

        if (name.length === 0) {
            name = step.name;
        }

        if (desc.length === 0) {
            desc = step.description;
        }

        var body = { 'name': name, 'desc': desc, 'projectName': this.props.project.name, 'compName': this.props.comp.name, 'stepName': step.name };
       

        this.toggleIsEditing();
        fetch('http://localhost:9000/modifyStep', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(res => res.status === 200 ? this.refreshStepList(res) : console.log(res.message));
    }

    DeleteStep(step) {
        var body = {
            "name": step.name, "desc": step.desc,
            "projectName": this.props.project.name, "compName": this.props.comp.name
        };
        

        fetch('http://localhost:9000/deleteStep', {
            headers: { 'Content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body),
        }).then(res => res.json()).then(res => this.refreshStepList(res));
    }

    refreshStepList = (res) => this.callGetProjectAPI();

    FormatStep = (step) => <ListGroupItem>
        <ListGroupItemHeading>
            {this.state.isEditing ? <input
                type="text"
                defaultValue={step.name}
                onChange={this.handleNameChange} /> : step.name}
            <div className="step-options">
                <UncontrolledButtonDropdown direction="left">
                    <DropdownToggle>
                        <img src={dotMenu} alt="more options" width="10px" height="10px" />
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem onClick={this.toggleIsEditing}>
                            Edit
                        </DropdownItem>
                        <DropdownItem onClick={() => this.DeleteStep(step)}>
                            Delete
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledButtonDropdown>
            </div>
        </ListGroupItemHeading>
        <ListGroupItemText>
            Description: {this.state.isEditing ? <input
                type="text"
                defaultValue={step.description}
                onChange={this.handleDescChange} /> : step.description}
        </ListGroupItemText>
        {this.state.isEditing && <button className='done-editing' onClick={() => this.handleSubmit(this.state, step)}>Done</button>}
    </ListGroupItem>

    render() {
        var stepList = this.state.steps;
        return (
            <div className="step-list-view">
                <h6>Steps:</h6>
                <ListGroup>
                    {stepList.length === 0 ? <p>No steps added, click add steps to add a step</p> :
                        stepList.map(step => <div key={step.name}>{this.FormatStep(step)}</div>)}
                    <AddStep comp={this.props.comp} project={this.props.project} onAddStep={this.refreshStepList} />
                </ListGroup>
            </div>
        );
    }
}

class AddStep extends Component {
    constructor(props) {
        super(props);
        this.state = { showAddStep: false };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleShowAddStep = () => this.setState({ showAddStep: !this.state.showAddStep });

    handleCancel = () => this.toggleShowAddStep();

    handleSubmit(input) {
        var name = input.name;
        var desc = input.desc;
        var body = { 'name': name, 'desc': desc, 'projectName': this.props.project.name, 'compName': this.props.comp.name };
        

        this.toggleShowAddStep();
        fetch("http://localhost:9000/addStep", {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(res => this.props.onAddStep(res));
    }

    render() {
        return (
            <div className="add-step-button">
                <button onClick={this.toggleShowAddStep}>Add Step</button>
                {this.state.showAddStep && <AddStepForm
                    onSubmit={this.handleSubmit}
                    onCancel={this.handleCancel}
                    stepNames={this.props.comp.steps.map(step => step.name)} />}
            </div>
        );
    }
}

class AddStepForm extends Component {
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
        if (this.props.stepNames.includes(this.state.name)) {
            this.setState({ isValid: false });
        } else {
            this.props.onSubmit(this.state);
        }
    }

    render() {
        return (
            <div className="add-step-popup">
                <div className="form-popup">
                    <form className="form-container" onSubmit={this.handleSubmit}>
                        <p>Please enter the details for your new Step</p>
                        <label>Step name:</label>
                        <input
                            type="text"
                            id="stepName"
                            onChange={this.handleNameChange}
                            required
                        />
                        {!this.state.isValid &&
                            <p>You cannot have two steps with the same name</p>}
                        <label>Step description:</label>
                        <input
                            type="text"
                            id="stepDesc"
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

class AddComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { showAddComp: false };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    toggleShowAddComp = () => this.setState({ showAddComp: !this.state.showAddComp });

    handleCancel() {
        this.toggleShowAddComp();
    }

    handleSubmit(input) {
        var name = input.name;
        var desc = input.desc;
        var body = { 'name': name, 'desc': desc, 'projectName': this.props.project.name };
        

        this.toggleShowAddComp();
        fetch("http://localhost:9000/addComponent", {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(res => this.props.onAddComp(res));
    }

    render() {
        return (
            <div className="add-component-button">
                <button onClick={this.toggleShowAddComp}>Add Component</button>
                {this.state.showAddComp && <AddCompForm
                    onSubmit={this.handleSubmit}
                    onCancel={this.handleCancel}
                    compNames={this.props.project.components.map(comp => comp.name)} />}
            </div>
        );
    }
}

class AddCompForm extends Component {
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
        if (this.props.compNames.includes(this.state.name)) {
            this.setState({ isValid: false });
        } else {
            this.props.onSubmit(this.state);
        }
    }

    render() {
        return (
            <div className="add-comp-popup">
                <div className="form-popup">
                    <form className="form-container" onSubmit={this.handleSubmit}>
                        <p>Please enter the details for your new Component</p>
                        <label>Component name:</label>
                        <input
                            type="text"
                            id="projName"
                            onChange={this.handleNameChange}
                            required
                        />
                        {!this.state.isValid &&
                            <p>You cannot have two components with the same name</p>}
                        <label>Component description:</label>
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

//=================================================

export default ProjectView;