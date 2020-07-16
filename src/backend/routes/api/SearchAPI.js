import { defUser } from './ProjectsAPI.js';

// may not be necessary, search moved to frontend, but might be necessary later so the file will stay
const SearchAPI = (app) => {
    app.post('/searchProjects', function(req, res) {
        var projects = defUser.getAllProjectsJSON().projects;
        var projectNames = projects.map(project => project.name)

        var query = req.body.search;

        // not for anything yet, will eventually be used if user applies filters to a search
        var params = req.body.params;


    });
}

export default SearchAPI;