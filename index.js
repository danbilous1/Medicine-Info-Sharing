import express from "express";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import session from "express-session";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));
const __dirname = path.resolve();
app.set("index", path.join(__dirname, "index"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const database = {};
let link = uuidv4();
let name = uuidv4();
let pass = uuidv4();

app.post("/api", (req, res) => {
  const { data } = req.body;

  if (data && data.medicine) {
    data.pass = pass.slice(0, 8);

    app.get(`/${link.slice(0, 8)}`, (req, res) => {
      const session = session({
        secret: uuidv4(),
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 },
      });

      res.sendFile(path.join(__dirname, "public", "invite.html"));

      app.post(`/${link.slice(0, 8)}/check`, (req, res) => {
        const { pass } = req.body;

        if (data && data.pass === pass) {
          app.use(session);

          req.session.data = data;
          setTimeout(() => {
            req.session.destroy();
          }, 60000);

          res.json(true);
        } else {
          res.status(400).json(false);
        }
      });

      app.get(`/${link.slice(0, 8)}/session-status`, (req, res) => {
        if (req.session && req.session.data) {
          res.json({ active: true });
        } else {
          res.json({ active: false });
        }
      });

      app.get(`/${link.slice(0, 8)}/data`, (req, res) => {
        res.json(database[name.slice(0, 8)]);
      });
    });

    database[name.slice(0, 8)] = data;

    res.status(200).json({
      link: `/${link.slice(0, 8)}`,
      pass: data.pass,
    });
    console.log(database);
  } else {
    res.status(400).json({ success: false, message: "No data provided" });
  }
});

app.listen(3000, () => {
  console.log("Express server initialized");
});
