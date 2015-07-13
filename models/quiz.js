module.exports = function(sequelize, DataTypes){
	return sequelize.define(
		'Quiz',
		{ pregunta: {
		    type: DataTypes.STRING,
		    validate: { notEmpty: {msg: "-> Falta Pregunta"}}
		  },
		  respuesta: {
		    type: DataTypes.STRING,
		    validate: { notEmpty: {msg: "-> Falta Respuesta"}}
		  },
 		  tema: {
		    type: DataTypes.STRING,
		    validate: { notEmpty: {msg: "-> Falta Índice Temático"}}
		  }
		},
		{
		classMethods: {
		   numQuizes: function(){
		    	return this.findAndCountAll().then(
		  	  function(quizes){return quizes.count;
			});
	   
		   },
		   numQuizesNoComments: function(){
			return sequelize.query('Select count(*) as n from Quizzes where id not in (Select distinct QuizId from Comments)', {type: sequelize.QueryTypes.SELECT}).then(
			  function(numRows){return numRows[0].n;			
			});
		   },
 		   numQuizesComments: function(){
			return sequelize.query('Select count(*) as n from Quizzes where id in (Select distinct QuizId from Comments)', {type: sequelize.QueryTypes.SELECT}).then(
			  function(numRows){return numRows[0].n;			
			});
		   }
		  }
		}
	);
}
