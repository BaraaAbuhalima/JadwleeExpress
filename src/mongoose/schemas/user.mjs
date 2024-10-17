import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";
const AutoIncrement = AutoIncrementFactory(mongoose);
const USerSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  password: {
    type: mongoose.Schema.Types.String,
  },
  email: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  active: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
  },
  created_at: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  },
  activated_at: {
    type: mongoose.Schema.Types.Date,
  },
  photo: {
    type: mongoose.Schema.Types.Mixed,
  },
  role: { type: mongoose.Schema.Types.String, default: "user" },

  displayName: {
    required: true,
    type: mongoose.Schema.Types.String,
  },

  googleStrategy: {
    type: mongoose.Schema.Types.Mixed,
  },
  strategies: {
    type: mongoose.Schema.Types.Array,
  },
  friends: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  zajelID: {
    type: mongoose.Schema.Types.String,
  },
  zajelPassword: {
    type: mongoose.Schema.Types.String,
  },
  Schedule: {
    type: mongoose.Schema.Types.Mixed,
  },
});
USerSchema.plugin(AutoIncrement, { inc_field: "userNumber" });
export const User = mongoose.model("User", USerSchema);
