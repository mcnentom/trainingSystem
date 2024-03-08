// import loginSchema from "./login-schema.js";

// Register Schema -> username, password, email
const registerSchema = {
    username: {
        notEmpty: {
            errorMessage: "username cannot be empty"
        },
        isString: {
            errorMessage: "username must be a string"
        },
        isLength: {
            options: {
                min: 4
            },
            errorMessage: "username must exceed 4 characters"
        }
    },
    password: {
        notEmpty: {
            errorMessage: "username cannot be empty"
        },
        isString: {
            errorMessage: "username must be a string"
        },
        isLength: {
            options: {
                min: 4
            },
            errorMessage: "username must exceed 4 characters"
        },
        matches: {
            options: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{8,}$/, // Regular expression to include symbols, numbers, and strings
            errorMessage: "Password must contain at least one letter, one number and one symbol"
        }
    },
    email: {
        notEmpty: {
            errorMessage: "email cannot be empty"
        },
        isString: {
            errorMessage: "email must be a string"
        },
        isEmail: {
            errorMessage: "email is not valid"
        }
    }
}

export default registerSchema;