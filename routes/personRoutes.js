const express = require('express');
const router = express.Router();
const Person = require('../models/Person');
const {jwtAuthMiddleware,generateToken} = require('./../jwt');

//post route to add a person
router.post('/signup',async (req,res)=>{
    try{
     const data = req.body //assuming request body contains person data
 
     const newPerson = new Person(data);
     
   //save new person to db
    const response = await newPerson.save();
    console.log('data saved');

   const payload = {
    id: response.id,
    username: response.username
   } 
   console.log(JSON.stringify(payload));

    const token = generateToken(payload);
    console.log("Token is: ",token);

    res.status(200).json({response: response,token: token});
 
    }
    catch(err){
     console.log(err);
     res.status(500).json({error: 'internal server error'});
    }
    
 });

 router.post('/login',async (req,res)=>{
  try{
    //extract username and password from req body
  const {username,password} = req.body;

  //find user by username
  const user = await Person.findOne({username:username});

  //if user doesn't exist or assword doesn't match
 if(!user || !(await user.comparePassword(password))){
  return res.status(401).json({error:'invalid username or password'});
 }

 //generate token
 const payload = {
  id: user.id,
  username:user.username
 }
  const token = generateToken(payload);

  //return tokenas response
  res.json({token})

  } catch(err){
   console.error(err)
   res.status(500).json({error:'internal server error'});
  } 
 
});

//profile route
router.get('/profile',jwtAuthMiddleware,async (req,res)=>{
   try{
    const userData = req.user;
    console.log("user data: ",userData);

   const userId = userData.id;
   const user = await Person.findById(userId);
   
   res.status(200).json({user});
   }catch(err){
    console.error(err)
    res.status(500).json({error:'internal server error'});
   }
});

 //get method to get person
router.get('/',jwtAuthMiddleware,async (req,res)=>{
    try{
        const data = await Person.find();
        console.log('data fetched');
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'internal server error'});
    }
})

//get method to get person work type
router.get('/:workType',async (req,res)=>{
    try{
     const workType = req.params.workType;
     if(workType == 'chef' || workType == 'manager' || workType == 'waiter'){
 
         const response = await Person.find({work:workType});
         console.log('response fetched');
         res.status(200).json(response);
     } else{
         res.status(404).json({error:"invalid work type"});
     }
    }catch(err){
     console.log(err);
     res.status(500).json({error: 'internal server error'});
    }
 })

 //updating data
 router.put('/:id',async (req,res)=>{
    try{
      const personId = req.params.id;
      const updatePersonData = req.body;

      const response = await Person.findByIdAndUpdate(personId,updatePersonData,{
        new:true,//return updated document
        runValidators:true //run mongoose validation
      });

      if(!response){
        return res.status(404).json({error:'person not found'});
      }

      console.log('data updated');
      res.status(200).json(response);

    }catch(err){
        console.log(err);
        res.status(500).json({error: 'internal server error'});
    }
 })

 //deleting data
 router.delete('/:id',async (req,res)=>{
   try{
    const personId = req.params.id;  //extract person id from url param

    //assuming you have person model
    const response = await Person.findByIdAndDelete(personId);

    if(!response){
        return res.status(404).json({error:'person not found'});
      }
   console.log('data deleted');
   res.status(200).json({message:'person deleted successfully'});

   } catch(err){
    console.log(err);
    res.status(500).json({error: 'internal server error'});
}

 })


 module.exports = router;