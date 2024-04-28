const userModel = require("../models/userModel");


module.exports.getUser=async function getUser(req,res){
    // let allUser=await userModel.find();
    let id=req.id;
  
    let user= await userModel.findById(id);
   
    if(user){
        res.json(user);
    }
    else{
        res.json({
            message:'user not found'
        });
    }
};


module.exports.updateUser=async function updateUser(req,res){

    try{
        let id=req.params.id;
      
        let user=await userModel.findById(id);
        
        let dataToBeUpdated=req.body;

        if(user){
            let keys=[];
            for(let key in dataToBeUpdated){
                keys.push(key);
            }
           

            for(let i=0;i<keys.length;i++){
                user[keys[i]]=dataToBeUpdated[keys[i]];
            }
            // console.log(user)
            const updatedData=await user.save();
            res.json({
                message:"data updated successfully",
                data:user
            });
        }
        else{
            res.json({
                message:"user not found",
            });
        }
    }
    catch(err){
        res.json({
            message:err.message,
        });  
    }

   
};

module.exports.deleteUser=async function deleteUser(req,res){

    try{
        let id=req.params.id;
        let user=await userModel.findByIdAndDelete(id) ;    //jis user ko delete karo vo return bhi aata hai so user me store hoga vo

        if(!user){
            res.json({
                message:'user not found'
            })
        }
        else{
        res.json({
            message:"data has been deleted",
        });
        }

    }
    catch(err){
            res.json({
                message:err.message
            });
    }
} ;




module.exports.getAllUser=async function getAllUser(req,res){

    try{
        let user=await userModel.find();
        if(user){
            res.json({
                message:'user retrieved',
                data:user
            });

        }
        else{
            res.json({
                message:'user not found'
            })
        }
    }
    catch(err){
        res.json({
            message:err.message
        })
    }
}

