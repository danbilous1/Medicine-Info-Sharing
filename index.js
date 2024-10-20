import express from 'express';
import path from 'path';

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use(express.static("public"));
const __dirname = path.resolve();
app.set("index", path.join(__dirname, "index"));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const arr = []; // Array to store data

app.listen(3000, () => {
  console.log('Express server initialized');
});
