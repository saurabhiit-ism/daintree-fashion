const Curation=require('../models/Curation')
const User=require('../models/User')
module.exports=async (req,res)=>{
    
    const user=await User.findById(req.session.userId);
    console.log("this is the user")
    console.log(user.role)
    if(user.role>=0 && user.role<=1){
        var curations= await Curation.find({userid:req.session.userId})
    res.render('yourcuration',{
        curations
    });
    }
    if(user.role>=2){
        var curations= await Curation.find({solved:false})
        res.render('yourcuration',{
            curations
        }); 
    }
}