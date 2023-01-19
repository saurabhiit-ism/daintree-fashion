const Curation=require('../models/Curation')
const User=require('../models/User')

module.exports=async(req,res)=>{
    if(req.session.userId==null){
            redirectPost=req.params.id;
           redirectUser=true;
           res.redirect('/auth/login')
    }
    else{
        const curation=await (await Curation.findById(req.params.id)).populate('userid');
    
    const user= await User.findById(req.session.userId);
    var solver=null;
    if(curation.solved){
        solver=await User.findById(curation.solver)
    }

    req.session.userId=user._id
    res.render('curation',{
        curation,user,solver
    });
    }
    
}