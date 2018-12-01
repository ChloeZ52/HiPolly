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

// input text and create a new item in DynamoDB
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


//  upload text file and create a new item in DynamoDB
document.getElementById('textFile').addEventListener('change', getFile)

function getFile(event) {
	const input = event.target
    if ('files' in input && input.files.length > 0) {
	  placeFileContent(
      document.getElementById('content-target'),
      input.files[0])
    }
}

function placeFileContent(target, file) {
	readFileContent(file).then(content => {
  	target.value = content
  }).catch(error => console.log(error))
}

function readFileContent(file) {
	const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = event => resolve(event.target.result)
    reader.onerror = error => reject(error)
    reader.readAsText(file)
  })
}

document.getElementById("uploadButton").onclick = function(){

	var inputData = {
		"voice": $('#voiceSelected_upload option:selected').val(),
		"title": $('#title_upload').val(),
		"text" : $('#content-target').val(),
		"username_email": username_email,
		"property": $('#propertySelected_upload option:selected').val()
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











