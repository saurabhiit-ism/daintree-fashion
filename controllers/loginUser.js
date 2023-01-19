const bcrypt = require('bcrypt-nodejs')
const User = require('../models/User')
const Curation = require('../models/Curation')

module.exports = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email }, (error, user) => {
        if (user) {
            bcrypt.compare(password, user.password, async (error, same) => {
                if (same) {
                    req.session.userId = await user._id
                    if (redirectUser == true) {
                        // const curation=await Curation.findById(redirectPost).populate('userid');
                        // console.log(curation)
                        // const user= await User.findById(req.session.userId);
                        // var solver=null;
                        // if(curation.solved){
                        //     solver=await User.findById(curation.solver)
                        // }

                        // req.session.userId=user._id
                        // res.render('curation',{
                        //     curation,user,solver
                        // });
                        res.redirect(`/curation/${redirectPost}`)
                    }
                    else {
                        res.redirect('/')
                    }


                }
                else {
                    res.redirect('/auth/login')
                }
            })
        }
        else {
            res.redirect('/auth/login')
        }
    })
}