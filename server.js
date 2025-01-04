const express = require('express')
const app = express();
const db = require('./db');
require('dotenv').config();
const passport = require('./auth');

const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // req.body
const PORT = process.env.PORT || 3000;

//middleware function

const logRequest = (req,res,next)=>{
    console.log(`[${new Date().toLocaleString()}] Request Made to: ${req.originalUrl}`);
    next();
}
app.use(logRequest);  //logging implemented on all route


app.use(passport.initialize());

const localAuthMiddleware = passport.authenticate('local',{session:false})

app.get('/',function (req, res) {
    res.send('Welcome to our Hotel');
});

// Import the router files
const personRoutes = require('./routes/personRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');
const { jwtAuthMiddleware } = require('./jwt');

// Use the routers
app.use('/person', personRoutes);
app.use('/menu'
    ,menuItemRoutes);
  
//to display the menu items
app.get('/menu',jwtAuthMiddleware, async (req,res)=>{
    const menuItems = await db.getMenuItems();
    res.json(menuItems);
})

app.listen(3000, ()=>{
    console.log('listening on port 3000');
})