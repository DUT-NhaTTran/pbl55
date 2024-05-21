function Validation(values) {
    let error = {};
    const username_pattern = /^[a-zA-Z0-9_-]{3,16}$/;
    const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    
    if (values.usernameTxt === "") {
        error.usernameTxt = "Username cannot be empty";

    } else if (!username_pattern.test(values.usernameTxt)) {
        error.usernameTxt = "Invalid username";

    } else {
        error.usernameTxt = "";
    }

    if (values.passwordTxt === "") {
        error.passwordTxt = "Password cannot be empty";

    } else if (!password_pattern.test(values.passwordTxt)) {
        error.passwordTxt = "Invalid password";

    } else {
        error.passwordTxt = "";
    }
    
    return error;
}

export default Validation;