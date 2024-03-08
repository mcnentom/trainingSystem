
const loginSchema = {
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
                min: 7
            },
            errorMessage: "username must exceed 4 characters"
        },
        matches: {
            options: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{8,}$/, // Regular expression to include symbols, numbers, and strings
            errorMessage: "Password must contain at least one letter, one number and one symbol"
        }
    }
}

export default loginSchema;