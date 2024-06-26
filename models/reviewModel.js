const mongoose = require('mongoose');

const db_link='mongodb+srv://admin:sKyZR2IcEB6QRpPN@cluster0.nnewzr1.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(db_link)
    .then(function(db){
        // console.log(db);
        console.log("db connected");
    })

    .catch(function(err){
        console.log(err);
    });

    const reviewSchema=new mongoose.Schema({
        review:{
            type:String,
            require:[true,'You does not give any review']
        },
        rating:{
            type:Number,
            min:1,
            max:10,
            require:[true,'rating is required']
        },
       
        createdAt:{
            type:Date,
            default:Date.now()
        },

        user:{
            type:mongoose.Schema.ObjectId,
            ref:'userModel',
            required:[true, 'review must belong to a user']
        },
        plan:{
            type:mongoose.Schema.ObjectId,
            ref:'planModel',
            required:[true, 'review must belong to a plan']
        }
    });

    reviewSchema.pre(/^find/, function(next){
        this.populate({
            path:"user",
            select:"name profileImage"
        }).populate("plan");
        next();
    });

const reviewModel=mongoose.model('reviewModel',reviewSchema);

module.exports=reviewModel