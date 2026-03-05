const {Schema,model} = require("mongoose")
const user = require("../models/user")
const billSchema = new Schema({
    purpose:{
        type: String,
        required: true,
    },
    amount:{
        type: Number,
        required: true,
    },
    date:{
        type:Date,
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: "user",
    }
},{timestamps: true})


const bill = model("bill", billSchema)

module.exports=bill;