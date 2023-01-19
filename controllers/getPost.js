const BlogPost=require('../models/BlogPost')

module.exports=async(req,res)=>{
    
    const blogpost=await (await (await (await BlogPost.findById(req.params.id)).populate('userid')).populate({
        path : 'comments',
        populate : {
          path : 'userid'
        }
      }));
    

    res.render('post',{
        blogpost
    });
}