const User = require("../models/UserModel");
const { body,validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");

exports.userList = [
	function (req, res) {
		try {
			User.find().then((users)=>{
				if(users.length > 0){
					return apiResponse.successResponseWithData(res, "Operation success", users);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", []);
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.userDetail = [
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.successResponseWithData(res, "Operation success", {});
		}
		try {
			User.findOne({_id: req.params.id},"_id firstName lastName email contact_no").then((user)=>{                
				if(user !== null){
					
					return apiResponse.successResponseWithData(res, "Operation success", user);
				}else{
					return apiResponse.successResponseWithData(res, "Operation success", {});
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];

exports.register = [
	
	body("firstName", "First Name must not be empty.").isLength({ min: 3 }).trim(),
	body("lastName", "Last must not be empty.").isLength({ min: 3 }).trim(),
	body("email").exists().withMessage("Email is required").isEmail().withMessage("Provide valid email"),
	body("contact_no").exists().withMessage("Contact No is required").isMobilePhone('any').withMessage("Provide valid Contact No"),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var user = new User(
				{ 
					firstName: req.body.firstName,
					lastName: req.body.lastName,
					email: req.body.email,
					contact_no: req.body.contact_no
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				//Save User.
				User.find({email:req.body.email}, function (err, foundUser) {
					if(foundUser){
						return apiResponse.notFoundResponse(res,"User with given email is already Exits");
					}
					else {
						user.save(function (err) {
							if (err) { return apiResponse.ErrorResponse(res, err); }
						
							return apiResponse.successResponseWithData(res,"User add Success.");
						});
					}
				});
				
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
exports.userUpdate = [
	body("firstName", "First Name must not be empty.").isLength({ min: 3 }).optional().trim(),
	body("lastName", "Last must not be empty.").isLength({ min: 3 }).optional().trim(),
	body("email").optional().isEmail().withMessage("Provide valid email"),
body("contact_no").optional().isMobilePhone('any').withMessage("Provide valid Contact No"),
	sanitizeBody("*").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			var user = new User(
				{ firstName: req.body.firstName,
					lastName: req.body.lastName,
					email: req.body.email,
					contact_no: req.body.contact_no,
					_id:req.params.id
				});

			if (!errors.isEmpty()) {
				return apiResponse.validationErrorWithData(res, "Validation Error.", errors.array());
			}
			else {
				if(!mongoose.Types.ObjectId.isValid(req.params.id)){
					return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
				}else{
					User.findById(req.params.id, function (err, foundUser) {
						if(foundUser === null){
							return apiResponse.notFoundResponse(res,"User not exists with this id");
						}else{
							
								//update user.
								User.findByIdAndUpdate(req.params.id, user, {},function (err) {
									if (err) { 
										return apiResponse.ErrorResponse(res, err); 
									}else{
										
										return apiResponse.successResponseWithData(res,"User update Success.", user);
									}
								});
							
						}
					});
				}
			}
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];
exports.userDelete = [
	function (req, res) {
		if(!mongoose.Types.ObjectId.isValid(req.params.id)){
			return apiResponse.validationErrorWithData(res, "Invalid Error.", "Invalid ID");
		}
		try {
			User.findById(req.params.id, function (err, foundUser) {
				if(foundUser === null){
					return apiResponse.notFoundResponse(res,"User not exists with this id");
				}else{
					//delete User.
						User.findByIdAndRemove(req.params.id,function (err) {
							if (err) { 
								return apiResponse.ErrorResponse(res, err); 
							}else{
								return apiResponse.successResponse(res,"User delete Success.");
							}
						});
					
				}
			});
		} catch (err) {
			//throw error in json response with status 500. 
			return apiResponse.ErrorResponse(res, err);
		}
	}
];