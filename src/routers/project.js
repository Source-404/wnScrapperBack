const express = require("express");
const Project = require("../models/project");
const auth = require("../middleware/auth");
const multer = require("multer");
const router = new express.Router();
const Report = require("../models/report");

router.post("/projects", auth, async (req, res) => {
  const proj = new Project({
    ...req.body,
    owner: req.user._id,
  });
  try {
    await proj.save();
    res.status(201).send(proj);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET projects?completed=true
// GET /projects?limit=10&skip=20
// GET /projects?sortBy=createdAt_desc [pending]

router.get("/allProjects", async (req, res) => {
  try {
    const projects = await Project.find({});
    res.send(projects);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.get("/projects", auth, async (req, res) => {
  // const match = {};
  // if (req.query.completed) {
  //   match.completed = req.query.completed == "true";
  // }
  try {
    // await req.user
    //   .populate({
    //     path: "projects",
    //     match,
    //     options: {
    //       limit: parseInt(req.query.limit),
    //       skip: parseInt(req.query.skip),
    //     },
    //   })
    //   .execPopulate();
    //  res.send(req.user.projects);

    const projs = await Project.find({ owner: req.user._id });
    res.send(projs);
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

router.get("/projects/:id", auth, async (req, res) => {
  const _id = req.params.id;
  console.log(_id);
  console.log(req.user._id);
  try {
    const proj = await Project.findOne({ _id, owner: req.user._id });
    if (!proj) {
      return res.status(404).send();
    }
    res.send(proj);
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/projects/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const _id = req.params.id;

  try {
    const proj = await Project.findOne({ _id, owner: req.user._id });
    if (!proj) {
      return res.status(404).send();
    }
    updates.forEach((update) => (proj[update] = req.body[update]));
    await proj.save();
    res.send(proj);
  } catch (e) {
    console.log(e);
    res.status(400).send();
  }
});

router.delete("/projects/:id", auth, async (req, res) => {
  try {
    const proj = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!proj) {
      return res.status(404).send();
    }
    res.send(proj);
  } catch (e) {
    res.status(500).send;
  }
});

const upload = multer({
  limits: {
    fileSize: 10000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.endsWith(".pdf")) {
      return cb(new Error("Please upload only pdf"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/projects/:id/file",
  auth,
  upload.single("file"),
  async (req, res) => {
    const _id = req.params.id;
    console.log(_id);
    console.log(req.file.buffer);
    console.log(req.user._id);
    try {
      const proj = await Project.findOne({ _id, owner: req.user._id });
      if (!proj) {
        return res.status(404).send();
      }
      proj.file = req.file.buffer;
      await proj.save();
      res.status(201).send({ msg: "File uploaded" });
    } catch (e) {
      console.log(e);
      res.status(500).send();
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ err: error.message });
  }
);

router.post("/projects/report/:id", auth, async (req, res) => {
  const _id = req.params.id;

  const proj = await Project.findOne({ _id });

  if (proj.owner.equals(req.user._id)) {
    console.log("why?");
    res.status(405).send({ msg: "cant report your own project" });
    return;
  }

  try {
    const check = await Report.find({
      $and: [{ reporter: req.user._id }, { reported_project: _id }],
    });
    console.log(check);

    if (check.length >= 1) {
      console.log("here", check.length);
      res.status(405).send({ msg: "cant report twice" });
      return;
    }
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }

  const report = new Report({
    ...req.body,
    reporter: req.user._id,
    reported_project: _id,
  });

  try {
    await report.save();
    res.status(201).send(report);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/projects/reports/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const reports = await Report.find({ reported_project: _id });
    res.send(reports);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

router.get("/projects/:id/file", upload.single("file"), async (req, res) => {
  const _id = req.params.id;
  try {
    const proj = await Project.findById(_id);
    if (!proj || !proj.file) {
      throw new Error();
    }

    res.set("Content-Type", "application/pdf");
    res.send(proj.file);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/projects/:id/file", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const proj = await Project.findOne({ _id, owner: req.user._id });
    proj.file = undefined;

    res.send(proj.file);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
