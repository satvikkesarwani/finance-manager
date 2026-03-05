const {Schema,model} = require("mongoose")
const {createHmac} = require("crypto");


const userSchema = new Schema({
    fullname:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    salt:{
        type:String,
    },
    password:{
        type: String,
        required: true,
    },
},{timestamps: true})

userSchema.pre("save", async function(){
    const user = this;
    if(!user.isModified("password")) return;

    const salt = "PhilSaltFromRCB"
    const hashPassword = createHmac("sha256", salt).update(user.password).digest("hex")
    user.salt = salt;
    user.password = hashPassword
})

async function MatchPassword(email, password){
    const User = await user.findOne({email: email})
    const salt = User.salt
    const hashPass = createHmac("sha256", salt).update(password).digest("hex")
    return User.password==hashPass
}

const user = model("user", userSchema)

module.exports={
    user,
    MatchPassword,
}