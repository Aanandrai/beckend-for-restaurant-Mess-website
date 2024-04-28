const reviewModel=require('../models/reviewModel');
const planModel=require('../models/planModel');

module.exports.getAllReviews=async function getAllReviews(req,res){
    try{
        const reviews=await reviewModel.find();
        if(reviews){
            return res.json({
                message:'review retrieved',
                data:reviews
            });
        }
        else{
            return res.json({
                message:'review Not found'
            });
        }
    }
    catch(err){
        return res.json({
            message:err.message
        });
    }
}

module.exports.top3reviews=async function top3reviews(req,res){
    try{
        const reviews=await reviewModel.find().sort({rating:-1}).limit(3);// find all reviews then sort in decreasing order the get frist 3 review
        if(reviews){
            return res.json({
                message:'review retrieved',
                data:reviews
            });
        }
        else{
            return res.json({
                message:'review Not found'
            });
        }
    }
    catch(err){
        return res.json({
            message:err.message
        });
    }
}

module.exports.getPlanReviews=async function getPlanReviews(req,res){
    try{
        const id=req.params.id;
        
        const review=await reviewModel.find({plan:id});
        if(review){
            return res.json({
                message:'review retrieved',
                data:review
            });
        }
        else{
            return res.json({
                message:'review Not found'
            });
        }
    }
    catch(err){
        return res.json({
            message:err.message
        });
    }
}

module.exports.createReview=async function createReview(req,res){
    try{
        let id=req.params.plan;
        let plan=await planModel.findById(id);
        if(plan){
            let review=await reviewModel.create(req.body);
            plan.ratingsAverage=((plan.ratingsAverage * plan.numberOfRating)+req.body.rating) / (plan.numberOfRating+1);
            plan.numberOfRating=plan.numberOfRating+1;
            plan.save();

            return res.json({
                message:'review update successfully',
                newRating:plan.ratingsAverage
            })
        }
        else{
            return res.json({
                message:'plan does Not exist'
            })
        }
    }
    catch(err){
        return res.json({
            message:err.message
        });
    }
} 

module.exports.updateReview=async function updateReview(req,res){
    
    try{
        let id=req.params.id;
        let dataToBeUpdated=req.body;
    
        let keys=[];
        
        
        
        for(let key in dataToBeUpdated){
            keys.push(key);
        }

        
        let review=await reviewModel.findById(id);
        
        if(review){
            let previousRating=0;
            if(review.rating){
                previousRating=review.rating;
            }
            for(let i=0;i<keys.length;i++){
                review[keys[i]]=dataToBeUpdated[keys[i]];
            }
            
            await review.save();
            const planId=review.plan;
            let plan=await planModel.findById(planId);
            if(plan){
                    
                plan.ratingsAverage=((plan.ratingsAverage * plan.numberOfRating)-previousRating+req.body.rating) / (plan.numberOfRating);
                plan.save();


                return res.json({
                        message:'review & rating of plan is updated sucessfully',
                        review:review
                });
            }
            else{
                return res.json({
                    message:"plan can not be found"
                })
            }
        }
        else{
            return res.json({
                message:"review not found"
            });
        }

    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}

module.exports.deleteReview=async function deleteReview(req,res){
    
    try{
        let id=req.params.id;
        
        let review=await reviewModel.findByIdAndDelete(id);
        if(review){
            let planId=review.plan;
            let rating=review.rating;

            let plan=await planModel.findById(planId);
            if(plan){
                plan.ratingsAverage=((plan.ratingsAverage*plan.numberOfRating)-rating)/(plan.numberOfRating-1);
                plan.numberOfRating=plan.numberOfRating-1;
                plan.save();


                return res.json({
                        message:'review is deleted sucessfully',
                        review:review
                });
            }
            else{
                return res.josn({
                    message:'plan not found may be it can be deleted'
                });
            }
        }
        else{
            return res.json({
                message:'review not found'
            });
        }

    }
    catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}