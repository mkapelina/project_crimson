// Class to define a user project

import Comp from './Comp.mjs'

class Project {
    constructor(name, desc) {
        this.name = name;
        this.desc = desc;
        this.comps = [];
    }

    getComp(comp) {
        if (comp && comp instanceof Comp) {
            return this.comps.find(function(val) { return val.name === comp.name; });
        }
        return null;
    }

    addComp(comp) {
        if (comp && comp instanceof Comp) {
            this.comps.push(comp);
        }
    }

    removeComp(comp) {
        if (comp && comp instanceof Comp) {
            this.comps = this.comps.filter(function(val) { return val.name !== comp.name});
        }
    }

    jsonify() {
        var comps = this.comps.map(comp => comp.jsonify())
        var json = {
            "name" : this.name,
            "description" : this.desc,
            "components" : comps
        }
        return json;
    }
}

export default Project;