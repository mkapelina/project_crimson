// class to define a step in a component

class Step {
    constructor(name, desc, number) {
        this.name = name;
        this.desc = desc;
        this.number = number;
    }

    jsonify() {
        var json = {
            "name" : this.name,
            "description" : this.desc,
            "number" : this.number
        };
        return json;
    }
}

export default Step;