const mailTransporter = require('../config/emailConfig');
const pdf = require("html-pdf");
const UserModel = require("../models/User");
const InchargeModel = require("../models/Incharge");
const HallModel = require("../models/Hall");
const BookingModel = require("../models/Booking")


// const generateUniqueCode = async (prefix) => {
//   const latestBook = await BookingModel.findOne().sort({ created_at: -1 });
//   let code = `${prefix}000001`;
//   if (latestBook) {
//     const latestCode = latestBook.code;
//     const codeNumber = Number(latestCode.slice(prefix.length));
//     code = `${prefix}${String(codeNumber + 1).padStart(3, "0")}`;
//   }
//   return code;
// };

// module.exports.bookOneHall = async (req, res) => {
//   const { start_time, end_time, email } = req.body;
//   const hall = await HallModel.findOne({ code: req.params.code });
//   console.log(hall);
//   const user = await UserModel.findOne({ email });
//   console.log(req.body);
//   console.log(req.params.code);
//   if (!hall) {
//     return res.status(404).send({
//       status: "failed",
//       message: "Hall not found",
//     });
//   }

//   if (!user) {
//     return res.status(404).send({
//       status: "failed",
//       message: "User not found",
//     });
//   }

//   for (const bookingId of hall.bookings) {
//     const bookingInfo = await BookingModel.findById(bookingId);
//     console.log(bookingInfo);
//     // console.log(typeof bookingInfo.start_time);
//     const dbStartTime = bookingInfo.start_time.getTime();
//     const dbEndTime = bookingInfo.end_time.getTime();
//     if (
//       (start_time >= dbStartTime&&
//         start_time < dbEndTime) ||
//       (end_time > dbStartTime && end_time <= dbEndTime)
//     ) {
//       // var details = {
//       //   from: "mithunajhas.20cse@kongu.edu",
//       //   to: req.body.email,
//       //   subject: "hall booking",
//       //   text: "Hall Already Booked",
//       // };
//       //   mailTransporter.sendMail(details, function (err, info) {
//       //     if (err) {
//       //       console.log("it has an error", err);
//       //     } else {
//       //       console.log("email has sent successfully" + info.response);
//       //     }
//       //   });
//       return res.status(400).send({
//         status: "failed",
//         message: "Hall is already booked in the requested time",
//       });
//     }
//   }
  
// //   const conflicts = hall.bookings.find((bookingId) => {
// //     const bookingInfo = BookingModel.findById(bookingId);
// //     console.log(bookingInfo.start_time + "*********" + bookingInfo.end_time);
// //     // console.log(bookingInfo)
// //     return (
// //     (start_time >= bookingInfo.start_time && start_time < bookingInfo.end_time) ||
// //     (end_time > bookingInfo.start_time && end_time <= bookingInfo.end_time)
// //   );
// // });


//   // if (conflicts) {
//   //   return res.status(400).send({
//   //     status: "failed",
//   //     message: "Hall is already booked in the requested time",
//   //   });
//   // }

//   const booking = new BookingModel({
//     ...req.body,
//     start_time,
//     end_time,
//     hall_id: hall._id,
//     user_id: user._id,
//   });

//   console.log(booking)

//   await booking.save();
//   hall.bookings.push(booking._id);
//   await hall.save();
//   user.bookings.push(booking._id);
//   await user.save();

//   // <div>
//   //           <ul className="flex justify-end">
//   //             <li>
//   //               <button id="btnprint"onClick={handlePrint} className="btn btn-primary btn-print mr-4">
//   //               Print
//   //               </button>
//   //             </li>
//   //           </ul>
//   //          </div>

//   const html = `
//     <html>
//     <body>
//      <main className="m-5 p-5 xl:max-w-4xl xl:mx-auto bg-white rounded shadow">
//         <header className="flex flex-col items-center justify-center mb-5 xl:flex-row xl:justify-between">
//            <div>
//             <h1 className="font-bold uppercase tracking-wide text-4xl mb-3">Kongu Engineering College</h1>
//             <h3 className="font-bold flex flex-col items-center text-2xl justify-end">Perundurai,Erode</h3>
//            </div>

//            </header>
           
         
//          <footer>
//           <ul clasName="flex flex-wrap items-center justify-center">
//             <li><span>User-Name:</span>${user.name}</li>
//             <li><span>User-Email:</span>${email}</li>
//             <br/>
//             <li><span>Staff Coordinator Name:</span>${req.body.staff}</li>
//             <li><span>Staff Coordinator Email:</span>${req.body.staff_email}</li>
//             <br/>
//             <li><span>Hall Name:</span>${hall.name}</li>
//             <br/>
//             <li><span>Event Name:</span>${req.body.event_name}</li>
//             <li><span>Event Conducted by:</span>${req.body.conductBy}</li>
//             <br/>
//             <li><span>Start time:</span>${req.body.start_time}</li>
//             <li><span>End time:</span>${req.body.end_time}</li>
//           </ul>
//          </footer>
//       </main>
    
//     </body>
//     </html>
//   `;

//   // pdf.create(html).toBuffer((err, buffer) => {
//   //   if (err) return console.log(err);
//     // var details = {
//     //   from: "mithunajhas.20cse@kongu.edu",
//     //   to: "kamalgopika54@gmail.com",
//     //   subject: "hall booking",
//     //   text: "your hall is booked",
//     //   attachments: [
//     //         {
//     //           // binary buffer as an attachment
//     //           filename: "report.pdf",
//     //           content: buffer,
//     //         },
//     //       ],
//     // };

//   //   mailTransporter.sendMail(details, function (err, info) {
//   //     if (err) {
//   //       console.log("it has an error", err);
//   //     } else {
//   //       console.log("email has sent successfully" + info.response);
//   //     }
//   //   });

//   // })
  

//   res.status(200).send({
//     status: "success",
//     message: "Hall booked successfully",
//   });
// };

module.exports.bookOneHall = async(req, res) => {
  const { start_time, end_time, email } = req.body;
  const hall = await HallModel.findOne({ code: req.params.code });
  console.log(hall);
  const user = await UserModel.findOne({ email });
  console.log(req.body);
  console.log(req.params.code);
  if (!hall) {
    return res.status(404).send({
      status: "failed",
      message: "Hall not found",
    });
  }

  if (!user) {
    return res.status(404).send({
      status: "failed",
      message: "User not found",
    });
  }

  //  for (const bookingId of hall.bookings) {
  //   const bookingInfo = await BookingModel.findById(bookingId);
  //   console.log(bookingInfo);
  //   // console.log(typeof bookingInfo.start_time);
  //   const dbStartTime = bookingInfo.start_time.getTime();
  //   const dbEndTime = bookingInfo.end_time.getTime();
  //   if (
  //     (start_time >= dbStartTime&&
  //       start_time < dbEndTime) ||
  //     (end_time > dbStartTime && end_time <= dbEndTime)
  //   ) {
  //     return res.status(400).send({
  //       status: "failed",
  //       message: "Hall is already booked in the requested time",
  //     });
  //   }
  // }

    const booking = new BookingModel({
    ...req.body,
    start_time,
    end_time,
    hall_id: hall._id,
    user_id: user._id,
  });

  console.log(booking)

  await booking.save();
  hall.bookings.push(booking._id);
  await hall.save();
  user.bookings.push(booking._id);
  await user.save();

  res.status(200).send({
    status: "success",
    message: "Hall booked successfully",
  });
}


module.exports.bookingCount = async(req, res) => {
  BookingModel.find().countDocuments((err, count) => {
    res.status(201).send({
      status: "success",
      message: "Bookings Found",
      count: count,
    });
  });
}

module.exports.allBookings = async (req, res) => {
  BookingModel.find().then((bookings) => {
    if (!bookings) {
      res.status(404).send({
        status: "failed",
        message: "No Bookings",
      });
    }

    const promises = bookings.map(async (booking) => {
      const user = await UserModel.findById(booking.user_id);
      const hall = await HallModel.findById(booking.hall_id);

      return {
        booking,
        user: user ? user.username : "",
        hall: hall ? hall.name : "",
      };
    });

    Promise.all(promises)
      .then((results) => {
        res.status(201).send({
          status: "success",
          message: "Bookings Found",
          data: results,
        });
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send({
          status: "error",
          message: "An error occurred",
        });
      });
  });
}
