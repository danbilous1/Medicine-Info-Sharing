import express from 'express';
import path from 'path';
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
const __dirname = path.resolve();
app.set("index", path.join(__dirname, "index"));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const database = {};

app.post('/api', (req, res) => {
  const { data } = req.body;

  if (data && data.medicine) {
    let link = uuidv4();
    let name = uuidv4();

    app.get(`/${link.slice(0,8)}`, (req, res) => {
      
      res.sendFile(path.join(__dirname, 'public', 'invite.html'));

      app.get(`/${link.slice(0, 8)}/data`, (req, res) => {
        res.json(database[name.slice(0,8)]);
      });
    })
    
    database[name.slice(0,8)] = data;

    res.status(200).json({link: `/${link.slice(0,8)}`, info: database[name.slice(0,8)]});
    console.log(database);
  } else {
    res.status(400).json({ success: false, message: 'No data provided' });
  }
});

app.listen(3000, () => {
  console.log('Express server initialized');
});
