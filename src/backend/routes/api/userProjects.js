import User from '../../userClasses/User.mjs'
import Project from '../../userClasses/Project.mjs'
// import Comp from '../../userClasses/Comp.mjs'
// import Step from '../../userClasses/Step.mjs'

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
    app.post('/editProjects', function(req, res) {
        let projName;
        let projDesc;
        let proj;
        let json;

        // let compName;
        // let compDesc;
        // let comp;
        
        // let stepName;
        // let stepDesc
        // let step;

        var mode = req.body.option;

        if (mode === 'ADD') {
            projName = req.body.name;
            projDesc = req.body.desc;
            proj = new Project(projName, projDesc);

            defUser.addProject(proj);
            json = { "status" : 200 };
            res.json(json);
        }

        else if (mode === 'DELETE') {
            projName = req.body.name;
            proj = new Project(projName, "");
            defUser.deleteProject(proj);
            json = { "status" : 200 };
            res.json(json);
        }

        else {
            json = { "status" : 800 };
            res.json(json);
        }
    });

    app.get('/getProjects', function(req, res) {
        let json;

        var projName = req.body.name;

        if (!projName) {
            json = defUser.getAllProjectsJSON();
            json["status"] = 200;
            res.json(json);
        }
        else {
            var proj = new Project(projName, "");
            var userProj = defUser.getProject(proj);
            if (userProj) {
                json = userProj.jsonify();
                json["status"] = 200;
                res.json(json);
            }
            else {
                json["status"] = 404;
                json["message"] = "Project not found";
                res.json(json);
            }
        }
    });
}

export default userAPI;