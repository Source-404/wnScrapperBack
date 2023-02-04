const express = require("express");
const Project = require("../models/event");
const auth = require("../middleware/auth");
const router = new express.Router();

const MongoClient = require("mongodb").MongoClient;

router.get("/allevents", async (req, res) => {
  MongoClient.connect(
    process.env.MONGODB_URL,
    { useNewUrlParser: true },
    (err, client) => {
      if (err) {
        console.error(err);
      } else {
        const db = client.db("test");
        const events = db.collection("events");

        events.find({}).toArray((err, results) => {
          if (err) {
            console.error(err);
          } else {
            console.log(results);
            res.json(results);
            client.close();
          }
        });
      }
    }
  );
});

module.exports = router;
