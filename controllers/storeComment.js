const BlogPost=require('../models/BlogPost')
const comment=require('../models/comment')

module.exports=async(req,res)=>{
    
    // await BlogPost.findByIdAndUpdate(req.params.id,{ $set: { comments: commId }});
    const id=req.session.userId;
    if(id){

        const comm=await comment.create({userid:id,message:Object.values(req.body)[0]})
        await BlogPost.findByIdAndUpdate(req.params.id,{$push: { comments:comm._id }});
        return res.redirect(`/post/${req.params.id}`)
    }
    res.redirect('/auth/login')
}