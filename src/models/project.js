const mongoose = require("mongoose");
const Report = require("./report");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    file: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.virtual("reports", {
  ref: "Report",
  localField: "_id",
  foreignField: "reported_project",
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
