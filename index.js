import express from "express";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import session from "express-session";
import { body, validationResult } from "express-validator";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
const __dirname = path.resolve();

// Global session middleware
app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

const database = {};
let deleted = false;

app.post(
  "/api",
  [
    body("data.medicine")
      .isString()
      .notEmpty()
      .withMessage("Medicine name must be a non-empty string"),
    body("data.producer")
      .isString()
      .notEmpty()
      .withMessage("Producer must be a non-empty string"),
    body("data.storage")
      .isString()
      .notEmpty()
      .withMessage("Storage must be a non-empty string"),
    body("data.expiration")
      .isISO8601()
      .withMessage("Expiration must be a valid ISO8601 date"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(false);
    }

    let link = uuidv4();
    let pass = uuidv4();
    let name = uuidv4();

    const { data } = req.body;

    if (data && data.medicine) {
      data.pass = pass.slice(0, 8);

      // Invite link.
      app.get(`/${link.slice(0, 8)}`, (req, res) => {
        if (deleted) {
          res.sendFile(path.join(__dirname, "public", "404.html"));
        } else {
          res.sendFile(path.join(__dirname, "public", "invite.html"));
        }
      });

      app.delete(`/${link.slice(0, 8)}`, (req, res) => {
        // before deleting check if password and session is correct
        const body = req.body;
        delete database[body];
        deleted = true;
        res
          .status(200)
          .json({ message: "Deleted successfully", redirectTo: "/" });
      });

      // Checking password for editing permission.
      app.post(`/${link.slice(0, 8)}/check`, (req, res) => {
        const { pass } = req.body;

        if (data && data.pass === pass) {
          req.session.data = data; // Session starts here
          req.session.pass = pass;
          res.json({ res: true, name: name.slice(0, 8) });
        } else {
          res.status(400).json(false);
        }
      });

      // Request to edit
      app.patch(
        `/${link.slice(0, 8)}/edit`,
        [
          body("patchBody.medicine")
            .isString()
            .notEmpty()
            .withMessage("Medicine name must be a non-empty string"),
          body("patchBody.producer")
            .isString()
            .notEmpty()
            .withMessage("Producer must be a non-empty string"),
          body("patchBody.storage")
            .isString()
            .notEmpty()
            .withMessage("Storage must be a non-empty string"),
          body("patchBody.expiration")
            .isISO8601()
            .withMessage("Expiration must be a valid ISO8601 date"),
        ],
        (req, res) => {
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res
              .status(400)
              .json({ message: "Inputs are empty or non-valid" });
          }

          const { patchBody } = req.body;

          if (req.session && req.session.pass === data.pass) {
            if (
              patchBody.medicine !== database[name.slice(0, 8)].medicine ||
              patchBody.producer !== database[name.slice(0, 8)].producer ||
              patchBody.storage !== database[name.slice(0, 8)].storage ||
              patchBody.expiration !== database[name.slice(0, 8)].expiration ||
              patchBody.comment !== database[name.slice(0, 8)].comment
            ) {
              database[name.slice(0, 8)].medicine = patchBody.medicine;
              database[name.slice(0, 8)].producer = patchBody.producer;
              database[name.slice(0, 8)].storage = patchBody.storage;
              database[name.slice(0, 8)].expiration = patchBody.expiration;
              database[name.slice(0, 8)].comment = patchBody.comment;
              res.json(true);
            } else {
              res.json({ message: "No changes detected." });
            }
          } else {
            res.json({
              sessionStatus: "Session is expired or password is not correct.",
            });
          }
        }
      );

      // Data for invite link.
      app.get(`/${link.slice(0, 8)}/data`, (req, res) => {
        res.json(database[name.slice(0, 8)]);
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
  }
);

app.listen(3000, () => {
  console.log("Express server initialized");
});
