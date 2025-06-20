const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    fileId: {
      type: String,
      required: true,
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);



// Create the User model
const File = mongoose.model("File", fileSchema);

module.exports = File;
