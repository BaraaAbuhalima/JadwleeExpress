export const checkNewUserValidationSchema = {
  displayName: {
    in: "body",
    isString: {
      errorMessage: "Display Name should be a string",
    },
    isLength: {
      options: { min: 4, max: 20 },
      errorMessage: "Display Name length should be between 4-20 characters",
    },
    matches: {
      options:
        /^\s*[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+\s*$/,
      errorMessage:
        "Display Name can consist of lowercase, capitals, alphanumeric characters, underscore ,hyphens, spaces, Cannot be two underscores, two hyphens or two spaces in a row,\n Cannot have a underscore at the start or end",
    },
  },
  username: {
    in: "body",
    isString: {
      errorMessage: "Username should be a string",
    },
    isLength: {
      options: { min: 4, max: 20 },
      errorMessage: "Username length should be between 4-20 characters",
    },
    matches: {
      options: /^[a-zA-Z0-9_]+$/,
      errorMessage:
        "Username must only contain lowercase letters, uppercase letters, numbers, and underscores.",
    },
  },
  email: {
    in: "body",
    isString: {
      errorMessage: "Email should be a string",
    },
    isEmail: {
      errorMessage: "It's not a valid email format",
    },
  },
  password: {
    in: "body",
    matches: {
      options: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&#.+-])/,
      errorMessage:
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
    },
    notEmpty: {
      errorMessage: "Password should not be empty",
    },
    isString: {
      errorMessage: "Password should be a string",
    },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
  },
  confirmedPassword: {
    in: "body",
    custom: {
      options: (
        value,
        {
          req: {
            body: { password },
          },
        }
      ) => {
        return value === password;
      },
      errorMessage: "Password do not match",
    },
  },
};
export const loginWithoutPasswordSchema = {
  email: {
    isEmail: {
      errorMessage: "This is not a valid email",
    },
  },
};
export const verificationCodeSchema = {
  verificationCode: {
    isString: {
      errorMessage: "This is not a string",
    },
  },
};
export const loginSchema = {
  email: {
    notEmpty: {
      errorMessage: "Email should not be empty",
    },
    isEmail: {
      errorMessage: "Not valid email",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Password should not be empty",
    },
  },
};
export const updateUserPasswordSchema = {
  password: {
    in: "body",
    matches: {
      options: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&#.+-])/,
      errorMessage:
        "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.",
    },
    notEmpty: {
      errorMessage: "Password should not be empty",
    },
    isString: {
      errorMessage: "Password should be a string",
    },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
  },
  confirmedPassword: {
    in: "body",
    custom: {
      options: (
        value,
        {
          req: {
            body: { password },
          },
        }
      ) => {
        return value === password;
      },
      errorMessage: "Password do not match",
    },
  },
};
export const updateDisplayNameSchema = {
  displayName: {
    in: "body",
    isString: {
      errorMessage: "Display Name should be a string",
    },
    isLength: {
      options: { min: 4, max: 20 },
      errorMessage: "Display Name length should be between 4-20 characters",
    },
    matches: {
      options:
        /^\s*[a-zA-Z0-9]+([a-zA-Z0-9](_|-| )[a-zA-Z0-9])*[a-zA-Z0-9]+\s*$/,
      errorMessage:
        "Display Name can consist of lowercase, capitals, alphanumeric characters, underscore ,hyphens, spaces, Cannot be two underscores, two hyphens or two spaces in a row,\n Cannot have a underscore at the start or end",
    },
  },
};
export const zajelPasswordSchema = {
  zajelPassword: {
    in: "body",
    isString: {
      errorMessage: "zajelPassword should be a string",
    },
  },
};
export const zajelIdSchema = {
  zajelID: {
    in: "body",
    isString: {
      errorMessage: "Zajel id should be a string",
    },
  },
};
