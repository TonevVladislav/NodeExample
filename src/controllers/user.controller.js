const { StatusCodes } = require("http-status-codes");
const {
  getUserById,
  updateUserInfo,
  updatePassword,
} = require("../services/user.services.js");

const getUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: "Access forbidden: You can only access your own data",
    });
  }
  const user = await getUserById(req.params.id).catch((err) => {
    logger.info(err.toString());
    res.status(StatusCodes.BAD_REQUEST).json(err.toString());
  });
  res.json(user);
};

const updateUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: "Access forbidden: You can only access your own data",
    });
  }
  const user = await updateUserInfo(req.body.username, req.body.email).catch(
    (err) => {
      logger.info(err.toString());
      res.status(StatusCodes.BAD_REQUEST).json(err.toString());
    }
  );
  res.json(user);
};

const recoverPassword = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(StatusCodes.FORBIDDEN).json({
      message: "Access forbidden: You can only access your own data",
    });
  }
  const user = await updatePassword(
    req.body.currentPassword,
    req.body.newPassword,
    req.params.id
  ).catch((err) => {
    logger.info(err.toString());
    res.status(StatusCodes.BAD_REQUEST).json(err.toString());
  });
  res.sendStatus(StatusCodes.NO_CONTENT);
};

module.exports = { getUser, updateUser, recoverPassword };
