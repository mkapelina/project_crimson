import User from '../../userClasses/User.mjs'
import Project from '../../userClasses/Project.mjs'
import Comp from '../../userClasses/Comp.mjs'
import Step from '../../userClasses/Step.mjs'


var defUser = new User("default guy", "defaultguy@gmail.com");

var json_success = { "status": 200 };
var json_not_found = { "status": 404, 'message': 'not found' };

const userAPI = (app) => {
    app.post('/addProject', function (req, res) {
        var name = req.body.name;
        var desc = req.body.desc;

        var proj = new Project(name, desc);
        defUser.addProject(proj);
        res.json(json_success);

    });

    app.post('/addComponent', function (req, res) {
        let found;
        var name = req.body.name;
        var desc = req.body.desc;

        var proj = new Project(req.body.projectName, '');
        var obj = new Comp(name, desc);
        found = defUser.getProject(proj).addComp(obj);
        found ? res.json(json_success) : res.json(json_not_found);

    });

    app.post('/addSubcomponent', function (req, res) {
        let found;
        var name = req.body.name;
        var desc = req.body.desc;

        var proj = new Project(req.body.projectName, '');
        var comp = new Comp(req.body.compName, '');
        var obj = new Comp(name, desc);
        found = defUser.getProject(proj).getComp(comp).addSubComp(obj);
        found ? res.json(json_success) : res.json(json_not_found);

    });

    app.post('/addStep', function (req, res) {
        let found;
        var name = req.body.name;
        var desc = req.body.desc;

        var proj = new Project(req.body.projectName, '');
        var comp = new Comp(req.body.compName, '');
        var obj = new Step(name, desc);
        found = defUser.getProject(proj).getComp(comp).addStep(obj);
        found ? res.json(json_success) : res.json(json_not_found);
    });

    app.post('/deleteProject', function (req, res) {
        var name = req.body.name;

        var obj = new Project(name, '');
        defUser.deleteProject(obj);
        res.json(json_success);
    });

    app.post('/deleteComponent', function (req, res) {
        var name = req.body.name;

        var proj = new Project(req.body.projectName, '');
        var obj = new Comp(name, '');
        defUser.getProject(proj).removeComp(obj);
        res.json(json_success);
    });

    app.post('/deleteSubcomponent', function (req, res) {
        var name = req.body.name;

        var proj = new Project(req.body.projectName, '');
        var comp = new Comp(req.body.compName, '');
        var obj = new Comp(name, '');
        defUser.getProject(proj).getComp(comp).removeSubComp(obj);
        res.json(json_success);
    });

    app.post('/deleteStep', function (req, res) {
        var name = req.body.name;

        var proj = new Project(req.body.projectName, '');
        var comp = new Comp(req.body.compName, '');
        var obj = new Step(name, '');
        defUser.getProject(proj).getComp(comp).removeStep(obj);
        res.json(json_success);
    });

    app.post('/modifyProject', function (req, res) {
        var name = req.body.name;
        var desc = req.body.desc;

        var obj = new Project(req.body.projectName, '');
        var userProj = defUser.getProject(obj);
        userProj.name = name;
        userProj.desc = desc
        res.json(json_success);
    });

    app.post('/modifyComponent', function (req, res) {
        var name = req.body.name;
        var desc = req.body.desc;

        var proj = new Project(req.body.projectName, '');
        var obj = new Comp(req.body.compName, '');
        var userComp = defUser.getProject(proj).getComp(obj);
        userComp.name = name;
        userComp.desc = desc;
        res.json(json_success);
    });

    app.post('/modifySubcomponent', function (req, res) {
        var name = req.body.name;
        var desc = req.body.desc;

        var proj = new Project(req.body.projectName, '');
        var comp = new Comp(req.body.compName, '');
        var userComp = defUser.getProject(proj).getComp(comp);
        userComp.name = name;
        userComp.desc = desc;
        res.json(json_success);
    });

    app.post('/modifyStep', function (req, res) {
        var name = req.body.name;
        var desc = req.body.desc;

        var proj = new Project(req.body.projectName, '');
        var comp = new Comp(req.body.compName, '');
        var obj = new Step(req.body.stepName, '');
        var userStep = defUser.getProject(proj).getComp(comp).getStep(obj);
        userStep.name = name;
        userStep.desc = desc;
        res.json(json_success);
    });

    app.post('/getProject', function(req, res){
        var json = {};
        var projName = req.body.name;

        if (!projName) {
            json["status"] = 400;
            json["message"] = 'request body must include a project name';
            res.json(json);
        }
        else {
            var project = new Project(projName, '');
            var userProject = defUser.getProject(project);

            if (!userProject) {
                json["status"] = 404;
                json['message'] = `project ${projName} not found`
                res.json(json)
            }
            else {
                json = userProject.jsonify()
                json['status'] = 200;
            }
            res.json(json);
        }
    });

    app.post('/getComponent', function(req, res){
        let comp;
        let obj; 

        var json = {};
        var projName = req.body.name;

        if (!projName) {
            json["status"] = 400;
            json["message"] = 'request body must include a project name';
            res.json(json);
        }
        else {
            var project = new Project(projName, '');
            var userProject = defUser.getProject(project);

            if (!userProject) {
                json["status"] = 404;
                json['message'] = `project ${projName} not found`
                res.json(json)
            }
            else {
                comp = req.body.compName;
                obj = new Comp(comp, '');
                json = userProject.getComp(obj).jsonify();
                json['status'] = 200;
            }
            res.json(json);
        }
    });

    app.post('/getSteps', function(req, res){
        let comp;
        let obj; 
        
        var json = {};
        var projName = req.body.name;

        if (!projName) {
            json["status"] = 400;
            json["message"] = 'request body must include a project name';
            res.json(json);
        }
        else {
            var project = new Project(projName, '');
            var userProject = defUser.getProject(project);

            if (!userProject) {
                json["status"] = 404;
                json['message'] = `project ${projName} not found`
                res.json(json)
            }
            else {
                comp = req.body.compName;
                obj = new Comp(comp, '');
                json = userProject.getComp(obj).jsonify();
                json = { 'steps': json.steps };
                json['status'] = 200;
            }
            res.json(json);
        }
    });

    app.post('/getProject', function (req, res) {
        let comp;
        let obj;

        var json = {};
        var projName = req.body.name;
        var option = req.body.option;

        if (!projName) {
            json["status"] = 400;
            json["message"] = 'request body must include a project name';
            res.json(json);
        }
        else {
            var project = new Project(projName, '');
            var userProject = defUser.getProject(project);

            if (!userProject) {
                json["status"] = 404;
                json['message'] = `project ${projName} not found`
                res.json(json)
            }
            else {
                switch (option) {
                    case 'PROJECT':
                        json = userProject.jsonify()
                        json['status'] = 200;
                        break;
                    case 'COMPONENTS':
                        comp = req.body.compName;
                        obj = new Comp(comp, '');
                        json = userProject.getComp(obj).jsonify();
                        json['status'] = 200;
                        break;
                    case 'STEPS':
                        comp = req.body.compName;
                        obj = new Comp(comp, '');
                        json = userProject.getComp(obj).jsonify();
                        json = { 'steps': json.steps };
                        json['status'] = 200;
                        break;
                    default:
                        json["status"] = 400;
                        json["message"] = 'invalid option type'
                        break;
                }
                res.json(json);
            }
        }

    });

    app.get('/getProjects', function (req, res) {
        var json = defUser.getAllProjectsJSON();
        json["status"] = 200;
        res.json(json);
    });
}

export default userAPI;