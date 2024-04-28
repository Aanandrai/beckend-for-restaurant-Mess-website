const express= require('express');
const userRouter=require('./Routers/userRouter');

const planRouter=require('./Routers/planRouter');
const reviewRouter=require('./Routers/reviewRouter');
const cookieParser=require('cookie-parser');
const bookingRouter=require("./Routers/bookingRouter");
const app=express();
app.use(cookieParser());

  
app.use(express.json());
app.listen(3000);



app.use("/user",userRouter);
app.use("/plans",planRouter);
app.use('/review',reviewRouter);
app.use('/booking',bookingRouter);

