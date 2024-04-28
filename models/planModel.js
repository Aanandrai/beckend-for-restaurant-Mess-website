const mongoose = require('mongoose');


const db_link='mongodb+srv://admin:sKyZR2IcEB6QRpPN@cluster0.nnewzr1.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(db_link)
    .then(function(db){
        // console.log(db);
        console.log("plan db connected");
    })

    .catch(function(err){
        console.log(err);
    });

const planSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        maxlength:[20,'plan name should not exceed more then 20 character']
    },

    duration:{
        type:Number,
        requried:true,
        
    },

    price:{
        type:Number,
        required:[true , 'price not entered ']
    },

    ratingsAverage:{
        type:Number,
        default:0
    },
    
    numberOfRating:{
        type:Number,
        default:0
    },
    discount:{
        type:Number,
        validate:[function(){
            return this.discount<100
        }, 'discount should not excees price']
    }

});

const planModel= mongoose.model('planModel',planSchema);

// (async function  createPlan(){
//     let planObj={
//         name:'SuperFood',
//         duration:30,
//         price:1000,
//         ratingsAverage:5,
//         discount:20
//     }
//     // const doc =new planModel(planObj);
//     // await doc.save();

//     let data=await planModel.create(planObj);
// })();

module.exports=planModel;

