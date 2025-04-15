const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const router = express.Router();
const db = new sqlite3.Database("node_database.db");

router.get("/temperature/:patient_id", (req, res) => {
  const patient_id = req.params.patient_id;
  db.all(
    "SELECT timestamp, temp_data FROM Temperature WHERE patient_id = ?",
    [patient_id],
    (err, user) => {
      if (err) return res.json({ message: "Database error" });
      else return res.json(user);
    }
  );
});

router.post("/login/patient", (req, res) => {
  const { username, password } = req.body;

  if (username == "" || password === "") {
    return res.json({ message: "Username and password are required" });
  }

  db.get(
    "SELECT * FROM Patients WHERE username = ?",
    [username],
    (err, user) => {
      if (err) return res.json({ message: "Database error" });

      if (user === undefined || password !== user.user_password)
        return res.json({ message: "Invalid username or password" });

      db.run(
        "UPDATE Patients SET last_login = CURRENT_TIMESTAMP WHERE patient_id = ?",
        [user.patient_id],
        function (err) {
          if (err) console.error("Error updating last_login:", err);
        }
      );
      return res.json({ message: null, id: user.patient_id });
    }
  );
});

router.post("/login/doctor", (req, res) => {
  const { username, password } = req.body;

  if (username == "" || password === "") {
    return res.json({ message: "Username and password are required" });
  }

  db.get(
    "SELECT * FROM Doctors WHERE user_password = ?",
    [password],
    (err, user) => {
      if (err) return res.json({ message: "Database error" });

      if (user === undefined || password !== user.user_password)
        return res.json({ message: "Invalid username or password" });

      db.run(
        "UPDATE Doctors SET last_login = CURRENT_TIMESTAMP WHERE doctor_id = ?",
        [user.doctor_id],
        function (err) {
          if (err) console.error("Error updating last_login:", err);
        }
      );
      return res.json({ message: null, id: user.doctor_id });
    }
  );
});

router.post("/signup/patient", (req, res) => {
  const { username, password } = req.body;
  if (username === "" || password === "")
    return res.json({ message: "Username and password are required" });

  db.run(
    "INSERT INTO Patients (username, user_password, last_login) VALUES (?, ?, CURRENT_TIMESTAMP)",
    [username, password],
    (err) => {
      if (err)
        return res.json({
          message: "Fail to sign up. Please choose a different username.",
        });
      db.get(
        "SELECT * FROM Patients WHERE username = ?",
        [username],
        (err, user) => {
          if (err)
            return res.json({ message: "Error retrieving inserted row" });
          else return res.json({ message: null, id: user.patient_id });
        }
      );
    }
  );
});

router.post("/signup/doctor", (req, res) => {
  const { username, password } = req.body;

  if (username === "" || password === "")
    return res.json({ message: "Username and password are required" });

  db.run(
    "INSERT INTO Doctors (user_password, last_login) VALUES (?, CURRENT_TIMESTAMP)",
    [password],
    (err) => {
      if (err)
        return res.json({
          message: "Fail to sign up. Please choose a different username.",
        });
      db.get(
        "SELECT * FROM Doctors WHERE user_password = ?",
        [password],
        (err, user) => {
          if (err)
            return res.json({ message: "Error retrieving inserted row" });
          else return res.json({ message: null, id: user.doctor_id });
        }
      );
    }
  );
});

router.get("/doctor/check_patient/:doctor_id", (req, res) => {
  const doctor_id = req.params.doctor_id;
  db.all(
    "SELECT patient_id FROM DoctorPatients WHERE doctor_id = ?",
    [doctor_id],
    (err, user) => {
      if (err) return res.json({ message: "Error retrieving inserted row" });
      else return res.json(user);
    }
  );
});

router.post("/doctor/connect_patient", (req, res) => {
  const { doctor_id, patient_id } = req.body;
  db.run(
    "INSERT INTO DoctorPatients (patient_id, doctor_id) VALUES (?, ?)",
    [patient_id, doctor_id],
    (err) => {
      if (err)
        return res.json({
          message: "Error: unable to connect to specified patient",
        });
      else return res.json({ message: null });
    }
  );
});

module.exports = router;
