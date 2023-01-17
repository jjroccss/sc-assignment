var db = require("./databaseConfig.js");
var config = require("../config.js");
var jwt = require("jsonwebtoken");
const crypto = require("crypto");
var userDB = {
  loginUser: function (email, password, callback) {
    var conn = db.getConnection();

    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        console.log("Connected!");

        var sql = "select * from users where email = ?";
        conn.query(sql, [email], function (err, result) {
          conn.end();

          if (err) {
            console.log("Err: " + err);
            return callback(err, null, null);
          } else {
            var token = "";

            if (result.length == 1) {
              result = JSON.parse(JSON.stringify(result))[0];
              hash2 = result.password;
              salt = result.salt;
			  id=result.id;

              salt = Buffer.from(salt, "hex");
              crypto.pbkdf2(
                password,
                salt,
                100000,
                64,
                "sha512",
                (err, derivedKey) => {
                  if (err) throw err;

                  // Prints derivedKey
                hash=derivedKey.toString("hex");
                if(hash2==hash){
					token = jwt.sign({ id: id }, config.key, {
                expiresIn: 86400, //expires in 24 hrs
              });
              console.log("@@token " + token);
              return callback(null, token, [result]);
				}else{console.log("email/password does not match");
				var err2 = new Error("email/password does not match");
				err2.statusCode = 404;
				console.log(err2);
				return callback(err2, null, null);

				}
                }
              );
              
            } //if(res)
            else {
              console.log("no such email");
              var err2 = new Error("no such email");
              err2.statusCode = 404;
              console.log(err2);
              return callback(err2, null, null);
            }
          } //else
        });
      }
    });
  },

  updateUser: function (username, firstname, lastname, id, callback) {
    var conn = db.getConnection();
    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        console.log("Connected!");

        var sql =
          "update users set username = ?,firstname = ?,lastname = ? where id = ?;";

        conn.query(
          sql,
          [username, firstname, lastname, id],
          function (err, result) {
            conn.end();

            if (err) {
              console.log(err);
              return callback(err, null);
            } else {
              console.log(
                "No. of records updated successfully: " + result.affectedRows
              );
              return callback(null, result.affectedRows);
            }
          }
        );
      }
    });
  },

  addUser: function (
    username,
    email,
    password,
    profile_pic_url,
    role,
    callback
  ) {
    var conn = db.getConnection();

    conn.connect(function (err) {
      if (err) {
        console.log(err);
        return callback(err, null);
      } else {
        console.log("Connected!");
        var salt = crypto.randomBytes(16);
        crypto.pbkdf2(
          password,
          salt,
          100000,
          64,
          "sha512",
          (err, derivedKey) => {
            if (err) throw err;

            // Prints derivedKey
            password=derivedKey.toString("hex");
            salt=salt.toString('hex')
            var sql =
          "Insert into users(username,email,password,salt,profile_pic_url,role) values(?,?,?,?,?,?)";
        conn.query(
          sql,
          [username, email, password,salt, profile_pic_url, role],
          function (err, result) {
            conn.end();

            if (err) {
              console.log(err);
              return callback(err, null);
            } else {
              return callback(null, result);
            }
          }
        );
          }
        );
        

        
      }
    });
  },
};

module.exports = userDB;
