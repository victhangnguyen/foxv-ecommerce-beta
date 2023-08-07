//! imp Models
import User from "../models/User.js";
//! imp Utils
import sendEmail from "../utils/sendEmail.js";
import HttpError from "../utils/HttpError.js";

function generatePassword(length = 12) {
  let password = "";
  for (let i = 0; i < length; i++) {
    let randNumber = Math.floor(Math.random() * 62);
    let code =
      randNumber < 10
        ? randNumber + 48
        : randNumber < 36
        ? randNumber + 55
        : randNumber + 61;
    password += String.fromCharCode(code);
  }
  return password;
}

//! resetPassword and sendEmail
async function resetPasswordAndSendEmail(userId, session) {
  try {
    const user = await User.findById(userId).session(session);

    if (!user) {
      return res
        .status(403)
        .json({ success: false, message: "User does not exist" });
    }

    const newPassword = await user.resetPassword(session);

    const htmlTemplate = `
    <div>
      <p>Bạn đã được khôi phục mật khẩu</p>
      <p>Mật khẩu hiện tại của bạn là: ${newPassword}</p>
    </div>
    `;

    // email, subject, text, template
    const info = await sendEmail(
      user.email,
      "Khôi phục mật khẩu",
      "Khôi phục mật khẩu",
      htmlTemplate
    );

    return info;
  } catch (error) {
    throw error;
  }
}

async function deleteUser(userId, session) {
  const user = await User.findById(userId).populate("roles").session(session);

  if (!user) {
    throw new Error("User does not exist!"); //! Forbidden
  }

  const roles = user.roles.map((role) => role.name);

  const isAdmin = roles.includes("admin");

  if (isAdmin) {
    throw Error("You are not authorized to delete Admin roles."); //! Forbidden
  }
  const deletedUser = await user.remove({ session });

  return deletedUser;
}

export default {
  generatePassword,
  resetPasswordAndSendEmail,
  deleteUser,
};
