import User from '../../userClasses/User.mjs'
import Project from '../../userClasses/Project.mjs'
import Comp from '../../userClasses/Comp.mjs'
import Step from '../../userClasses/Step.mjs'

var json_success = { "status": 200 };
var json_not_found = { "status": 404, 'message': 'not found' };

export let defUser = new User("default guy", "defaultguy@gmail.com");

const ProjectsAPI = (app) => {
    app.post('/addProject', function (req, res) {
        var name = req.body.name;
        var desc = req.body.desc;

        var proj = new Project(name, desc);
        defUser.addProject(proj);
        res.json(json_success);

    });

    app.post('/addComponent', function (req, res) {
        var name = req.body.name;
        var desc = req.body.desc;
        var parentCompName = req.body.compName

        var proj = new Project(req.body.projectName, '');
        var obj = new Comp(name, desc);

        var userProject = defUser.getProject(proj);
        if (!userProject) {
            res.json(json_not_found);
        }
        else {
            if (!parentCompName) {
                userProject.addComp(obj);
                res.json(json_success);
            }
            else {
                var parentComp = new Comp(parentCompName, '');
                var userComp = userProject.getComp(parentComp);
                if (!userComp) {
                    res.json(json_not_found);
                }
                else {
                    obj.level = userComp.level;
                    userComp.addSubComp(obj);
                    res.json(json_success);
                }
            }
        }
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
        var userProject = defUser.getProject(proj);
        var parentCompName = req.body.compName;

        if (!userProject) {
            res.json(json_not_found);
        }
        else {
            if (!parentCompName) {
                userProject.removeComp(obj);
                res.json(json_success);
            }
            else {
                var parentComp = new Comp(parentCompName, '');
                var userComp = userProject.getComp(parentComp);
                if (!userComp) {
                    res.json(json_not_found);
                }
                else {
                    userComp.removeSubComp(obj);
                    res.json(json_success);
                }
            }
        }
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

    app.post('/getProject', function (req, res) {
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

    app.post('/getComponent', function (req, res) {
        let comp;
        let obj;

        var json = {};
        var projName = req.body.name;

        if (!projName) {
            json["status"] = 400;
            json["message"] = 'request body must include a project name';
        }
        else {
            var project = new Project(projName, '');
            var userProject = defUser.getProject(project);

            if (!userProject) {
                json["status"] = 404;
                json['message'] = `project ${projName} not found`
            }
            else {
                comp = req.body.compName;
                obj = new Comp(comp, '');
                var userComp = userProject.getComp(obj);
                if (!userComp) {
                    json['status'] = 404;
                    json['message'] = `project ${comp} not found`
                }
                else {
                    json = userComp.jsonify();
                    json['status'] = 200;
                }
            }
        }
        res.json(json);
    });

    app.post('/getSubComponents', function (req, res) {
        var json = {};

        var projName = req.body.name;
        var compName = req.body.compName;

        if (!projName || !compName) {
            json['status'] = 400;
            json['message'] = 'request body must include project name and parent component name';
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
                var comp = new Comp(compName, '');
                var userComp = userProject.getComp(comp);
                if (!userComp) {
                    json["status"] = 404;
                    json['message'] = `component ${compName} not found`
                }
                else {
                    json = userComp.jsonify();
                    json = { 'subComponents': json.subComponents };
                    json['status'] = 200;
                }
            }
            res.json(json);

        }
    });

    app.post('/getSteps', function (req, res) {
        var json = {};

        var projName = req.body.name;
        var compName = req.body.compName;

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
                var comp = new Comp(compName, '');
                json = userProject.getComp(comp).jsonify();
                json = { 'steps': json.steps };
                json['status'] = 200;
            }
            res.json(json);
        }
    });

    app.post('/updatePercentComplete', function (req, res) {
        let json = {};
        let project;
        let userProject;
        let comp;
        let userComp;
        let step;
        let userStep;

        let name = req.body.name;
        let projectName = req.body.projectName;
        let compName = req.body.compName;
        let isCompleted = req.body.isCompleted;

        if (!(typeof isCompleted === 'boolean')) {
            json['status'] = 400;
            json['message'] = 'request field must have a boolean value "isCompleted"'
            res.json(json);
            return;
        }

        project = new Project(projectName, '');
        userProject = defUser.getProject(project);
        if (!userProject) {
            json['status'] = 404;
            json['message'] = `project ${projectName} not found`;
        }
        else {
            comp = new Comp(compName, '');
            userComp = userProject.getComp(comp);
            if (!userComp) {
                json['status'] = 404;
                json['message'] = `component ${compName} not found`;
            }
            else {
                step = new Step(name, '');
                userStep = userComp.getStep(step)
                if (!userStep) {
                    json['status'] = 404;
                    json['message'] = `step ${name} not found`;
                }
                else {
                    userStep.isComplete = isCompleted;
                    json = userProject.jsonify();
                    json['status'] = 200;
                }
            }
        }
        res.json(json);
    });

    app.get('/getProjects', function (req, res) {
        var json = defUser.getAllProjectsJSON();
        json["status"] = 200;
        res.json(json);
    });
}

export default ProjectsAPI;