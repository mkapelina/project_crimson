// class to define a project component

import Step from './Step.mjs'

class Comp {
    constructor(name, desc) {
        this.name = name;
        this.desc = desc;
        this.pComplete = 0;
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
            return true;
        }
    }

    removeStep(step) {
        if (step && step instanceof Step) {
            this.steps = this.steps.filter(function(val) { return val.name !== step.name; });
        }
    }

    addSubComp(comp) {
        if (comp && comp instanceof Comp) {
            this.subComps.push(comp);
            return true;
        }
    }

    removeSubComp(comp) {
        if (comp && comp instanceof Comp) {
            this.subComps = this.subComps.filter(function(val) { return val.name !== comp.name});
        }
    }

    calcCompletionRate() {
        var numComplete = 0;
        this.steps.forEach(function(step) {
            if (step.isComplete) {
                numComplete++;
            }
        });
        if (this.steps.length === 0) {
            return 0;
        }
        return numComplete/this.steps.length;
    }

    jsonify() {
        var subComps = this.subComps.map(comp => comp.jsonify());
        var steps = this.steps.map(step => step.jsonify());
        this.pComplete = this.calcCompletionRate();
        var json = {
            "name" : this.name,
            "description" : this.desc,
            "pComplete" : this.pComplete,
            "subComponents" : subComps,
            "steps" : steps
        };
        return json;
    }
}

export default Comp;