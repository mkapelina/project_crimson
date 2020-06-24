// class to define a step in a component

class Step {
    constructor(name, desc, number) {
        this.name = name;
        this.desc = desc;
        this.isComplete = false;
        this.number = number;
    }

    jsonify() {
        var json = {
            "name" : this.name,
            "description" : this.desc,
            "completed" : this.isComplete,
            "number" : this.number
        };
        return json;
    }
}

export default Step;