// require('dotenv').config()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const employeeSchema =new mongoose.Schema({
    firstname:{type:String,required:true},
    lastname:{type:String,required:true},
    email:{type:String,required:true , unique:true},
    gender:{type:String,required:true },
    phone:{type:Number, required:true ,unique:true },
    age:{type:Number, required:true },
    password:{type:String,required:true},
    confirmpassword : {type:String, required:true},
    tokens:[{
        token:{type:String,required:true}
    }]
})

employeeSchema.methods.generateAuthToken = async function(){
    const token = jwt.sign({adminId:this._id},process.env.SECRET_KEY)
    this.tokens = this.tokens.concat({token:token})
    // console.log(token)
    return token
    this.save()
}

employeeSchema.pre("save",async function(next){

    if(this.isModified('password'))
    {
        // console.log(`the current password is ${this.password}`)
        this.password = await bcrypt.hashSync( this.password,10)
        // console.log(`the current password is ${this.password}`)
        this.confirmpassword = await bcrypt.hashSync( this.password,10);
    }
    next()
})

 const EmployeeModel= new mongoose.model('Register', employeeSchema)
 module.exports = EmployeeModel