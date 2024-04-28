const express= require("express");
const userModel =require('../models/userModel');
const jwt=require('jsonwebtoken');

const JWT_KEY=require('../secrets');


module.exports.signup=async function signup(req,res){

    try{
        let dataobj=req.body;
        let user=await userModel.create(dataobj);

        if(user){
        res.json({
            message:"user sign up",
            data:user
        }); 
        }
        else{
            res.json({
                message:'error while signup'
            })
        }

        
    }
    catch(err){
        res.json({
            message:err.message
        })
    }

}


module.exports.login=async function login(req,res){

    try{
       let data=req.body;
       if(data.email){
           let user=await userModel.findOne({email:data.email});
           if(user){
               if(user.password==data.password){
                 let uid=user['_id'];   
                 let token=jwt.sign({payload:uid},JWT_KEY);

                 res.cookie('login',token, {httpOnly:true});
                   return res.json({
                       message:'User has login',
                       userDetails:data
                   })   
               }
               else{
                   return res.json({
                       message:'wrong credentials'
                   })
               }
           }
           else{
               return res.json({
                   message:'user not found'
               });
           }
       }
       else{
           return res.json({
               message:"empty data field"
           })
       }
   }
   catch(err){
       return res.json({
           message:err.message
       })
   }
}

// isAuthorized-> check user's role

module.exports.isAuthorised=function isAuthorised(roles){
    return function(req,res,next){
        if(roles.includes(req.role)==true){
            next();

        }
        else{
            res.status(401).json({
                message:'operation not allowed'
            })
        }


    }
}

module.exports.protectRoute=async function protectRoute(req,res,next){
    try{
        let token;
        if(req.cookies.login){
           
            token=req.cookies.login;
            let payload=jwt.verify(token,JWT_KEY);
            if(payload){
                const user=await userModel.findById(payload.payload)
               
                req.role=user.role;
                req.id=user.id;
                next();
            }
            else{
                return res.json({
                    message:"user not verified"
                });
            }
        }
        else{
            const client=req.get('User-Agent');
            if(client.includes("Mozilla")==true){
                return res.redirect('/login');
            }
            else{
                res.json({
                    message:"please login"
                })
            }
        }
    }
    catch(err){
        return res.json({
            message:err.message,
        });
    }
}

module.exports.forgetpassword=async function forgetpassword(req,res){

    let {email}=req.body;
    try{
        const user=await userModel.findOne({email:email});

        if(user){
            const resetToken=user.createResetToken();

            let resetPasswordLink=`${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;
            // send email to the user 
            // nodemailer
        }
        else{
            return res.json({
                message:'please signup'
            });
        }
    }
    catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

module.exports.resetpassword=async function resetpassword(req,res){
    try{
        const token=req.params.token; 
        let {password,confirmPassword}=req.body;

        const user=await userModel.findOne({resetToken:token});

        if(user){
            user.resetPasswordHandler(password,confirmPassword);
            await user.save();

            res.json({
                message:'password changes successfuly '
            });
        }
        else{
            res.json({
                message:"user Not found"
            })
        }
    }
    catch(err){
        res.json({
            message:err.message
        })
    }

}

module.exports.logout=function logout(req,res){
    res.cookie('login', '',{maxAge:1});
    res.json({
        message:"user logged out succesfully"
    });
}