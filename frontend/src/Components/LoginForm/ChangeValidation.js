// ChangeValidation.js
const ChangeValidation = (values) => {
  let errors = {};
  const usernamePattern = /^[a-zA-Z0-9_-]{3,16}$/;
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  // Kiểm tra username
  if (values.usernameTxt === "") {
    errors.usernameTxt = "Username cannot be empty";
  } else if (!usernamePattern.test(values.usernameTxt)) {
    errors.usernameTxt = "Invalid username";
  }

  // Kiểm tra mật khẩu cũ
  if (values.passwordTxt === "") {
    errors.passwordTxt = "Password cannot be empty";
  } else if (!passwordPattern.test(values.passwordTxt)) {
    errors.passwordTxt = "Invalid password";
  }

  // Kiểm tra mật khẩu mới
  if (values.newpasswordTxt === "") {
    errors.newpasswordTxt = "New password cannot be empty";
  } else if (!passwordPattern.test(values.newpasswordTxt)) {
    errors.newpasswordTxt = "Invalid new password";
  } else if (values.newpasswordTxt === values.passwordTxt) {
    errors.newpasswordTxt =
      "New password cannot be the same as the old password";
  }

  // Kiểm tra xác nhận mật khẩu mới
  if (values.reenterpasswordTxt === "") {
    errors.reenterpasswordTxt = "Confirm new password cannot be empty";
  } else if (values.reenterpasswordTxt !== values.newpasswordTxt) {
    errors.reenterpasswordTxt =
      "New password and confirm password do not match";
  }

  if (Object.keys(errors).length > 0) {
    console.error("Errors found in Validation:", errors);
  }

  return errors;
};
export const isEmailValid = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};
export default ChangeValidation;
