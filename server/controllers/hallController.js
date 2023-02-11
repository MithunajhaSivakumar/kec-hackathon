const UserModel = require("../models/User");
const InchargeModel = require("../models/Incharge");
const HallModel = require("../models/Hall");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const { transporter } = require("../config/emailConfig");

const generateUniqueCode = async(prefix) => {
    const latestHall = await HallModel.findOne().sort({ created_at: -1 });
    let code = `${prefix}001`;
    if (latestHall) {
      const latestCode = latestHall.code;
      const codeNumber = Number(latestCode.slice(prefix.length));
      code = `${prefix}${String(codeNumber + 1).padStart(3, "0")}`;
    }
    return code;
}

module.exports.addHall = async (req, res) => {
    try{
        const code = await generateUniqueCode('kechall');
        try{
          InchargeModel.findOne({email: req.body.incharge_email}).then((incharge) => {
              if(!incharge){
                  res
                    .status(404)
                    .send({
                      status: "failed",
                      message: "Incharge does not exist",
                    });
              }

              try{

                HallModel.findOne({incharge: incharge._id}).then((existingIncharge) => {
                    if (existingIncharge) {
                      res.status(404).send({
                        status: "failed",
                        message: "Incharge already assigned to a hall",
                      });
                    }
                    try{

                      InchargeModel.findOne({email: req.body.assistant_email}).then((assist) => {
                          if(!assist){
                              res.status(404).send({
                                status: "failed",
                                message: "Given assistant is not an Incharge",
                              });
                          }
                          const newHall = new HallModel({
                              ...req.body,
                              code,
                              incharge: incharge._id,
                              assistant: assist._id,
                          });
      
                          newHall.save().then((createdHall) => {
                            incharge.halls = createdHall._id;
                            incharge.save();
      
                            assist.halls = createdHall._id;
                            assist.save();
      
                            return res
                              .status(201)
                              .send({
                                status: "success",
                                message: "Hall Successfully Registered",
                              });
                          });
                          
                      })
                    } catch(err){
                      next()
                    }
    
                })
              } catch(err){
                next()
              }
  
  
          })
        } catch(err){
          next()
        }

    } catch(err){
       res.status(500).send({ status:"failed", message: err.message });
    }
  
    // res.send({ status: "failed", message: "Email already exists" });
      
    // res.status(201).send({ status: "failed", message: "All fields are required" });
};


module.exports.updateHall = async (req, res) => {
    const { code } = req.params;
    try{
        HallModel.findOneAndUpdate({code : req.params.code}, req.body, {new: true})
        .then((updatedHall) => {
            if(!updatedHall){
                res
                  .status(404)
                  .send({
                    status: "failed",
                    message: "Hall not found",
                  });
            }
            res
              .status(201)
              .send({ 
                status: "success", 
                message: "Hall Updated Successfully" 
            });
        })
    } catch(err){
        next();
    }
}

module.exports.deleteHall = async (req, res) => {
  const { code } = req.params;
  try {
    HallModel.findOneAndDelete({ code: req.params.code }).then((deleteHall) => {
      if (!deleteHall) {
        res.status(404).send({
          status: "failed",
          message: "Hall not found",
        });
      }
      res.status(201).send({
        status: "success",
        message: "Hall Deleted Successfully",
      });
    });
  } catch (err) {
    next();
  }
};

module.exports.getOneHall = async (req, res) => {
    try{
        HallModel.findOne({code: req.params.code }).then((hall) => {
            if(!hall){
                res.status(404).send({
                  status: "failed",
                  message: "Hall not found",
                });
            }
            res.status(201).send({
              status: "success",
              message: "Hall Found",
              hall : hall,
            });
        })
    } catch(err){
        next();
    }
}

module.exports.getHalls = async (req, res) => {
  try {
    HallModel.find().then((hall) => {
      if (!hall) {
        res.status(404).send({
          status: "failed",
          message: "No Halls",
        });
      }
      res.send({
        status: "success",
        message: "Hall Found",
        hall: hall,
      });
    });
  } catch (err) {
    next();
  }
};

// module.exports.filter = async (req, res) => {
//   const { selectedCategory, selectedCapacity, searchInput } = req.body;

//   HallModel.find({})
//     .then((halls) => {
//       if (!halls || !halls.length) {
//         return res.status(404).send({
//           status: "failed",
//           message: "No Halls",
//         });
//       }
// //       const filteredHalls = halls.filter(hall => {
// //         let isValid = true;

// //         if (selectedCategory && hall.category !== selectedCategory) {
// //           isValid = false;
// //         }

// //         if (searchInput && !hall.name.toLowerCase().includes(searchInput.toLowerCase())) {
// //           isValid = false;
// //         }

// //         if (hall.capacity < selectedCapacity[0] || hall.capacity > selectedCapacity[1]) {
// //           isValid = false;
// //         }

// //         return isValid;
// //       });

// const filteredHalls = [];

// halls.filter((hall) => {
//   let isValid = true;

//   if (selectedCategory && hall.category !== selectedCategory) {
//     isValid = false;
//   }

//   if (
//     searchInput &&
//     !hall.name.toLowerCase().includes(searchInput.toLowerCase())
//   ) {
//     isValid = false;
//   }

//   if (
//     hall.capacity < selectedCapacity[0] ||
//     hall.capacity > selectedCapacity[1]
//   ) {
//     isValid = false;
//   }

//   if (isValid) {
//     filteredHalls.push(hall);
//     console.log(hall)
//   }
// });


// // console.log(filteredHalls);
//       // console.log(halls)
//       // let dataArray = halls;
//       // // console.log(dataArray)
//       // if (selectedCategory) {
//       //   dataArray = dataArray.filter(
//       //     (item) => item.category === selectedCategory
//       //   );
//       // }

//       // if (searchInput) {
//       //   dataArray = dataArray.filter((item) =>
//       //     item.name.toLowerCase().includes(searchInput.toLowerCase().trim())
//       //   );
//       // }

//       // const minCap = selectedCapacity[0];
//       // const maxCap = selectedCapacity[1];

//       // dataArray = dataArray.filter(
//       //   (item) => item.capacity >= minCap && item.capacity <= maxCap
//       // );
//       res.json({ filteredHalls });
//       // res.json({ dataArray });
//     })
//     .catch((error) => {
//       console.error(error);
//       res.status(500).send({
//         status: "error",
//         message: "An error occurred",
//       });
//     });
// };


// module.exports.filter = async (req, res) => {
//   const { selectedCategory, selectedCapacity, searchInput } = req.body;

//   HallModel.find()
//     .then((hall) => {
//       if (!hall) {
//         res.status(404).send({
//           status: "failed",
//           message: "No Halls",
//         });
//       }
//       console.log(hall);

//       let dataArray = Array.from(hall);
//       if (!dataArray.length) {
//         res.status(404).send({
//           status: "failed",
//           message: "No data to filter",
//         });
//       }

//       if (selectedCategory) {
//         dataArray = dataArray.filter(
//           (item) => item.category === selectedCategory
//         );
//       }

//       if (searchInput) {
//         dataArray = dataArray.filter(
//           (item) =>
//             item.name
//               .toLowerCase()
//               .search(searchInput.toLowerCase().trim()) !== -1
//         );
//       }

//       const minCap = selectedCapacity[0];
//       const maxCap = selectedCapacity[1];

//       dataArray = dataArray.filter(
//         (item) => item.capacity >= minCap && item.capacity <= maxCap
//       );

//       res.json({ dataArray });
//     })
//     .catch((error) => {
//       console.error(error);
//       res.status(500).send({
//         status: "error",
//         message: "An error occurred",
//       });
//     });
// };


module.exports.hallCount = async (req, res) => {
  HallModel.find().countDocuments((err, count) => {
    res.status(201).send({
      status: "success",
      message: "Hall Found",
      count: count,
    });
  });
};

module.exports.hallCapacity = async(req, res) => {
  HallModel.find({},{ name: 1, capacity: 1 }, (err, halls) => {
  if (!hall) {
        res.status(404).send({
          status: "failed",
          message: "No Halls",
        });
      }
      res.send({
        status: "success",
        message: "Hall Found",
        hall: hall,
      });
  });
}