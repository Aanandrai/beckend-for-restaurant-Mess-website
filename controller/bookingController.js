let SK="sk_test_51OsiHpSIZ7f2GDZwh33I0A2ukOBhvvzAocX9gk4e587grDzPb6744Vv3qT39zKoVtYLCJnOmQ1mdYuI8U1x5pNnQ00IdMS8tS3";

const stripe=require('stripe')(SK);
const planModel=require('../models/planModel');
const userModel=require('../models/userModel');

module.exports.createSession=async function createSession(req,res){
    try{
        let userId=req.id;
        let planId=req.params.id;

        const user=await userModel.findById(userId);
        const plan=await planModel.findById(planId);

        const session=await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            customer_email: user.email,
            client_refernce_id:plan.id,

            line_items:[
                {
                name:plan.name,
                description:plan.description,
                amount:plan.price,
                currency:'inr',
                quantity:1
            }
        ],

        success_url:`${req.protocol}://${req.get("host")}/profile`,
        cancel_url:`${req.protocol}://${req.get("host")}/profile`

        })
        res.status(200).json({
            status:"success",
            session
            })
        }
    catch(err){
        res.status(500).json({
            err:err.message
        })

    }
}