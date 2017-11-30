var express = require('express');
var cors = require('cors')
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var db = require('./db')();
var user = require('./models/participant');
var sports = require('./models/sports');
var joined_sports = require('./models/joined_sports');

const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'bhaskararao.nyros@gmail.com',
        pass: 'Gbxempp3vs'
    }
});


app.use(cors())

app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));

app.post('/register_participant',function(req, res){
	console.log(req.body);
	user.findOne({user_name: req.body.name},function(err, use){
		if(!err && use == null){
			new user({
				user_name : req.body.name,
				email : req.body.email,
				password : req.body.password,
				age : req.body.age,
				gender : req.body.gender

			}).save(function(err1, user1){
               res.json({
               	status:'success',
               	message : 'user created successfully',
               	reguser : user1
               })
			})
		} else {
			res.json({
				status:'error',
				message : 'user already exists',
				data : use
				
			})
		}
	})
})

app.post('/login_participant',function(req, res){
	user.findOne({user_name: req.body.name, password: req.body.password},function(err, getuser){
		if (getuser) {
			res.json({
				status:'success',
				message : "Found",
				userdetails : getuser
			})
		} else {
			res.json({
				status:'error',
				message : "Not found"
			})
		}	
	})
});

app.post('/get_sports_details',function(req, res){
	sports.find({},function(err, sport) {
		if (sport) {
			res.json({
				status:'success',
				message : "Found",
				sportsdetails : sport
			})
		} else {
			res.json({
				status:'error',
				message : "Not found"
			})
		}	
	})
});

app.post('/save_ids_to_sports',function(req, res){
	joined_sports.findOne({s_id:req.body.sport_id, u_id:req.body.user_id},function(err, sportId) {
		if(!err && sportId == null){
			new joined_sports({
				s_id:req.body.sport_id,
				u_id:req.body.user_id,
			}).save(function(err1, sportId1){
				sp_count =[]
				sports.find({},function(err, doc){
					let k = 1,l = doc.length;
					for (let i = 0; i < doc.length; i++) {
					 	joined_sports.find({s_id : doc[i]._id},function(err, cut){
					 		sp_count.push({sport_id: doc[i]._id, name: doc[i].name, count:cut})
					 		if(k == l) {

						 		res.json({
									status : 'success',
									sports_count :sp_count.sort((a, b) => a.name > b.name)
								});
						 	} else {
						 		k++;
						 	}
					 	})	
					}
				})
			})
		} else {
			res.json({
				message : 'Already Participated',
				data : sportId,
				status : 'error'
			})
		}
	})
});

app.post('/get_participant_details',function(req, res){
	joined_sports.find({s_id:req.body.sport_id}).populate('u_id').exec(function(err, sportId) {
				res.json({
					status : 'success',
					data : sportId
				});
	})
});

app.post('/get_all_sports',function(req, res){
	joined_sports.find({u_id:req.body.user_id},function(err, sportstatus) {
		res.json({
			status : 'success',
			data : sportstatus
		});
	});
});

app.post('/get_sports_count',function(req, res){
	sp_count =[]
	sports.find({},function(err, doc){
		let k = 1,l = doc.length;
		for (let i = 0; i < doc.length; i++) {
		 	joined_sports.find({s_id : doc[i]._id},function(err, cut){
		 		sp_count.push({sport_id: doc[i]._id, name: doc[i].name, count:cut})
		 		if(k == l) {
			 		res.json({
						status : 'success',
						sports_count : sp_count.sort((a, b) => a.name > b.name)
					});
			 	} else {
			 		k++;
			 	}
		 	})	
		}
	})
});

app.post('/get_total_participants',function(req, res){
	joined_sports.aggregate([
	    {"$group" : {_id:"$u_id", count:{$sum:1}}}
	], function(err, totalcount) {
		res.json({
			status : 'success',
			total_count : totalcount
		});
	});
});

app.post('/exit_from_sport',function(req, res){
	joined_sports.remove({u_id:req.body.user_id,s_id:req.body.sport_id},function(err, remove) {
		if (remove) {
			res.json({
				status : 'success',
				data : remove,
				message : "Participant successfully existed"
			});
		}
	});
});

app.post('/get_user_details',function(req, res){
	user.findOne({_id: req.body.user_id},function(err, getuser){
		if (getuser) {
			res.json({
				status:'success',
				message : "User Found",
				userdetails : getuser
			})
		} else {
			res.json({
				status:'error',
				message : "User Not found"
			})
		}	
	})
});

app.post('/edit_participant',function(req, res){
	// console.log(req.body);
	user.update({_id: req.body.user_id},
		{user_name: req.body.name, age: req.body.age, password: req.body.password, gender:req.body.gender},function(err, updateduser){
		if (updateduser) {
			res.json({
				status:'success',
				message : "User Updated",
				userdetails : updateduser
			})
		} else {
			res.json({
				status:'error',
				message : "Error"
			})
		}
	})
})

app.post('/send_request_for_exit',function(req, res){
	console.log(req.body);

	const mailOptions = {
	  from: req.body.email, // sender address
	  to: 'bhaskararao.nyros@gmail.com', // list of receivers
	  subject: 'Requested for Exit', // Subject line
	  html: '<p>Hello Admin.I request you exit me from this sport <a href="http://10.90.90.55:3000/admin-requests/'+req.body.user_id+'/'+req.body.sport_id+'">Click here to confirm request</a></p>'// plain text body
	};

	transporter.sendMail(mailOptions, function (err, info) {
	   if(err)
	     console.log(err)
	   else
	     res.json({
			status:'success',
			message : "Request Sent"
		})
	});
});


app.post('/send_response',function(req, res){
	console.log(req.body);

	const mailOptions = {
	  from: 'Admin', // sender address
	  to: req.body.email, // list of receivers
	  subject: 'Request Approved', // Subject line
	  html: '<p>Hello Participant.Your request is approved.<a href="http://10.90.90.55:3000/"> Click here to redirect to Home Page </a></p>'// plain text body
	};

	transporter.sendMail(mailOptions, function (err, info) {
	   if(err)
	     console.log(err)
	   else
	    res.json({
			status:'success',
			message : "Request Accepted"
		})
	});
});


app.post('/get_sport_details',function(req, res){
	sports.findOne({_id: req.body.sport_id},function(err, getsport){
		if (getsport) {
			res.json({
				status:'success',
				message : "Sport Found",
				sportdetails : getsport
			})
		} else {
			res.json({
				status:'error',
				message : "Sport Not found"
			})
		}	
	})
});

app.post('/admin_login',function(req, res){
	if (req.body.username === 'admin' && req.body.password === '123') {
		res.json({
			status:'success',
			message : "Login Successfull"
		})
	} else {
		res.json({
			status:'error',
			message : "Login Failed"
		})
	}
});


app.listen(3001, function () {
   console.log('Example app listening on port 3001')
})