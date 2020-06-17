import React, { Component } from 'react'

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
        var body = { name: this.props.match.url.substring(1) }

        fetch('http://localhost:9000/getProject', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(res => res.status === 200 ? 
                this.setState({ project: res, isLoading: false }) : console.log(res.message));
    }

    refreshCompList = (res) => res.status === 200 ? 
        this.callGetProjectAPI() : console.log(res.message);

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
                        <ul className='component-list'>
                            <GetComponentListView project={this.state.project} />
                            <AddComponent
                                project={this.state.project}
                                onAddComp={this.refreshCompList} />
                        </ul>
                    </div>
                }
            </div>
        );
    }
}

class GetComponentListView extends Component {
    FormatComponent = (comp) => (
        <li>
            <div className='comp-li'>
                <h5>{comp.name}</h5>
                <p>: {comp.description}</p>
            </div>
        </li>);

    render() {
        const compList = this.props.project.components;
        return (
            <li>
                {compList.length === 0 ?
                    <p>This project has no components, click add component to get started</p> :
                    this.props.project.components.map(comp =>
                        <div key={comp.name}> {this.FormatComponent(comp)}</div>)}
            </li>
        );
    }
}

class AddComponent extends Component {
    constructor(props) {
        super(props);
        this.state = { showAddComp: false };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleShowAddComp = () => this.setState({ showAddComp: !this.state.showAddComp });

    handleCancel = () => this.toggleShowAddComp;

    handleSubmit(input) {
        var name = input.name;
        var desc = input.desc;
        var body = { 'name': name, 'desc': desc, 'projectName': this.props.project.name };
        body['option'] = 'ADD';
        body['type'] = 'COMPONENT';

        this.toggleShowAddComp();
        fetch("http://localhost:9000/editProjects", {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(body)
        }).then(res => res.json()).then(res => this.props.onAddComp(res));
    }

    render() {
        return (
            <li>
                <button onClick={this.toggleShowAddComp}>Add Component</button>
                {this.state.showAddComp && <AddCompForm
                    onSubmit={this.handleSubmit}
                    onCancel={this.handleCancel}
                    compNames={this.props.project.components.map(comp => comp.name)} />}
            </li>
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
        this.setState({ name: e.target.value });
    }

    handleDescChange(e) {
        this.setState({ desc: e.target.value });
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
                        <p>Please enter the details for your new Project</p>
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