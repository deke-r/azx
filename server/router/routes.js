const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const app = express();
const cookieParser=require('cookie-parser')
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const router = express.Router();

const User = require("../Model/signupSchema");

router.post("/signup", async (req, res) => {
  const { email, pass } = req.body;

  if (!email || !pass) {
    return res.status(422).json({ error: "Please fill all fields" });
  }

  try {
    const userExist = await User.findOne({ email: email });

    if (userExist) {
      return res.status(422).json({ error: "Email already exists" });
    }

    const hashp = await bcrypt.hash(pass, 10);

    const user = new User({ email, pass: hashp });

    const userRegister = await user.save();

    const token = jwt.sign({ id: user._id }, "dekeresportsplayer", {
      expiresIn: "2h",
    });

    user.token=token
    user.pass=undefined;

    if (userRegister) {
      return res.status(201).json({ message: "User registered successfully" });
    }
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, pass } = req.body;
    if (!email || !pass) {
      return res.status(400).json({ error: "Please fill in all the fields" });
    }

    const userLogin = await User.findOne({ email: email });

    if (userLogin) {
      const isPasswordValid = await bcrypt.compare(pass, userLogin.pass);
      const token = jwt.sign({ id: userLogin._id }, "dekeresportsplayer", {
        expiresIn: "2h",
      });
      userLogin.token=token;
      userLogin.pass=undefined; 
      
      
      //cookie section
      const options={
        expires:new Date(Date.now()+ 3*24*60*60*1000),
        httpOnly:true
      };

      res.status(201).cookie('token',token,options).json({sucess:true,token,})

      if (isPasswordValid) {
        console.log("User found in the database:", userLogin);

        const userRole = userLogin.role;
        console.log("User Role from Database:", userRole);

        if (userRole && userRole === "admin") {
          return res.json({
            role: "admin",
            message: "User signed in successfully",
          });
        } else {
          return res.json({
            role: "user",
            message: "User signed in successfully",
          });
        }
      } else {
        return res.status(401).json({ error: "Invalid Password" });
      }
    } else {
      console.log("User not found in the database");
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
