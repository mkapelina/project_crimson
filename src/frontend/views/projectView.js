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
        var body = { "name": this.props.match.url.slice(1) }

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
            isEditing: this.props.isEditing ? this.props.isEditing : false,
            name: this.props.comp ? this.props.comp.name : "",
            desc: this.props.comp ? this.props.comp.description : "",
            isValid: true,
            validMsg: "valid",
            subComps: this.props.comp ? this.props.comp.subComponents : [],
            isAddingSubComp: false,
            steps: this.props.comp ? this.props.comp.steps : [],
            isAddingStep: false,
        };

        this.DeleteComponent = this.DeleteComponent.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.callGetStepsAPI = this.callGetStepsAPI.bind(this);
        this.refreshStepList = this.refreshStepList.bind(this);

        this.callGetSubCompsAPI = this.callGetSubCompsAPI.bind(this);
        this.refreshSubCompList = this.refreshSubCompList.bind(this);
    }

    toggleIsShowing = () => this.setState({ isShowing: !this.state.isShowing });

    toggleIsEditing = () => this.setState({ isEditing: !this.state.isEditing });

    toggleIsAddingStep = () => this.setState({ isAddingStep: !this.state.isAddingStep });

    toggleIsAddingSubComp = () => this.setState({ isAddingSubComp: !this.state.isAddingSubComp });

    handleNameChange = (e) => this.setState({ name: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) });

    handleDescChange = (e) => this.setState({ desc: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) });

    checkName = async () => {
        this.setState({ isValid: true });

        if (this.state.name.length === 0 || this.state.desc.length === 0) {
            this.setState({ isValid: false, validMsg: "Cannot have empty fields" });
            return;
        }

        const res = await fetch('http://localhost:9000/getComponent', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({ 'name': this.props.project.name, 'compName': this.state.name }) });

        const json = await res.json();
        
        if (json.status === 200) {
            this.setState({ isValid: false, validMsg: "Component names must be unique" });
            return;
        }
        this.handleSubmit();
    }
    
    handleSubmit() {
        var name = this.state.name;
        var desc = this.state.desc;

        var body = { 'name': name, 'desc': desc, 'projectName': this.props.project.name };

        if (this.state.isValid) {
            if (!this.props.comp) {
                if (this.props.parent) {
                    body['compName'] = this.props.parent.name;
                }
                fetch('http://localhost:9000/addComponent', {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: JSON.stringify(body)
                }).then(res => res.json()).then(res => res.status === 200 ? this.props.onChange() : console.log(res.message));
            }
            else {
                this.toggleIsEditing();
                body['compName'] = this.props.comp.name;
                fetch('http://localhost:9000/modifyComponent', {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: JSON.stringify(body)
                }).then(res => res.json()).then(res => res.status === 200 ? this.props.onChange() : console.log(res.message));
            }
        }
    }

    handleCancel = () => this.props.comp ? this.toggleIsEditing() : this.props.onChange();

    DeleteComponent(comp) {
        var body = { "name": comp.name, "desc": comp.desc, "projectName": this.props.project.name };

        if (this.props.parent) {
            body['compName'] = this.props.parent.name;
        }

        fetch('http://localhost:9000/deleteComponent', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body),
        }).then(res => res.json()).then(res => res.status === 200 ?
            this.props.onChange(res) : console.log(res.message));

    }

    callGetSubCompsAPI() {
        var body = { 'name': this.props.project.name, 'compName': this.props.comp.name };

        fetch('http://localhost:9000/getSubComponents', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(res => res.status === 200 ?
            this.setState({ subComps: res.subComponents }) : console.log(res.message));
    }

    refreshSubCompList(res) {
        this.setState({ isAddingSubComp: false });
        this.callGetSubCompsAPI();
    }

    callGetStepsAPI() {
        var body = { 'name': this.props.project.name, 'compName': this.props.comp.name };

        fetch('http://localhost:9000/getSteps', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(res => res.status === 200 ?
            this.setState({ steps: res.steps }) : console.log(res.message));
    }

    refreshStepList(res) {
        this.setState({ isAddingStep: false });
        this.callGetStepsAPI();
    }

    render() {
        var comp = this.props.comp;
        if (comp) {
            this.props.comp.steps = this.state.steps;
        }
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
            {this.state.isEditing && <button className='done-editing' onClick={this.checkName}>Done</button>}
            {this.state.isEditing && <button className='cancel-editing' onClick={this.handleCancel}>Cancel</button>}
            {!this.state.isValid && <p>{this.state.validMsg}</p>}
            {this.state.isShowing && <div className="expand-comp">
                <h6>Sub-Components:</h6>
                <ListGroup>
                    {this.state.subComps.length === 0 ? <p>No Sub-Components added, click add Sub-Component to add a Sub-Component</p> :
                        this.state.subComps.map(subComp => <ComponentView
                            key={subComp.name}
                            project={this.props.project}
                            comp={subComp}
                            parent={comp}
                            onChange={this.refreshSubCompList} />)}
                    {this.state.isAddingSubComp && <ComponentView
                        project={this.props.project}
                        comp={undefined}
                        parent={comp}
                        isEditing={true}
                        onChange={this.refreshSubCompList} />}
                    <button className="add-subcomp-btn" onClick={this.toggleIsAddingSubComp}>Add Sub-Component</button>
                </ListGroup>
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

        if (!this.props.step) {
            fetch('http://localhost:9000/addStep', {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: JSON.stringify(body)
            }).then(res => res.json()).then(res => res.status === 200 ? this.props.onChange(res) : console.log(res.message));
        }
        else {
            this.toggleIsEditing();
            body['stepName'] = this.props.step.name;

            fetch('http://localhost:9000/modifyStep', {
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


        fetch('http://localhost:9000/deleteStep', {
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