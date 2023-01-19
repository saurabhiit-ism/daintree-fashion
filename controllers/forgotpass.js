
const User=require('../models/User')
const bcrypt=require('bcrypt-nodejs')
var salt = bcrypt.genSaltSync(10);

module.exports=async (req,res)=>{
   const pass = await bcrypt.hash(Object.values(req.body)[2],salt,null,async()=>{

       await User.findOneAndUpdate({"email":Object.values(req.body)[0],"forgot":Object.values(req.body)[1]},{
           $set:{'password':pass}
       },{
        returnNewDocument: true
    })
   })

    res.redirect('/auth/login')
}