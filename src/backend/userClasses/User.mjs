// Class to define a user

import Project from './Project.mjs'

class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
        this.projectList = [];
    }

    addProject(proj) {
        if (proj && proj instanceof Project) {
            this.projectList.push(proj);
        }
    }

    deleteProject(proj) {
        if (proj && proj instanceof Project) {
            this.projectList = this.projectList.filter(function(val) { return val.name !== proj.name; });
        }
    }

    getProject(proj) {
        if (proj && proj instanceof Project) {
            return this.projectList.find(function(val) { return val.name === proj.name; });
        }
        return null;
    }

    getAllProjectsJSON() {
        var jsonList = this.projectList.map(proj => proj.jsonify());
        var json = { "projects" : jsonList };
        return json;
    }
}

export default User;