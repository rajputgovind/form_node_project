const jwt = require('jsonwebtoken')

const EmployeeModel = require('../models/EmployeeModel.js')

const auth = async(req,res,next)=>{
    try {   

        // Sir ne 
        //     const token = req.cookies.jwt
        //    const verifyUser = await jwt.verify(token,process.env.SECRET_KEY,(error,payload)=>{
        //     if(error){
        //         res.status(400).send({message:"access denied"})
        //      }
        //      else{
        //          next()
        //      }
        //  })
          
            const token = req.cookies.jwt

            const verifyUser = await jwt.verify(token,process.env.SECRET_KEY)
            // console.log(verifyUser)

            const user = await EmployeeModel.findOne({_id:verifyUser.adminId})
            // console.log(user)

            req.token = token;
            req.user = user;

            next()
            
           
    } catch (error) {
        res.status(401).send(error)
    }
}

module.exports = auth