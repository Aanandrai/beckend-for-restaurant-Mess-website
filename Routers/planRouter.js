const express= require("express");
const planRouter=express.Router();
const planModel =require('../models/planModel');
const {protectRoute,isAuthorised}=require('../controller/authController')

const{getPlan,getAllPlans,createPlan,updatePlan,deletePlan}=require('../controller/planController')

planRouter
    .route('/allPlans')
    .get(getAllPlans)


// own plan -> logged in necessary
planRouter.use(protectRoute);
planRouter
    .route('/plan/:id')
    .get(getPlan)


//top3 plan

//

// admin and restaurant owner can only create update or delete plans 
planRouter.use(isAuthorised(['admin','restaurantowner']));

planRouter
    .route('/crudPlan')
    .post(createPlan)

planRouter
    .route('/crudPlan/:id')
    .patch(updatePlan)
    .delete(deletePlan)

module.exports=planRouter