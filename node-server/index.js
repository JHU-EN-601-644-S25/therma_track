const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes/router");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const DB_FILE = "node_database.db";

function initDB() {
  const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
      console.error("Error creating database:", err);
      return;
    }

    const schemaSQL = fs.readFileSync("schema.sql", "utf8");
    db.exec(schemaSQL, (err) => {
      if (err) console.error("Error initializing database:", err);
    });

    db.close();
  });
}

initDB();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use("/", router);

const port = 4000;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
