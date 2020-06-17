import User from '../../userClasses/User.mjs'
import Project from '../../userClasses/Project.mjs'
import Comp from '../../userClasses/Comp.mjs'
import Step from '../../userClasses/Step.mjs'

//======================================================================
// creating a default user with a default project for testing purposes

var defUser = new User("default guy", "defaultguy@gmail.com");

// var defProject = new Project("first project", "hello world");

// var defComp1 = new Comp("Say hello", "requires courage");
// var defComp2 = new Comp("Say world", "requires confidence");
// var defStep1 = new Step("print hello", "type sys.out.print(hello)", 1);
// var defStep2 = new Step("print world", "type sys.out.print(world)");

// defComp1.addStep(defStep1);
// defComp2.addStep(defStep2);
// defProject.addComp(defComp1);
// defProject.addComp(defComp2);
// defUser.addProject(defProject);

//======================================================================

const userAPI = (app) => {
    app.post('/editProjects', function (req, res) {
        let proj;
        let comp;
        let obj;
        let found;

        var option = req.body.option;
        var type = req.body.type;

        var name = req.body.name;
        var desc = req.body.desc;

        var json_success = { "status": 200 };
        var json_bad_option = { "status": 400, 'message': 'invalid option ' + option };
        var json_bad_type = { "status": 400, 'message': 'invalid option type ' + type }
        var json_not_found = { "status": 404, 'message': type + ' ' + name + ' not found' }

        switch (option) {
            case 'ADD':
                switch (type) {
                    case 'PROJECT':
                        obj = new Project(name, desc);
                        defUser.addProject(obj);
                        res.json(json_success);
                        break;
                    case 'COMPONENT':
                        proj = new Project(req.body.projectName, '');
                        obj = new Comp(name, desc);
                        found = defUser.getProject(proj).addComp(obj);
                        found ? res.json(json_success) : res.json(json_not_found);
                        break;
                    case 'SUBCOMPONENT':
                        proj = new Project(req.body.projectName, '');
                        comp = new Comp(req.body.compName, '');
                        obj = new Comp(name, desc);
                        found = defUser.getProject(proj).getComp(comp).addSubComp(obj);
                        found ? res.json(json_success) : res.json(json_not_found);
                        break;
                    case 'STEP':
                        proj = new Project(req.body.projectName, '');
                        comp = new Comp(req.body.compName, '');
                        obj = new Step(name, desc);
                        found = defUser.getProject(proj).getComp(comp).addStep(obj);
                        found ? res.json(json_success) : res.json(json_not_found);
                        break;
                    default:
                        res.json(json_bad_type);
                        break;
                }
                break;
            case 'DELETE':
                switch(type) {
                    case 'PROJECT':
                        obj = new Project(name, '');
                        defUser.deleteProject(obj);
                        res.json(json_success);
                        break;
                    case 'COMPONENT':
                        proj = new Project(req.body.projectName, '');
                        obj = new Comp(name, '');
                        defUser.getProject(proj).removeComp(obj);
                        res.json(json_success);
                        break;
                    case 'SUBCOMPONENT':
                        proj = new Project(req.body.projectName, '');
                        comp = new Comp(req.body.compName, '');
                        obj = new Comp(name, '');
                        defUser.getProject(proj).getComp(comp).removeSubComp(obj);
                        res.json(json_success);
                        break;
                    case 'STEP':
                        proj = new Project(req.body.projectName, '');
                        comp = new Comp(req.body.compName, '');
                        obj = new Step(name, '');
                        defUser.getProject(proj).getComp(comp).removeStep(obj);
                        res.json(json_success);
                        break;
                    default:
                        res.json(json_bad_type);
                        break;
                }
                break;
            default:
                res.json(json_bad_option);
        }
    });

    app.post('/getProject', function (req, res) {
        var json = {};
        var projName = req.body.name;

        if (!projName) {
            json["status"] = 404;
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