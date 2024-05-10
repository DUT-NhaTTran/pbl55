function ChangeValidation(values) {
    let errors = {};
    const usernamePattern = /^[a-zA-Z0-9_-]{3,16}$/;
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    // Kiểm tra username
    if (values.usernameTxt === "") {
        errors.usernameTxt = "Tên người dùng không được trống";
    } else if (!usernamePattern.test(values.usernameTxt)) {
        errors.usernameTxt = "Tên người dùng không hợp lệ";
    }

    // Kiểm tra mật khẩu cũ
    if (values.passwordTxt === "") {
        errors.passwordTxt = "Mật khẩu không được để trống";
    } else if (!passwordPattern.test(values.passwordTxt)) {
        errors.passwordTxt = "Mật khẩu không hợp lệ";
    }

    // Kiểm tra mật khẩu mới
    if (values.newpasswordTxt === "") {
        errors.newpasswordTxt = "Mật khẩu mới không được để trống";
    } else if (!passwordPattern.test(values.newpasswordTxt)) {
        errors.newpasswordTxt = "Mật khẩu mới không hợp lệ";
    } else if (values.newpasswordTxt === values.passwordTxt) {
        errors.newpasswordTxt = "Mật khẩu mới không được trùng với mật khẩu cũ";
    }

    // Kiểm tra xác nhận mật khẩu mới
    if (values.reenterpasswordTxt === "") {
        errors.reenterpasswordTxt = "Xác nhận mật khẩu mới không được để trống";
    } else if (values.reenterpasswordTxt !== values.newpasswordTxt) {
        errors.reenterpasswordTxt = "Mật khẩu mới và xác nhận mật khẩu không trùng khớp";
    }
    if (Object.keys(errors).length > 0) {
        console.error("Errors found in Validation:", errors);
    }

    return errors;
}

export default ChangeValidation;
