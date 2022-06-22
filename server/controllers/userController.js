const User = require('../models/userModel');
const mongoose = require('mongoose');

// Get current user details
getMe = (req, res) => {
  const { user } = req;
  res.status(200).json({ user });
};

// Log out the user
logout = async (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  const { _id } = req.user;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ error: 'No user found' });
  }

  try {
    const user = await User
      .findById(_id);

    const tokenIndex = user.refreshToken.findIndex(
      item => item.refreshToken === refreshToken,
    );

    if (tokenIndex !== -1) {
      user.refreshToken.id(user.refreshToken[tokenIndex]._id).remove();
    }

    user.save((error) => {
      if (error) {
        return res.status(500).send(error);
      }
      res.clearCookie('refreshToken', COOKIE_OPTIONS);
      res.status(200).json({ success: true });
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMe,
  logout,
};
