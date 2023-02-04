const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    reported_project: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Project",
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model("Report", reportSchema);
module.exports = Report;
