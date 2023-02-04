const express = require("express");
const Project = require("../models/event");
const auth = require("../middleware/auth");
const router = new express.Router();
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

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

router.get("/event/:id", (req, res) => {
  const id = req.params.id;

  MongoClient.connect(
    process.env.MONGODB_URL,
    { useNewUrlParser: true },
    (err, client) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error connecting to the database");
        return;
      }

      const db = client.db("test");
      const elementsCollection = db.collection("events");

      elementsCollection.findOne(
        { _id: new mongodb.ObjectID(id) },
        (err, event) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error retrieving the element");
            return;
          }

          res.send(event);
          client.close();
        }
      );
    }
  );
});

module.exports = router;
