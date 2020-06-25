import React, { Component } from 'react'
import { 
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    UncontrolledButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    Jumbotron,
    Container,
    Progress,
    Button,
} from 'reactstrap';

import expandArrow from './icons/expandArrowMenu.png'
import dotMenu from './icons/threeDotMenu.png'
import './styles/projectViewStyles.css'
import menuIcon from './icons/threeLineMenu.png';


// Defines ProjectView component
// Displays selected project and associated components
class ProjectView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            project: {},
            isLoading: true,
            isEditing: false,
            projectName: "",
            isCalculating: false,
        }

    }
    
    refreshProgressBar = (compName, step, isComplete) => {
        this.setState({ isCalculating: true });
        var body = {
            'projectName': this.state.project.name,
            'compName': compName,
            'name': step.name,
            'isCompleted': isComplete
        };

        fetch('http://localhost:9000/updatePercentComplete', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(res => res.status === 200 ?
            this.setState({ project: res, isCalculating: false }) : console.log(res.message));

    }

    callGetProjectAPI() {
        var body = { "name": this.state.projectName.length ? this.state.projectName : this.props.match.url.slice(1) }

        fetch('http://localhost:9000/getProject', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(res => res.status === 200 ?
                this.setState({ project: res, isLoading: false , projectName: res.name}) : console.log(res.message));
    }


    refreshCompList = (res) => this.callGetProjectAPI();

    toggleIsEditing = () => this.setState({ isEditing: !this.state.isEditing }, 
        () => this.state.isEditing && this.nameInput.focus());

    modifyProjectName = async () => {
        let body = {
            "name": this.state.projectName, 
            "desc": this.state.project.desc,
            "projectName": this.state.project.name
        };


        await fetch('http://localhost:9000/modifyProject', {
            headers: { 'Content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body),
        }).then(res => res.json()).then(res => this.refreshCompList(res));
    }
    

    handleNameChange = (e) => this.setState({projectName: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) });

    checkKey = (e) => {
        if(e.key === 'Enter') {
            this.modifyProjectName();
            this.toggleIsEditing();
            window.history.replaceState("this", 'New Project title', `/${this.state.projectName}`); //this will need to be reworked
        }
    }

    componentDidMount() {
        this.callGetProjectAPI();
    }

    render() {
        return (
            <div className='project-view-main'>
                <div className='project-view-header'>
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
                    <h5 className='logo'> Project Crimson</h5>
                </div>
                <div className='project-view-banner'>
                    <Jumbotron fluid className='project-view-banner-jumbotron'>
                        <Container fluid>
                            <h1>Welcome to Project Control</h1>
                            <p>Here you can make changes to and grow your project!</p>
                        </Container>
                    </Jumbotron>
                </div>
                {!this.state.isLoading &&
                    <div className='project-view-content' >
                    {!this.state.isEditing ? 
                        <React.Fragment>
                        <Button id='project-title-button' className='project-title' onClick={this.toggleIsEditing}>
                            <h1>{this.state.projectName}</h1>
                        </Button>
                        </React.Fragment> :
                        <input className="project-title-input"
                            type="text"
                            defaultValue={this.state.projectName}
                            placeholder="Project Name"
                            onKeyDown={this.checkKey}
                            onChange={this.handleNameChange}
                            ref={input => this.nameInput = input}
                            />}
                        <div className='project-progress'>
                            <Progress
                                animated
                                value={this.state.project.pComplete < 0.92 ? Math.round(this.state.project.pComplete * 100) + 8 : Math.round(this.state.project.pComplete * 100)}
                                color="success">{Math.round(this.state.project.pComplete * 100)}%
                            </Progress>
                        </div>
                        <h3>Components:</h3>
                        <ComponentListView
                            project={this.state.project}
                            isCalculating={this.state.isCalculating}
                            onCompletionChange={this.refreshProgressBar}
                            onChange={this.refreshCompList} />
                    </div>
                }
                <div className='project-view-footer'/> {/* empty div added to style the bottom of the page */}
            </div>
        );
    }
} 

//Lays out structure of displaying a project's components 
//Displays empty component when adding new component 
class ComponentListView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAdding: false,
        }
    }

    toggleIsAdding = () => this.setState({ isAdding: !this.state.isAdding });

    onChange = (res) => {
        this.toggleIsAdding();
        this.props.onChange(res);
    }

    render() {
        let compList = this.props.project.components;
        return (
            <ListGroup>
                {compList.length === 0 ? <p>No components added, click add component to add a component</p> :
                    compList.map(comp => <ComponentView
                        key={comp.name}
                        project={this.props.project}
                        comp={comp}
                        isCalculating={this.props.isCalculating}
                        onCompletionChange={this.props.onCompletionChange}
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

//Displays components, subcomponents, and steps 
//handles adding, deleting, and modifing components and sub components 
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
            body: JSON.stringify({ 'name': this.props.project.name, 'compName': this.state.name })
        });

        const json = await res.json();

        if (json.status === 200 && (!this.props.comp || this.props.comp.name !== this.state.name)) {
            this.setState({ isValid: false, validMsg: "Component names must be unique" });
            return;
        }
        this.handleSubmit();
    }
    
    handleSubmit = () => {
        let name = this.state.name;
        let desc = this.state.desc;

        let body = { 'name': name, 'desc': desc, 'projectName': this.props.project.name };

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

    checkKey = (e) => e.key === 'Enter' && this.checkName();

    DeleteComponent = (comp) => {
        let body = { "name": comp.name, "desc": comp.desc, "projectName": this.props.project.name };

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

    callGetSubCompsAPI = () => {
        var body = { 'name': this.props.project.name, 'compName': this.props.comp.name };

        fetch('http://localhost:9000/getSubComponents', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(res => res.status === 200 ?
            this.setState({ subComps: res.subComponents }) : console.log(res.message));
    }

    refreshSubCompList = (res) => {
        this.setState({ isAddingSubComp: false });
        this.callGetSubCompsAPI();
    }

    callGetStepsAPI = () => {
        let body = { 'name': this.props.project.name, 'compName': this.props.comp.name };

        fetch('http://localhost:9000/getSteps', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(res => res.status === 200 ?
            this.setState({ steps: res.steps }) : console.log(res.message));
    }

    refreshStepList = (res) => {
        this.setState({ isAddingStep: false });
        this.callGetStepsAPI();
    }

    handleCompletionChange = (step, isComplete) => this.props.onCompletionChange(this.state.name, step, isComplete);

    render() {
        let comp = this.props.comp;
        if (comp) {
            this.props.comp.steps = this.state.steps;
        }
        return (<ListGroupItem>
            <ListGroupItemHeading>
                {!this.state.isEditing && <button className={this.state.isShowing ? "comp-li-btn-r" : "comp-li-btn"}
                    onClick={this.toggleIsShowing}>
                    <img src={expandArrow} alt="expand" width="10px" height="10px" />
                </button>}
                {!this.state.isEditing ?  
                        <Button  className='component-title-button' onClick={this.toggleIsEditing}>
                            <h1>{this.state.name}</h1>
                        </Button> :
                        <input
                        className="component-title-input"
                        type="text"
                        defaultValue={this.state.name}
                        placeholder="Component Name"
                        onKeyDown={this.checkKey}
                        onChange={this.handleNameChange} 
                        />
                        }
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
            <div className='comp-details'>
                Description: {this.state.isEditing ? <input
                    type="text"
                    defaultValue={this.state.desc}
                    placeholder="Description"
                    onChange={this.handleDescChange}
                    onKeyDown={this.checkKey} /> : comp.description}
                {!this.state.isEditing && <Progress
                    animated
                    value={comp.pComplete < 0.92 ? Math.round(comp.pComplete * 100) + 8 : Math.round(comp.pComplete * 100)}
                    color="success">{Math.round(comp.pComplete * 100)}%
                </Progress>}
            </div>
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
                            isCalculating={this.props.isCalculating}
                            onCompletionChange={this.handleCompletionChange}
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

//handles adding, editing, and deleting steps
//displays the step section 
class StepView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            steps: this.props.comp.steps,
            isEditing: false || this.props.isEditing,
            name: this.props.step ? this.props.step.name : "",
            desc: this.props.step ? this.props.step.description : "",
            isValid: true,
            isCompleted: this.props.step ? this.props.step.completed : false
        };
    }

    toggleIsEditing = () => this.setState({ isEditing: !this.state.isEditing });

    handleNameChange = (e) => this.setState({ name: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) });

    handleDescChange = (e) => this.setState({ desc: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) });

    handleSubmit = () => {
        let name = this.state.name
        let desc = this.state.desc;

        if (name.length === 0 || desc.length === 0 ||
            (this.props.comp.steps.map(step => step.name).includes(name) &&
                (!this.props.step || name !== this.props.step.name))) {
            this.setState({ isValid: false });
            return;
        }
        else {
            this.setState({ isValid: true });
        }

        let body = { 'name': name, 'desc': desc, 'projectName': this.props.project.name, 'compName': this.props.comp.name };

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

    DeleteStep = (step) => {
        let body = {
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

    handleCompletionChange = (step, isCompleted) => {
        this.setState({ isCompleted: !this.state.isCompleted });
        this.props.onCompletionChange(step, !isCompleted)
    }

    render() {
        let step = this.props.step;
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
            <div className='step-details'>
                Description: {this.state.isEditing ? <input
                    type="text"
                    defaultValue={step ? step.description : ''}
                    placeholder='Description'
                    onChange={this.handleDescChange} /> : step.description}
                {!this.state.isEditing && (!this.props.isCalculating &&
                    <input
                        type='checkbox'
                        name={this.state.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                        checked={this.state.isCompleted}
                        onChange={() => this.handleCompletionChange(step, this.state.isCompleted)}
                        className='is-step-completed'
                    /> )}
            </div>
            {this.state.isEditing && <button className='done-editing' onClick={this.handleSubmit}>Done</button>}
            {this.state.isEditing && <button className='cancel-editing' onClick={this.handleCancel}>Cancel</button>}
            {!this.state.isValid && <p>Invalid input, you cannot have two components of the same name or empty fields for name or description</p>}
        </ListGroupItem>
        );
    }
}

//=================================================

export default ProjectView;