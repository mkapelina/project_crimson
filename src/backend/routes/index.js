// Each time you add an api to routes/api, you have to import it here
// then call the imported function in collectImports

// api routes
import ProjectsAPI from './api/ProjectsAPI.js';
import SearchAPI from './api/SearchAPI.js';

const collectImports = (app) => {
    ProjectsAPI(app);
    SearchAPI(app);
}


export default collectImports;