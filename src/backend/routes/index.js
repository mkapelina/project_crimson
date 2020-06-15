// Each time you add an api to routes/api, you have to import it here
// then call the imported function in collectImports

// api routes
import userAPI from './api/userProjects.js'

const collectImports = (app) => userAPI(app);


export default collectImports;