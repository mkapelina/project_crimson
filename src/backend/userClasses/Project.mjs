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
            var copy = Array.from(this.comps);
            for (var i = 0; i < copy.length; i++) {
                if (copy[i].name === comp.name) {
                    return copy[i];
                }
                copy = copy.concat(copy[i].subComps);
            }
        }
        return null;
    }

    addComp(comp) {
        if (comp && comp instanceof Comp) {
            this.comps.push(comp);
            return true;
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