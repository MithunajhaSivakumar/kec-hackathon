const UserModel = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { transporter } = require('../config/emailConfig');
const InchargeModel = require('../models/Incharge');
const HallModel = require('../models/Hall');

module.exports.register = async(req, res) => {
    var {username, email, password, phone, role } = req.body;
    console.log(username +"-"+email+"-"+phone+"-"+password);
    const user = await UserModel.findOne({email: email})
    if(user){
        res.send({"status": "failed", "message": "Email already exists"});
    } else {
        if(username && email && password && phone){
            if(!role){
                role = "user";
            }
            try{
                const salt = await bcrypt.genSalt(10);
                const hashPassword = await bcrypt.hash(password, salt)
                const newUser = UserModel({
                    username: username,
                    email: email,
                    password: hashPassword,
                    role: role,
                    phone: phone
                })
                await newUser.save()
                const saved_user = await UserModel.findOne({ email: email});

                //Generate JWT Token
                console.log("success")
                const token = jwt.sign({ userID : saved_user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '1d'});
                res.status(201).send({"status": "success", "message": "Registration Success", "token": token});

            } catch(err) {
                console.log(err)
                res.status(201).send({ "status": "failed", "message": "Unable to Register" })
            }
            
        } else {
            res.status(201).send({ "status": "failed", "message": "All fields are required" })
        }
    }
}

module.exports.login = async(req, res) => {
    try{
        const {email, password} = req.body;
        console.log(email+" - "+password);

        if(email && password) {
            const user = await UserModel.findOne({email: email})
            if(user != null) {
                const isPwd = await bcrypt.compare(password, user.password)
                if((user.email === email) && isPwd){
                    //generate JWT Token
                    const token = jwt.sign({userID: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '1d'})
                    console.log("success")
                    res.send({ "status": "success", "message": "Login Success", "token": token,"role": user.role })
                } else {
                    res.send({ "status": "failed", "message": "Email or Password is not Valid" })
                }
            } else{
                res.send({ "status": "failed", "message": "You are not a Registered User" })
            }
        } else{
            res.send({ "status": "failed", "message": "All Fields are Required" })
        }
    } catch(err){
        console.log(err)
        res.send({ "status": "failed", "message": "Unable to Login" })
    }
}

module.exports.changePassword = async(req, res) => {
    const {password, confirm_password} = req.body;
    if(password && confirm_password) {
        if(password !== confirm_password) {
            res.send({ "status": "failed", "message": "Password and Confirm Password doesn't match" })
        } else{
            const salt = await bcrypt.genSalt(10)
            const newHashPassword = await bcrypt.hash(password, salt)
            await UserModel.findByIdAndUpdate(req.user._id, { $set: {password: newHashPassword}})
            res.send({"status": "success", "message": "Password changed successfully"})
        }
    } else{
        res.send({ "status": "failed", "message": "All Fields are Required" })
    }
}

module.exports.loggedUser = async(req, res) => {
    res.send({"user": req.user})
}

module.exports.sendUserPasswordResetMail = async(req, res) => {
    const {email} = req.body;
    if(email){
        const user = await UserModel.findOne({email: email})
        if(user){
            const secret = user._id + process.env.JWT_SECRET_KEY
            const token = jwt.sign({userID: user._id}, secret, {expiresIn: '15m'})
            const link = `http://localhost:3000/api/auth/reset/${user._id}/${token}`
            console.log(link)

            //send email
            
            let info = await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: user.email,
                subject: "KEC Hall Booking Web Password Reset Link",
                html:`<a href=${link}>Click Here</a> to reset your password`
            })

            res.send({"status":"success", "message":"Password Reset Email Sent. Please Check You Email!!!","info":info})
        } else{
            res.send({"status":"failed", "message":"Email doesn't exist"})
        }
    } else {
        res.send({"status":"failed", "message":"Email field required"})
    }
}

module.exports.userPasswordReset = async(req, res) => {
    const {password, confirm_password} = req.body;
    const {id, token} = req.params;
    const user = await UserModel.findById(id);
    console.log(user)
    console.log(user._id)
    const new_secret = user._id + process.env.JWT_SECRET_KEY;
    try{
        jwt.verify(token, new_secret)
        if(password && confirm_password){
            if(password !== confirm_password){
                res.send({"status":"failed", "message":"New Password and Confirm Password doesn't match"})
            } else {
                const salt = await bcrypt.genSalt(10)
                const newHashPassword = await bcrypt.hash(password, salt)
                await UserModel.findByIdAndUpdate(user._id, { $set: {password: newHashPassword}})
                res.send({"status": "success", "message": "Password changed successfully"})
            }
        }else{
            res.send({"status":"failed", "message":"All fields are required"})
        }
    } catch(err){
        console.log(err)
        res.send({"status":"failed", "message":"Invalid Token"})
    }
}

module.exports.assignIncharge = async(req, res) => {
    const {email, role} = req.body;
    try{
        if(req.user.role === 'admin'){
            if(email && role){
                const user = await UserModel.findOne({email: email})
                if(user){
                    if(role === 'incharge'){
                        const inchargeExist = await InchargeModel.findOne({email: email})
                        if(!inchargeExist){
                            const newUser = InchargeModel({
                                    username: user.username,
                                    email: email,
                                    password: user.password,
                                    phone: user.phone
                                })
                                await newUser.save()
                
                                await UserModel.findByIdAndUpdate(user._id, { $set: {role: role}})
                
                                res.send({ "status": "success", "message": "Assigned as Incharge" })
                        } else if(inchargeExist && user.role === 'user') {
                            await UserModel.findByIdAndUpdate(user._id, { $set: {role: role}})
                            res.send({ "status": "failed", "message": "Already an Incharge But role updated" })
                        } else{
                            res.send({ "status": "failed", "message": "Already an Incharge" })
                        }
                    } else {
                        const inchargeExist = await InchargeModel.findOne({email: email})
                        if(user.role === 'incharge' && inchargeExist){
                            await UserModel.findByIdAndUpdate(user._id, { $set: {role: role}})
                            await InchargeModel.findByIdAndDelete(inchargeExist._id)
                            res.send({ "status": "failed", "message": "Incharge unassigned" })
                        } else {
                            res.send({ "status": "failed", "message": "Not an Incharge already" })
                        }
                    }

                } else {
                    res.send({ "status": "failed", "message": "User not Registered" })
                }
            } else{
                res.send({ "status": "failed", "message": "Email and Role required" })
            }
        } else {
            res.send({ "status": "failed", "message": "Admin can only change role" })
        }
    } catch(err){
        res.send({ "status": "failed", "message": "Internal Error" })
    }
    
    // console.log(req.user.role);
    // res.send({"user": req.user})
}

module.exports.getAllUsers = async(req, res) => {
    try{
        if(req.user.role === 'admin'){
            UserModel.find().then((users) => {
              if (!users) {
                res.status(404).send({
                  status: "failed",
                  message: "No User",
                });
              }
              res.status(201).send({
                status: "success",
                message: "Users Found",
                user: users,
              });
            });  
        } else {

        }
    } catch(err) {
        next();
    }
}

module.exports.getAllUserRole = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      UserModel.find({role: 'user'}).then((users) => {
        if (!users) {
          res.status(404).send({
            status: "failed",
            message: "No User",
          });
        }
        res.status(201).send({
          status: "success",
          message: "Users Found",
          user: users,
        });
      });
    } else {
    }
  } catch (err) {
    next();
  }
};

module.exports.getAllInchargeRole = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      UserModel.find({ role: "incharge" }).then((users) => {
        if (!users) {
          res.status(404).send({
            status: "failed",
            message: "No Incharge",
          });
        }
        res.status(201).send({
          status: "success",
          message: "Incharges Found",
          user: users,
        });
      });
    } else {
    }
  } catch (err) {
    next();
  }
};

module.exports.getOneUser = async (req, res) => {
  try {
    
    if (req.user.role === "admin") {
      UserModel.findOne({ role: "user" }, {_id: req.params._id}).then((users) => {
        if (!users) {
          res.status(404).send({
            status: "failed",
            message: "User not found",
          });
        }
        res.status(201).send({
          status: "success",
          message: "User Found",
          user: users,
        });
      });
    } else {
    }
  } catch (err) {
    next();
  }
};


module.exports.getOneIncharge = async (req, res) => {
  try {
    if (req.user.role === "admin") {
      UserModel.findOne({ role: "incharge" }, { _id: req.params._id }).then(
        (users) => {
          if (!users) {
            res.status(404).send({
              status: "failed",
              message: "Incharge not found",
            });
          }
          res.status(201).send({
            status: "success",
            message: "Incharge Found",
            user: users,
          });
        }
      );
    } else {
    }
  } catch (err) {
    next();
  }
};

module.exports.userCount = async (req, res) => {
  UserModel.find({ role: "user" }).countDocuments((err, count) => {
    res.status(201).send({
      status: "success",
      message: "User Found",
      count: count,
    });
  })
}

module.exports.inchargeCount = async (req, res) => {
  UserModel.find({ role: "incharge" }).countDocuments((err, count) => {
    res.status(201).send({
      status: "success",
      message: "Incharge Found",
      count: count,
    });
  });
};
