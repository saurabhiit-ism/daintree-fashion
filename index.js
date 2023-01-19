const express = require('express')
const app = new express()
app.use(express.static('public'))
const fs = require('fs')
const ejs = require('ejs')
app.set('view engine', 'ejs')



const mongoose = require('mongoose');
// mongoose.connect('mongodb+srv://DaintreeAdmin:DainPass@cluster0.sbgx7.mongodb.net/my_database', { useNewUrlParser: true });
mongoose.connect('mongodb+srv://Saurabhiitism:Daintree@cluster0.hpcw3sn.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true });
//  const bodyParser = require('body-parser')
//  app.use(bodyParser.json())
//  app.use(bodyParser.urlencoded({ extended: true }))

var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

const fileUpload = require('express-fileupload')
app.use(fileUpload())



const validateMiddleWare = require("./middleware/validationMiddleware")
app.use('/posts/store', validateMiddleWare)

const expressSession = require('express-session');
app.use(expressSession({
  secret: 'keyboard cat'
}))

const authMiddleware = require('./middleware/authMiddleware');
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')


const BlogP = require('./models/BlogPost')
const use=require('./models/User')
global.loggedIn = null;
global.recentBlogs = null;
global.redirectUser = false;
global.redirectPost = null;
global.enquireRedirect = null;

app.use("*", async (req, res, next) => {
  loggedIn = req.session.userId;
  
  recentBlogs = await BlogP.find({}).sort({datePosted:-1});;

  next()
});

//google login
app.use(expressSession({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}))



const flash = require('connect-flash')
app.use(flash());

let port=process.env.PORT;
if(port==null || port==""){
  port=4000;
}
app.listen(port, () => {
  console.log('App listening')
})

const homeController = require('./controllers/home')
app.get('/', homeController)


app.get('/eng', homeController)

const landingController=require('./controllers/landingPage')
app.get('/landingpage',landingController)



const aboutController = require('./controllers/about')
app.get('/about', aboutController)

const contactController = require('./controllers/contact')
app.get('/contact', contactController)

const newPostController = require('./controllers/newPost')
app.get('/posts/new', authMiddleware, newPostController)

const blogsController = require('./controllers/blogs')
app.get('/blogs', blogsController)

const getPostController = require('./controllers/getPost')
app.get('/post/:id', getPostController)

const curationController = require('./controllers/getcuration')
app.get('/curation/:id', curationController)

const modelsController = require('./controllers/models')
app.get('/models', modelsController)

const modelController = require('./controllers/model')
app.get('/model', modelController)

const storePostController = require('./controllers/storePost')
app.post('/posts/store', authMiddleware, storePostController)

const newUserController = require('./controllers/newUser')
app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController)

const storeUserController = require('./controllers/storeUser')
app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController)

const loginController = require('./controllers/login')
app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController)

const loginUserController = require('./controllers/loginUser')
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController)

const logoutController = require('./controllers/logout')
app.get('/auth/logout', logoutController)

const enquiryController = require('./controllers/enquiry')
app.post('/enquire/store', enquiryController)

const dashboardController = require('./controllers/dashboard')
app.get('/dashboard', dashboardController)

const categoryPostController = require('./controllers/categoryPost')
app.get('/post/category/:category', categoryPostController)

const forgotpassController = require('./controllers/forgotpass')
app.post('/changepass', forgotpassController)

const storeCommentController = require('./controllers/storeComment')
const BlogPost = require('./models/BlogPost')
app.post('/comment/store/:id', storeCommentController)

const getcurationController = require('./controllers/curation')
app.get('/curation',authMiddleware,getcurationController)

const storecurationController = require('./controllers/storecuration')
app.post('/curation/store',authMiddleware,storecurationController)

const yourcurationController = require('./controllers/yourcuration')
app.get('/curation-answer',authMiddleware,yourcurationController)

/*  PASSPORT SETUP  */

const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

// app.set('view engine', 'ejs');

// const googlelogincontroller=require('./controllers/storegooglelogin')

app.get('/success', async (req, res) => {

  const user = await User.findOne({ email: userProfile.emails[0].value });


  if (user) {
    req.session.userId=user._id
    if(redirectUser==true){
      res.redirect(`/curation/${redirectPost}`)
    }
    else{
      res.redirect('/')
    }
    
  }
  else {
    const reguser=User.create({
      "username": userProfile.displayName,
      "password": "emergencyPassforGoogle123Login",
      "email": userProfile.emails[0].value,
      "bio": "Google login",
      "forgot": "forgot123googleforemergency",
      "image": userProfile.photos[0].value
    }
    )
    res.redirect('/auth/login')
  }
});
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

/*  Google AUTH  */

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('./models/User')
const GOOGLE_CLIENT_ID = '1005471807557-k4itcqmf1255vpc0f166ptou9fkpog4b.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "https://saurabh-daintree.herokuapp.com/auth/google/callback"
},
  function (accessToken, refreshToken, profile, done) {
    userProfile = profile;
    return done(null, userProfile);
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function (req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });


// curation answer

const storeCurationanswerController = require('./controllers/storeCurationanswer')
app.post('/curationanswer/store/:id', storeCurationanswerController)

//change role
const changeroleController = require('./controllers/changerole')
app.post('/role/change',changeroleController)

const enrollController=require('./controllers/enrollPage')
app.get('/enrollnow',enrollController)

app.use((req, res) => res.render('notfound'));