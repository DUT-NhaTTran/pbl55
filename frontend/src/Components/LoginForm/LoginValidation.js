function Validation(values) {
    let error = {};
    const username_pattern = /^[a-zA-Z0-9_-]{3,16}$/;
    const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    
    if (values.usernameTxt === "") {
        error.usernameTxt = "Tên người dùng không được trống";
    } else if (!username_pattern.test(values.usernameTxt)) {
        error.usernameTxt = "Tên người dùng không hợp lệ";
    } else {
        error.usernameTxt = "";
    }

    if (values.passwordTxt === "") {
        error.passwordTxt = "Mật khẩu không được để trống";
    } else if (!password_pattern.test(values.passwordTxt)) {
        error.passwordTxt = "Mật khẩu không hợp lệ";
    } else {
        error.passwordTxt = "";
    }
    
    return error;
}

export default Validation;