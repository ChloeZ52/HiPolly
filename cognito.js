var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;

var username_email = ""
var password = ""
var preferred_username = ""

var poolData = {
        UserPoolId : 'us-east-1_kvqCrGsdX', // Your user pool id here
        ClientId : 'acdtivi8ll9t4ce0nm8urlqj6' // Your client id here
    };

var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
$("#signoutBtn").hide();

(function () {
	var cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
          cognitoUser.getSession(function(err, session) {
              if (err) {
                  alert(err.message || JSON.stringify(err));
                  return;
              }
              else {
                console.log('session validity: ' + session.isValid());
                $('#loginBtn').hide();
                $('#signupBtn').hide();
              }
          });

                cognitoUser.getUserAttributes(function(err, attributes) {
                    if (err) {
                        alert(err.message || JSON.stringify(err));
                    return;
                    } 
                    else {
                      username_email = attributes[3].getValue();
                      username = attributes[2].getValue();
                      $("#signoutBtn").show();
                      var usernameShow = document.getElementById("usernameShow");
                      usernameShow.innerHTML = '<button type="button" class="btn btn-outline-light my-2 my-sm-0" onclick=\"{location.href=\'user.html\'}\">' + username + '</button>'
                    }
               });
    };
})();

// user sign up
$("#signup").click(function () {

	var attributeList = [];

	var dataUsername = {
	    Name : 'preferred_username',
	    Value : $('#inputUsername').val()
	};

	preferred_username = $('#inputUsername').val()
	username_email = $('#inputEmail').val()
	password = $('#inputPassword').val()

	var attributeUsername = new AmazonCognitoIdentity.CognitoUserAttribute(dataUsername);

	attributeList.push(attributeUsername);

	userPool.signUp(username_email, password, attributeList, null, function(err, result){
    	if (err) {
        	alert(err.message || JSON.stringify(err));
        	return;
    	}
    	else {
	    	var cognitoUser = result.user;
	    	$('#signupModal').modal('hide');
	    	$('#veriModal').modal('show');
    	}
	});

   
	}
);

// user verification & authentification
$("#veri").click(function () {
	var code = $('#verificationCode').val()

	var userData = {
	    Username: username_email,
	    Pool: userPool
	}

	var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
	cognitoUser.confirmRegistration(code, true, function(err, result){
	    if (err) {
	      alert(err.message || JSON.stringify(err));
	      return;
	    }
	    else {
		    $('#veriModal').modal('hide');
		    console.log('call result: ' + result);
		    var authenticationData = {
		        Username : username_email,
		        Password : password,
			};
		    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

		    var userData = {
		        Username : username_email,
		        Pool : userPool
		    };
		    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
		    cognitoUser.authenticateUser(authenticationDetails, {
		        onSuccess: function (result) {
		            var accessToken = result.getAccessToken().getJwtToken();

					$('#loginModal').modal('hide');
		    		$('#loginBtn').hide();
		    		$('#signupBtn').hide();
		    		$("#signoutBtn").show();

		    		cognitoUser.getUserAttributes(function(err, result) {
		        		if (err) {
		            		alert(err.message || JSON.stringify(err));
		            		return;
		        		}
		        		var username = result[2].getValue();
		    			var usernameShow = document.getElementById("usernameShow");
		    			usernameShow.innerHTML = '<button type="button" class="btn btn-outline-light my-2 my-sm-0" onclick=\"{location.href=\'user.html\'}\">' + username +'</button>'
		    		});
		        },

		        onFailure: function(err) {
		            alert(err.message || JSON.stringify(err));
		        },

		    });
	    } 
	});

});

// user login
$("#login").click(function () {

	username_email = $('#inputEmailLogin').val()
	password = $('#inputPasswordLogin').val()

	var authenticationData = {
        Username : username_email,
        Password : password,
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    var userData = {
        Username : username_email,
        Pool : userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            var accessToken = result.getAccessToken().getJwtToken();

			$('#loginModal').modal('hide');
    		$('#loginBtn').hide();
    		$('#signupBtn').hide();
    		$("#signoutBtn").show();

    		cognitoUser.getUserAttributes(function(err, result) {
        		if (err) {
            		alert(err.message || JSON.stringify(err));
            		return;
        		}
        		else {
	        		var username = result[2].getValue();
	    			var usernameShow = document.getElementById("usernameShow");
	    			usernameShow.innerHTML = '<button type="button" class="btn btn-outline-light my-2 my-sm-0" onclick=\"{location.href=\'user.html\'}\">' + username +'</button>'
	    		}
    		});
        },

        onFailure: function(err) {
            alert(err.message || JSON.stringify(err));
        },

    });
   
});

$("#signoutBtn").click(function () {
	var cognitoUser = userPool.getCurrentUser();
	if (cognitoUser != null) {
          cognitoUser.signOut();
          console.log("successfully logged out!");
          window.location.replace("index.html");
        }
});








