const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({ username, password: hashedPassword });
    res.status(201).json({
      status: "success",
      data: {
        user: {
          user: newUser,
        },
      },
    });
  } catch (e) {
    res.status(400).json({
      status: "fail",
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({
        status: "fail",
        message: "user not found",
      });
    }

    const isCorrect = await bcrypt.compare(password, user.password)

    if (!isCorrect) {
        res.status(200).json({
            status: "fail",
            message: "incorrect username or password"
        })
    }

    res.status(201).json({
      status: "success",
      
    });
  } catch (e) {
    console.log(e)
    res.status(400).json({
      status: "fail",
    });
  }
};
