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
        var body = { "name": this.props.match.url.slice(1), "option": 'PROJECT' }

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
                        <ComponentListView project={this.state.project} onChange={this.refreshCompList} />
                    </div>
                }
            </div>
        );
    }
}

class ComponentListView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAdding: false,
        }
        this.onChange = this.onChange.bind(this);
    }

    toggleIsAdding = () => this.setState({ isAdding: !this.state.isAdding });

    onChange(res) {
        this.toggleIsAdding();
        this.props.onChange(res);
    }

    render() {
        var compList = this.props.project.components;
        return (
            <ListGroup>
                {compList.length === 0 ? <p>No components added, click add component to add a component</p> :
                    compList.map(comp => <ComponentView
                        key={comp.name}
                        project={this.props.project}
                        comp={comp}
                        onChange={this.props.onChange} />)}
                {this.state.isAdding && <ComponentView
                    project={this.props.project}
                    comp={undefined}
                    isEditing={true}
                    onChange={this.onChange} />}
                <button className="add-comp-btn" onClick={this.toggleIsAdding}>Add Component</button>
            </ListGroup>
        );
    }
}

class ComponentView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowing: false,
            isEditing: false || this.props.isEditing,
            name: this.props.comp ? this.props.comp.name : "",
            desc: this.props.comp ? this.props.comp.description : "",
            isValid: true,
            steps: this.props.comp ? this.props.comp.steps : [],
            isAddingStep: false,
        };

        this.DeleteComponent = this.DeleteComponent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.callGetProjectAPI = this.callGetProjectAPI.bind(this);
        this.refreshStepList = this.refreshStepList.bind(this);
    }

    toggleIsShowing = () => this.setState({ isShowing: !this.state.isShowing });

    toggleIsEditing = () => this.setState({ isEditing: !this.state.isEditing });

    toggleIsAddingStep = () => this.setState({ isAddingStep: !this.state.isAddingStep });

    handleNameChange = (e) => this.setState({ name: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) });

    handleDescChange = (e) => this.setState({ desc: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) });

    handleSubmit() {
        var name = this.state.name;
        var desc = this.state.desc;

        if (name.length === 0 || desc.length === 0 ||
            (this.props.project.components.map(comp => comp.name).includes(name) &&
                (!this.props.comp || name !== this.props.comp.name))) {
            this.setState({ isValid: false });
            return;
        }
        else {
            this.setState({ isValid: true });
        }

        var body = { 'name': name, 'desc': desc, 'projectName': this.props.project.name };
        body['type'] = 'COMPONENT';

        if (!this.props.comp) {
            body['option'] = 'ADD';
            fetch('http://localhost:9000/editProjects', {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(body)
            }).then(res => res.json()).then(res => res.status === 200 ? this.props.onChange() : console.log(res.message))
        }
        else {
            this.toggleIsEditing();
            body['option'] = 'MODIFY';
            body['compName'] = this.props.comp.name;
            fetch('http://localhost:9000/editProjects', {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(body)
            }).then(res => res.json()).then(res => res.status === 200 ? this.props.onChange() : console.log(res.message));
        }
    }

    handleCancel = () => this.props.comp ? this.toggleIsEditing() : this.props.onChange();

    DeleteComponent(comp) {
        var body = { "name": comp.name, "desc": comp.desc, "projectName": this.props.project.name };
        body["option"] = "DELETE";
        body['type'] = 'COMPONENT';

        fetch('http://localhost:9000/editProjects', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body),
        }).then(res => res.json()).then(res => res.status === 200 ?
            this.props.onChange(res) : console.log(res.message));
    }

    callGetProjectAPI() {
        var body = { 'name': this.props.project.name, 'compName': this.props.comp.name, 'option': 'STEPS' }

        fetch('http://localhost:9000/getProject', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(res => res.status === 200 ?
            this.setState({ steps: res.steps }) : console.log(res.message));
    }

    refreshStepList(res) {
        this.setState({ isAddingStep: false });
        this.callGetProjectAPI();
    }

    render() {
        var comp = this.props.comp;
        this.props.comp.steps = this.state.steps;
        return (<ListGroupItem>
            <ListGroupItemHeading>
                {!this.state.isEditing && <button className={this.state.isShowing ? "comp-li-btn-r" : "comp-li-btn"}
                    onClick={this.toggleIsShowing}>
                    <img src={expandArrow} alt="expand" width="10px" height="10px" />
                </button>}
                {this.state.isEditing ? <input
                    type="text"
                    defaultValue={comp ? comp.name : ''}
                    placeholder="Name"
                    onChange={this.handleNameChange} /> : comp.name}
                {!this.state.isEditing && <div className="comp-options">
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
                </div>}
            </ListGroupItemHeading>
            <ListGroupItemText>
                Description: {this.state.isEditing ? <input
                    type="text"
                    defaultValue={comp ? comp.description : ''}
                    placeholder="Description"
                    onChange={this.handleDescChange} /> : comp.description}
            </ListGroupItemText>
            {this.state.isEditing && <button className='done-editing' onClick={this.handleSubmit}>Done</button>}
            {this.state.isEditing && <button className='cancel-editing' onClick={this.handleCancel}>Cancel</button>}
            {!this.state.isValid && <p>Invalid input, you cannot have two components of the same name or empty fields for name or description</p>}
            {this.state.isShowing && <div className="expand-comp">
                <SubCompListView comp={comp} project={this.props.project} />
                <h6>Steps:</h6>
                <ListGroup>
                    {this.state.steps.length === 0 ? <p>No steps added, click add steps to add a step</p> :
                        this.state.steps.map(step => <StepView
                            key={step.name}
                            step={step}
                            comp={comp}
                            project={this.props.project}
                            onChange={this.refreshStepList} />)}
                    {this.state.isAddingStep && <StepView
                        project={this.props.project}
                        comp={comp}
                        step={undefined}
                        isEditing={true}
                        onChange={this.refreshStepList} />}
                    <button className="add-step-btn" onClick={this.toggleIsAddingStep}>Add Step</button>
                </ListGroup>
            </div>}
        </ListGroupItem>
        )
    };

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

class StepView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            steps: this.props.comp.steps,
            isEditing: false || this.props.isEditing,
            name: this.props.step ? this.props.step.name : "",
            desc: this.props.step ? this.props.step.description : "",
            isValid: true
        };
        this.DeleteStep = this.DeleteStep.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleIsEditing = () => this.setState({ isEditing: !this.state.isEditing });

    handleNameChange = (e) => this.setState({ name: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) });

    handleDescChange = (e) => this.setState({ desc: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) });

    handleSubmit() {
        var name = this.state.name;
        var desc = this.state.desc;

        if (name.length === 0 || desc.length === 0 ||
            (this.props.comp.steps.map(step => step.name).includes(name) &&
                (!this.props.step || name !== this.props.step.name))) {
            this.setState({ isValid: false });
            return;
        }
        else {
            this.setState({ isValid: true });
        }

        var body = { 'name': name, 'desc': desc, 'projectName': this.props.project.name, 'compName': this.props.comp.name };
        body['type'] = 'STEP';

        if (!this.props.step) {
            body['option'] = 'ADD';

            fetch('http://localhost:9000/editProjects', {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(body)
            }).then(res => res.json()).then(res => res.status === 200 ? this.props.onChange(res) : console.log(res.message));
        }
        else {
            this.toggleIsEditing();
            body['option'] = 'MODIFY';
            body['stepName'] = this.props.step.name;

            fetch('http://localhost:9000/editProjects', {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(body)
            }).then(res => res.json()).then(res => res.status === 200 ? this.props.onChange(res) : console.log(res.message));
        }
    }

    handleCancel = () => this.props.step ? this.toggleIsEditing() : this.props.onChange();

    DeleteStep(step) {
        var body = {
            "name": step.name, "desc": step.desc,
            "projectName": this.props.project.name, "compName": this.props.comp.name
        };
        body["option"] = 'DELETE';
        body['type'] = 'STEP';


        fetch('http://localhost:9000/editProjects', {
            headers: { 'Content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body),
        }).then(res => res.json()).then(res => this.refreshStepList(res));
    }

    refreshStepList = (res) => this.props.onChange(res);

    render() {
        var step = this.props.step;
        return (<ListGroupItem>
            <ListGroupItemHeading>
                {this.state.isEditing ? <input
                    type="text"
                    defaultValue={step ? step.name : ''}
                    placeholder='Name'
                    onChange={this.handleNameChange} /> : step.name}
                <div className="step-options">
                    {!this.state.isEditing && <UncontrolledButtonDropdown direction="left">
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
                    </UncontrolledButtonDropdown>}
                </div>
            </ListGroupItemHeading>
            <ListGroupItemText>
                Description: {this.state.isEditing ? <input
                    type="text"
                    defaultValue={step ? step.description : ''}
                    placeholder='Description'
                    onChange={this.handleDescChange} /> : step.description}
            </ListGroupItemText>
            {this.state.isEditing && <button className='done-editing' onClick={this.handleSubmit}>Done</button>}
            {this.state.isEditing && <button className='cancel-editing' onClick={this.handleCancel}>Cancel</button>}
            {!this.state.isValid && <p>Invalid input, you cannot have two components of the same name or empty fields for name or description</p>}
        </ListGroupItem>
        );
    }
}

//=================================================

export default ProjectView;