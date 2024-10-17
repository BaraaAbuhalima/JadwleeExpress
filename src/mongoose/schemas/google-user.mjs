import { validationResult } from "express-validator";
import mongoose from "mongoose";
const photoSchema = new mongoose.Schema({
  value: {
    type: String,
    required: true,
  },
});
const emailSchema = new mongoose.Schema({
  value: { type: mongoose.Schema.Types.String },
  verified: { type: mongoose.Schema.Types.Boolean },
});
const GoogleUSerSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.String,
    // required: true,
    // unique: true,
  },
  emails: {
    type: [emailSchema],
    default: [],
  },
  id: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  name: {
    givenName: { type: mongoose.Schema.Types.String },
    familyName: { type: mongoose.Schema.Types.String },
    // required: true,
  },
  displayName: {
    type: mongoose.Schema.Types.String,
  },

  photos: {
    type: [photoSchema],
    default: [],
  },
});
export const GoogleUser = mongoose.model("GoogleUser", GoogleUSerSchema);
