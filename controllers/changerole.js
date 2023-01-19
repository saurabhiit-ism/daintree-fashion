const User=require('../models/User')
module.exports=async(req,res)=>{
    
    await User.findOneAndUpdate({email:Object.values(req.body)[0]},{role:Object.values(req.body)[1]})
    res.redirect('/dashboard')
}