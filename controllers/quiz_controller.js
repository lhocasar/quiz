var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId){
  models.Quiz.find({
		where: {id: Number(quizId)},
		include: [{ model: models.Comment}]}
	).then(
	function(quiz){
	  if(quiz){
		req.quiz = quiz;
		next();
	  }else {next(new Error('No existe quizId=' + quizId));}	
	}
  ).catch(function(error) { next(error);});
};

// GET /quizes/:id
exports.show = function (req,res){
   res.render('quizes/show',{quiz: req.quiz, errors: []});
};

//GET /quizes/:id/answer
exports.answer = function (req,res){  
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta){
	resultado= '¡Correcto!';
  }		
  res.render('quizes/answer',{quiz: req.quiz, respuesta: resultado, errors: []});
};

//GET /quizes/index
exports.index = function (req,res){
  var busqueda = '%';
  if (req.query.search){
	var arrayPalabras = req.query.search.split(" ");
	for (var i = 0; i< arrayPalabras.length; i++){
	  busqueda += '%' + arrayPalabras[i];
	}
	busqueda += '%';
  }
  models.Quiz.findAll({where:["pregunta like ?", busqueda], order:'pregunta ASC'})
  .then(
	function(quizes){
  	  res.render('quizes/index.ejs',{quizes:quizes, errors: []});
    	}
  ).catch(function(error) {next(error);})
};

//GET /author
exports.author = function(req,res){
	res.render('author', {autor: 'Leire González Hocasar', errors: []});
};

//GET /statistics
exports.statistics = function(req,res){
  var stadist ={
    _numQuizes: 0,
    _numComments: 0,
    _numQuizesNoComments: 0,
    _numQuizesComments: 0}


 models.Quiz.numQuizes()
  .then(function(nQuizes){
	  stadist._numQuizes = nQuizes;
	  return  models.Quiz.numQuizesNoComments();
        })
  .then(function(nQuizesNoComm){
	stadist._numQuizesNoComments = nQuizesNoComm;
        return models.Quiz.numQuizesComments();
        })
   .then(function(nQuizesComm){
	stadist._numQuizesComments = nQuizesComm; 
        return models.Comment.numComments();
       })
   .then(function(nComments){
	stadist._numComments = nComments; 
       })
  .catch(function(error) {next(error);})
  .finally(function(){

     res.render('statistics', {numQuizes: stadist._numQuizes,
	    numComments: stadist._numComments,
	    numQuizesNoComments: stadist._numQuizesNoComments,
	    numQuizesComments: stadist._numQuizesComments,
	    errors: []});
  });
};

//GET /quizes/new
exports.new = function(req,res){
  var quiz = models.Quiz.build(
	{pregunta: "", respuesta: "", tema: "otro"}
  );
  res.render('quizes/new', {quiz: quiz, errors: []});
};

//POST /quizes/create
exports.create = function(req, res){
  var quiz = models.Quiz.build(req.body.quiz);
  quiz.validate().then( function(err){
  if (err) {
	res.render('quizes/new', {quiz: quiz, errors: err.errors});
  }else{
	  quiz
	   .save({fields: ["pregunta", "respuesta", "tema"]})
	   .then(function(){
    		res.redirect('/quizes');})
	}
   });
};

//GET /quizes/:id/edit
exports.edit = function(req, res){
  var quiz = req.quiz;
  res.render('quizes/edit', {quiz: quiz, errors: []});
};

//PUT /quizes/:id
exports.update = function(req, res){
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;

  req.quiz
  .validate()
  .then(
	function(err){
	  if (err){
	    res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
	  } else {
	    req.quiz
	    .save({ fields: ["pregunta","respuesta","tema"]})
	    .then( function(){res.redirect('/quizes');});
	  }
	}
  );
};

//DELETE /quizes/:id
exports.destroy = function(req, res){
  req.quiz.destroy().then( function(){
	res.redirect('/quizes');
  }).catch( function(error){next(error)});
};

