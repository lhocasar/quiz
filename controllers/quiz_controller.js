//GET /quizes/question
exports.question = function (req,res){
	res.render('quizes/question',{pregunta: 'Capital de Italia'});
};

//GET /quizes/answer
exports.answer = function (req,res){
	if (req.query.respuesta === 'Roma'){		
		res.render('quizes/answer',{respuesta: 'Correcto', nombre_href: 'Volver a la pregunta'});
	} else {
		res.render('quizes/answer',{respuesta: 'Incorrecto', nombre_href: 'Intentalo otra vez'});
	}
};
