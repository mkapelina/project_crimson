// class to define a project component

import Step from './Step.mjs'

class Comp {
    constructor(name, desc) {
        this.name = name;
        this.desc = desc;
        this.subComps = []
        this.steps = [];
    }

    getStep(step) {
        if (step && step instanceof Step) {
            return this.steps.find(function(val) { return val.name === step.name; });
        }
        return null;
    }

    addStep(step) {
        if (step && step instanceof Step) {
            this.steps.push(step);
        }
    }

    removeStep(step) {
        if (step && step instanceof Step) {
            this.steps = this.steps.filter(function(val) { return val.name !== step.name; });
        }
    }

    addComp(comp) {
        if (comp && comp instanceof Comp) {
            this.subComps.push(comp);
        }
    }

    removeComp(comp) {
        if (comp && comp instanceof Comp) {
            this.subComps = this.comps.filter(function(val) { return val.name !== comp.name});
        }
    }

    jsonify() {
        var subComps = this.subComps.map(comp => comp.jsonify());
        var steps = this.steps.map(step => step.jsonify());
        var json = {
            "name" : this.name,
            "description" : this.desc,
            "subComponents" : subComps,
            "steps" : steps
        };
        return json;
    }
}

export default Comp;