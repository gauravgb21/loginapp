var express          =   require('express');
var path             =   require('path');
var cookieParser     =   require('cookie-parser');
var bodyParser       =   require('body-parser');
var exphbs           =   require('express-handlebars');
var expressValidator =   require('express-validator');
var passport         =   require('passport');
var LocalStrategy    =   require('passport-local').Strategy;
var flash            =   require('connect-flash');
var session          =   require('express-session');
var Handlebars       =   require('handlebars');
var HandlebarsIntl   =   require('handlebars-intl');
var mongo            =   require('mongodb');
var mongoose         =   require('mongoose');
mongoose.connect('mongodb://localhost/loginapp');
var db               =   mongoose.connection;


//Routes
var index            =   require('./routes/index');
var blogimg          =   require('./routes/blogimg');
var blogname         =   require('./routes/blogname');
var blogpost         =   require('./routes/blogpost');
var dashboard        =   require('./routes/dashboard');
var logout           =   require('./routes/logout');
var login            =   require('./routes/login');
var profileupdate    =   require('./routes/profileupdate');
var register         =   require('./routes/register');
var search           =   require('./routes/search');

//Init app
var app=express();

//view Engine
HandlebarsIntl.registerWith(Handlebars);

app.set('views',path.join(__dirname,'views'));
app.engine('handlebars',exphbs({defaultLayout:'layout'}));
app.set('view engine','handlebars');


//bodyParser middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

//static folders
app.use(express.static(path.join(__dirname,'public')));


app.use(cookieParser());
//Express sessions
app.use(session({
 secret: 'secret',
 saveUninitialized: true,
 resave: true
}));


// Passport init
app.use(passport.initialize());
app.use(passport.session());

//Express Validators
app.use(expressValidator({
errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//connect flash
app.use(flash());

//Global Variables
app.use(function(req,res,next){
res.locals.success_msg = req.flash('success_msg');
res.locals.error_msg   = req.flash('error_msg');
res.locals.error       = req.flash('error');
res.locals.user        = req.user||null;
next();
});

//Handle routes
app.use('/',index);
app.use('/blog_img',blogimg);
app.use('/blog_name',blogname);
app.use('/blog_post',blogpost);
app.use('/dashboard',dashboard);
app.use('/login',login);
app.use('/logout',logout);
app.use('/profileupdate',profileupdate);
app.use('/register',register);
app.use('/search',search);

//connect app 

app.listen(8081,function(){
	console.log('server is listing to 8081');
});