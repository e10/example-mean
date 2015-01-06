var Q=require('q'),
  mongoose = require('mongoose'),
  cvSchema=null,CV=null;

module.exports = exports = function(app){
  mongoose.connect('mongodb://localhost/test');
  cvSchema = mongoose.Schema({ name:String, title:String,email:String,phone:String});
  CV = mongoose.model('CVs', cvSchema);

  app.get('/u',function(req,res){
    var bag={query:req.query.q||''};
    CV.findById(req.query.id,function(err,item){
      if(!item){
        res.redirect('/');
      }else{
        item.bag=bag;
        res.render('profile',item);
      }
    })
  });

  app.route('/profile/create')
    .get(function(req,res){
      res.render('profile/create', {
          name: 'Anuj Pandey',
          title: 'CEO / Founder - e10',
          email:'a@e10.in',
          phone:'+91 9867763174'
      });
    });

  app.route('/profile')    
    .post(function(req, res){
      new CV(req.body,false).save();
      res.redirect('/');
    })
    .get(function(req,res){
      console.log('-->',req.params.id);
      res.redirect('/');
    })
    .put(function(req,res){
      console.log('-->',req.params.id);
      res.redirect('/');
    });
  
  app.get('/', function(req, res){
    var finder=CV.find();
    finder.or({'email':new RegExp(req.query.q,'i')});
    finder.or({'phone':new RegExp(req.query.q,'i')});
    finder.or({'name':new RegExp(req.query.q,'i')});
    finder.limit(req.query.top||10);
    finder.exec(function(err,rows){
      res.render('index',{
        query:req.query.q,
        top:req.query.top||10,
        rows:rows,
        error:err
      })
    });
  });

}