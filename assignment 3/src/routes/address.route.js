const express = require("express");
const authMiddleware = require("../middlewares/authValidation");

const AddressModel = require("../model/addressModel");
const addressRouter = express.Router();

addressRouter.post("/createAddress", authMiddleware, async (req, res) => {
    try {

        const { type, street, city, state, country, pincode, longitude, latitude } = req.body;

        let addressData = {
            user: req.user._id,
            type,
            street,
            city,
            state,
            country,
            pincode,
            location: {
                type: "Point",
                coordinates: [longitude, latitude]
            }
        }

        await AddressModel.create(addressData);

        res.send("address successfully created")


    } catch (err) {
        res.status(400).send({ "message": err })
    }

});


addressRouter.get("/adressesNearMe", authMiddleware, async (req, res) => {

    try {

        const { longitude, latitude, radius } = req.query;

        let addressesdata = await AddressModel.find({
            location: {
                 $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance:radius
                }
            }
        });

        res.status(200).send({
            "addresses": addressesdata
        })
    } catch (err) {
        res.status(500).send(err)
    }

})




// get addressby id
// app.get("/getAddress/:id", async(req,res)=>{
//   try{

//     let addressData = await AddressModel.findById(req.params.id).populate("user");
//     res.send(addressData);
//   }catch(err){
//     res.send(err)
//   }
// })
// app.use("/", (req, res) => {

//   res.status(404).send("page not found");
// });


module.exports = addressRouter;