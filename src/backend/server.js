import express from 'express'
import cors from 'cors'
import collectImports from './routes/index.js';

const app = express();
const port = 9000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

collectImports(app)

app.get('/', (req, res) => {
  res.send('Welcome to the backend, this is PORT ' + port);
});

app.listen(port, (err) => {
  if (err) { console.log(err) };
  console.log('Listening on port ' + port)
});
