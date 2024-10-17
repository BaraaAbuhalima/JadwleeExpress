import mongoose from "mongoose";
const VerificationTokenSchema = new mongoose.Schema({
  token: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
  user_id: {
    type: mongoose.Schema.Types.String,
    unique: true,
    required: true,
  },
  created_at: {
    type: mongoose.Schema.Types.String,
    default: () => new Date(Date.now()),
  },
  expires_at: {
    type: mongoose.Schema.Types.String,
    default: new Date(Date.now() + 1000 * 60 * 60 * 24),
  },
});
export const VerificationToken = mongoose.model(
  "VerificationToken",
  VerificationTokenSchema
);
