const planModel =require('../models/planModel');

module.exports.getAllPlans=async function getAllPlans(req,res){

    try{

        let plans= await planModel.find()
        if(plans){
            return res.json({
                message:'all plans',
                data:plans
            });
        }
        else{
            return res.json({
                message:'does not found any plan'
            });
        }
    }
    catch(err){
        res.status(500).json({
            message: err.message
       });
    }
}


module.exports.getPlan=async function getPlan(req,res){

    try{
        let id=req.params.id;
        let plan= await planModel.findById(id);
        if(plan){
            return res.json({
                message:'all plans',
                data:plan
            });
        }
        else{
            return res.json({
                message:'does not found any plan'
            });
        }
    }
    catch(err){
        res.status(500).json({
            message: err.message
       });
    }
}

module.exports.createPlan=async function createPlan(req,res){

    try{
        let planData=req.body;
        let createdPlan=await planModel.create(planData);

        if(createdPlan){
            return res.json({
                message:'plan created',
                data:createdPlan
            });
        }
        else{
            return res.json({
                message:'sent the empty data field',
            })
        }
    }
    catch(err){
        res.status(500).json({
            message:err.message
        });
    }

}

module.exports.deletePlan=async function deletePlan(req,res){

    try{
        let id=req.params.id;
        let deletedPlan=await planModel.findByIdAndDelete(id);

        if(deletedPlan){
            return res.json({
                message:'Plan is deleted',
                plan:deletedPlan
            });

        }
        else{
            return res.json({
                message:'Plan is not found'
            })
        }
    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

module.exports.updatePlan=async function updatePlan(req,res){
    try{
        let id=req.params.id;
        let dataToBeUpdated=req.body;

        let keys=[];

        for(let key in dataToBeUpdated){
            keys.push(key);
        }
        let plan=await planModel.findById(id);

        //this is note working why
        // for(key in keys){
        //     plan[key]=dataToBeUpdated[key]
        // }
        for(let i=0;i<keys.length;i++){
            plan[keys[i]]=dataToBeUpdated[keys[i]];
        }
        // console.log(plan);
        await plan.save();

        return res.json({
                message:'plan is updated sucessfully',
                plan:plan
        });

    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

module.exports.top3Plans=async function top3Plans(req,res){
    try{
        let plans=await planModel.find().sort({ratingsAverage:-1}).limit(3);
        return res.json({
            message:'top3 Plans',
            data:plans
        })
    }

    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}