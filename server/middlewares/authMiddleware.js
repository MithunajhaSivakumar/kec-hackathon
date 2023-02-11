const jwt = require('jsonwebtoken')
const UserModel = require('../models/User')

module.exports.checkUserAuth = async(req,res, next) => {
    let token 
    const { authorization } = req.headers;
    if(authorization && authorization.startsWith('Bearer')){
        try{
            token = authorization.split(' ')[1]

            //verify token
            const {userID} = jwt.verify(token, process.env.JWT_SECRET_KEY)
            // console.log(userID)

            //get user from token
            req.user = await UserModel.findById(userID).select('-password')
            // console.log(req.user)
            next()
        } catch(err){
            console.log(err)
            res.status(401).send({"status": "failed", "message":"Unauthorized User"})
        }
    }
    if(!token){
        res.status(401).send({"status": "failed", "message": "Unauthorized User, No Token"})
    }
}

module.exports.checkIfAdmin = async(req, res, next) => {
    let token
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith("Bearer")) {
      try {
        token = authorization.split(" ")[1];

        //verify token
        const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log(userID)

        //get user from token
        req.user = await UserModel.findById(userID).select("-password");

        if(req.user.role === 'admin'){
            next();
        }
        else {
            res
              .status(401)
              .send({ status: "failed", message: "Unauthorized User" });
        }
        // console.log(req.user)
        // next();
      } catch (err) {
        console.log(err);
        res
          .status(401)
          .send({ status: "failed", message: "Unauthorized User" });
      }
    }
    if (!token) {
      res
        .status(401)
        .send({ status: "failed", message: "Unauthorized User, No Token" });
    }

}

module.exports.checkIfIncharge = async(req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith("Bearer")) {
    try {
      token = authorization.split(" ")[1];

      //verify token
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY);
      // console.log(userID)

      //get user from token
      req.user = await UserModel.findById(userID).select("-password");

      if (req.user.role === "incharge") {
        next();
      } else {
        res
          .status(401)
          .send({ status: "failed", message: "Unauthorized User, Not an Incharge" });
      }
      // console.log(req.user)
      // next();
    } catch (err) {
      console.log(err);
      res.status(401).send({ status: "failed", message: "Unauthorized User, Not registered" });
    }
  }
  if (!token) {
    res
      .status(401)
      .send({ status: "failed", message: "Unauthorized User, No Token" });
  }
}