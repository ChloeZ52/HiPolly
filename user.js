var API_ENDPOINT = "https://b0z7fvnl9c.execute-api.us-east-1.amazonaws.com/dev/"
var username_email = ""
// get and display the username

var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
var poolData = {
        UserPoolId : 'us-east-1_kvqCrGsdX', // Your user pool id here
        ClientId : 'acdtivi8ll9t4ce0nm8urlqj6' // Your client id here
    };
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

var cognitoUser = userPool.getCurrentUser();
if (cognitoUser != null) {
    cognitoUser.getSession(function(err, session) {
        if (err) {
            alert(err.message || JSON.stringify(err));
            return;
        }
        else {
        	console.log('session validity: ' + session.isValid());
    	}
    });
    $('#loginBtn').hide();
	$('#signupBtn').hide();

    cognitoUser.getUserAttributes(function(err, attributes) {
        if (err) {
            alert(err.message || JSON.stringify(err));
    		return;
        } else {
        	username_email = attributes[3].getValue();
    		console.log("email: " + username_email);
        	var username = attributes[2].getValue();
			var usernameShow = document.getElementById("usernameShow");
			usernameShow.innerHTML = '<button type="button" class="btn btn-outline-light my-2 my-sm-0" onclick=\"{location.href=\'user.html\'}\">' + username + '</button>'
        }
    });
};

// create a new item in DynamoDB
document.getElementById("sayButton").onclick = function(){

	var inputData = {
		"voice": $('#voiceSelected option:selected').val(),
		"title": $('#title').val(),
		"text" : $('#postText').val(),
		"username_email": username_email,
		"property": $('#propertySelected option:selected').val()
	};

	$.ajax({
	      url: API_ENDPOINT,
	      type: 'POST',
	      crossDomain: true,
	      data:  JSON.stringify(inputData)  ,
	      contentType: 'application/json; charset=utf-8',
	      success: function (data, status, xhr) {
					alert("Congratulations, you have created a new item!\nPlease check in \"My library\"");
	      },
	      error: function (jqXHR, response) {
	      	var statusCode = jqXHR.status;
	      	if (statusCode == 444) {
	      		alert("This title has already exists, please choose a new one.")
	      	}
	      }
	  });
}











