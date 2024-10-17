import bcrypt from "bcrypt";
const saltRounds = 10;
const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};
const comparePassword = (plainPassword, hashedPassword) => {
  return bcrypt.compareSync(plainPassword, hashedPassword);
};
const generateVerificationCode = () => {
  const min = Math.pow(
    10,
    parseInt(process.env.VERIFICATION_CODE_NUM_OF_DIGIT - 1)
  );
  const max =
    Math.pow(10, parseInt(process.env.VERIFICATION_CODE_NUM_OF_DIGIT)) - 1;
  console.log(min, max);
  const message = (
    Math.floor(Math.random() * (max - min + 1)) + min
  ).toString();
  return message;
};
export { comparePassword, hashPassword, generateVerificationCode };
