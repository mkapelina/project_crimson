// class to define a project component

import Step from './Step.mjs'

class Comp {
    constructor(name, desc) {
        this.name = name;
        this.desc = desc;
        this.level = 0;

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
            comp.level = this.level + 1
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
        var numStepsComplete = 0;
        this.steps.forEach( function(step) {step.isComplete && numStepsComplete++});

        var pSubCompComplete = 0;
        this.subComps.forEach(function(comp) {pSubCompComplete += comp.calcCompletionRate()});

        var numer = numStepsComplete + pSubCompComplete;
        var denom = this.steps.length + this.subComps.length;
        this.pComplete = denom === 0 ? 0 : numer/denom;
        
        return this.pComplete;
    }

    jsonify() {
        var subComps = this.subComps.map(comp => comp.jsonify());
        var steps = this.steps.map(step => step.jsonify());
        var json = {
            "name" : this.name,
            "description" : this.desc,
            "level" : this.level,
            "pComplete" : this.calcCompletionRate(),
            "subComponents" : subComps,
            "steps" : steps
        };
        return json;
    }
}

export default Comp;