var validator=require('validator');

var validationFn={

    validateUpdate:function(req,res,next){
        var username = req.body.username;
        var firstname = req.body.firstname;
        var lastname = req.body.lastname;
        pattern=new RegExp('^[a-zA-Z0-9_]+$')
        if(validator.isAlphanumeric(firstname)&&validator.isAlphanumeric(lastname)&&pattern.test(username)){
            next()
        }
        else{
            console.log('failed validation')
            res.status(500);
            res.send(`{"message":"Internal Server Error"}`);
        }
       //Validation code to check register form input values
       //return response with status 500 if validation fails
    },

    validateProduct: function (req, res, next) {
        var title = req.body.title;
        var category = req.body.category;
        var description = req.body.description;
        var price = req.body.price;
        pattern=new RegExp('^[a-zA-Z0-9\\s -]+$')
        if(pattern.test(title)&&validator.isAlpha(category)&&pattern.test(description)&&validator.isDecimal(price.toString(),{force_decimal: false, decimal_digits: '2', locale: 'en-US'})){
            next()
        }else{
            console.log('failed validation')
            res.status(500);
            res.send(`{"message":"Internal Server Error"}`);
        }
   //Validation code to check userid from req.params

       //return response with status 500 if validation fails

},
    sanitizeResult:function(result){
        result=JSON.parse(JSON.stringify(result))
        //Sanitize each record’s values from the database result        
        for(let i = 0; i < result.length; i++){
            for(y in result[i]){
                result[i][y]=validator.escape(result[i][y].toString())
                
            }
        }
        return result
    },validateRegister:function(req,res,next){
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        var role = req.body.role
        pattern=new RegExp('^[a-zA-Z0-9_]+$')
        if(pattern.test(username)&&validator.isEmail(email)&&validator.isStrongPassword(password)&&(role=='user'||role=='admin')){
            next()
        }
        else{
            console.log('failed validation')
            res.status(500);
            res.send(`{"message":"Internal Server Error"}`);
        }
       //Validation code to check register form input values
       //return response with status 500 if validation fails
    }


}

module.exports=validationFn;
