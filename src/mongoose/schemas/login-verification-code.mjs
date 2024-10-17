import mongoose from "mongoose";
const loginVerificationCodeSchema = new mongoose.Schema({
  code: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.String,

    required: true,
  },
  expires_at: {
    type: mongoose.Schema.Types.String,
    default: () => {
      return new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours from now
    },
  },
  created_at: {
    type: mongoose.Schema.Types.String,
    default: () => new Date(Date.now()),
  },
});
export const LoginVerificationCode = mongoose.model(
  "Login-Verification-Code",
  loginVerificationCodeSchema
);
