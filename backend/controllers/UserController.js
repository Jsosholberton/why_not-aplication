import User from "../models/User.js";
import genId from "../helpers/generateId.js";
import genJWT from "../helpers/generateJWT.js";
import { emailReg, emailPwd } from "../helpers/emails.js";

/**
 * Controller to register a new user.
 * @param {Object} req - Purpose of express request.
 * @param {Object} res - Express response object.
 * @returns
 */
const register = async (req, res) => {
  const { email } = req.body;
  const existUser = await User.findOne({ email });

  if (existUser) {
    const error = new Error("Email actually is register");
    return res.status(400).json({ msg: error.message });
  }

  try {
    const user = new User(req.body);
    user.token = genId();
    const userSave = await user.save();

    emailReg({
      email: user.email,
      name: user.name,
      token: user.token,
    });

    res.json({
      msg: "User created correctly, check your email to confirm the account",
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * Controller to authenticate a user.
 */
const authenticate = async (req, res) => {
  const { email, password } = req.body;

  const instUser = await User.findOne({ email });

  if (!instUser) {
    const error = new Error("User not exist");
    return res.status(404).json({ msg: error.message });
  }
  if (!instUser.confirm) {
    const error = new Error("Your account is not confirmed");
    return res.status(404).json({ msg: error.message });
  }
  if (await instUser.checkPassword(password)) {
    res.json({
      _id: instUser._id,
      name: instUser.name,
      email: instUser.email,
      role: instUser.role,
      token: genJWT(instUser._id),
    });
  } else {
    const error = new Error("The password is incorrect");
    return res.status(403).json({ msg: error.message });
  }
};

/**
 * Controller to confirm a user's account.
 */
const confirmAccount = async (req, res) => {
  const { token } = req.params;
  const userConfirm = await User.findOne({ token });

  if (!userConfirm) {
    const error = new Error("Invalid Token");
    return res.status(403).json({ msg: error.message });
  }
  try {
    userConfirm.confirm = true;
    userConfirm.token = "";
    await userConfirm.save();
    return res.json({ msg: "User confirm correctly" });
  } catch (err) {
    console.log(err);
  }
};

/**
 * Controller to restore a user's password.
 */
const lostPwd = async (req, res) => {
  const { email } = req.body;
  const instUser = await User.findOne({ email });

  if (!instUser) {
    const error = new Error("User not exist");
    return res.status(404).json({ msg: error.message });
  }

  try {
    instUser.token = genId();
    await instUser.save();
    res.json({ msg: "We have sent an email with instructions" });

    emailPwd({
      email: instUser.email,
      name: instUser.name,
      token: instUser.token,
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * Controller to change a user's password.
 */
const newPwd = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });

  if (user) {
    user.password = password;
    user.token = "";
    try {
      await user.save();
      res.json({ msg: "Password has been changed successfully" });
    } catch (err) {
      console.log(err);
    }
  } else {
    const error = new Error("Invalid token");
    return res.status(404).json({ msg: error.message });
  }
};

/**
 * Controller to check if a token is valid.
 */
const checkToken = async (req, res) => {
  const { token } = req.params;
  const validToken = await User.findOne({ token });
  if (validToken) {
    res.json({ msg: "Token is valid and the user exist" });
  } else {
    const error = new Error("Invalid token");
    return res.status(404).json({ msg: error.message });
  }
};

/**
 * controller to get user profile
 * @param {*} req - express request
 * @param {*} res - express response
 */
const profile = async (req, res) => {
  const { user } = req;
  res.json(user);
};

const allUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
}


export {
  register,
  authenticate,
  confirmAccount,
  lostPwd,
  newPwd,
  checkToken,
  profile,
  allUsers
};
