const Curation=require('../models/Curation')

module.exports=async(req,res)=>{
    
    await Curation.findByIdAndUpdate(req.params.id,{answer:Object.values(req.body)[0],solved:true,solver:req.session.userId})
    res.redirect('/curation-answer')
}