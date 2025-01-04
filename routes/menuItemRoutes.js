const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');



//post method to add menu item
router.post('/', async (req,res)=>{
    try{
        const data = req.body
        const newMenu = new MenuItem(data);
        const response = await newMenu.save();
        console.log('data saved');
        res.status(200).json(response);
    }catch(err){
        console.log(err);
        res.status(500).json({error:'internal server error'})
    }
})

//get method to get menu items
router.get('/',async (req,res)=>{
    try{
        const data = await MenuItem.find();
        console.log('data fetched');
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'internal server error'});
    }
})

//get method to get person work type
router.get('/:tasteType',async (req,res)=>{
    try{
     const tasteType = req.params.tasteType;
     if(tasteType == 'sour' || tasteType == 'sweet' || tasteType == 'salt'){
 
         const response = await MenuItem.find({taste:tasteType});
         console.log('response fetched');
         res.status(200).json(response);
     } else{
         res.status(404).json({error:"invalid taste type"});
     }
    }catch(err){
     console.log(err);
     res.status(500).json({error: 'internal server error'});
    }
 })

 //updating data
 router.put('/:id',async (req,res)=>{
    try{
      const menuId = req.params.id;
      const updateMenuData = req.body;

      const response = await MenuItem.findByIdAndUpdate(menuId,updateMenuData,{
        new:true,//return updated document
        runValidators:true //run mongoose validation
      });

      if(!response){
        return res.status(404).json({error:'dish not found'});
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
     const menuId = req.params.id;  //extract person id from url param
 
     //assuming you have person model
     const response = await MenuItem.findByIdAndDelete(menuId);
 
     if(!response){
         return res.status(404).json({error:'dish not found'});
       }
    console.log('data deleted');
    res.status(200).json({message:'dish deleted successfully'});
 
    } catch(err){
     console.log(err);
     res.status(500).json({error: 'internal server error'});
 }
 
  })

  //coment added
module.exports = router;