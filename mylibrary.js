// get and display the username

var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
var poolData = {
        UserPoolId : 'us-east-1_kvqCrGsdX', // Your user pool id here
        ClientId : 'acdtivi8ll9t4ce0nm8urlqj6' // Your client id here
    };
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

var username = ""
var username_email = ""

function postFormat(heading, property) {
      post = "<div class=\"col\" style=\"margin: 5px\"><h2 style=\"display:inline; margin: 5px\">" 
              + heading + "</h2><span class=\"badge badge-info badge-pill\">" + property + "</span></br></br><button class=\"btn btn-secondary\">Listen &raquo;</button></div>";
        return post;
    }

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

                cognitoUser.getUserAttributes(function(err, attributes) {
                    if (err) {
                        alert(err.message || JSON.stringify(err));
                    return;
                    } 
                    else {
                      username_email = attributes[3].getValue();
                      username = attributes[2].getValue();
                      var usernameShow = document.getElementById("usernameShow");
                      usernameShow.innerHTML = '<button type="button" class="btn btn-outline-light my-2 my-sm-0" onclick=\"{location.href=\'user.html\'}\">' + username + '</button>'
                      
                      var API_ENDPOINT = "https://b0z7fvnl9c.execute-api.us-east-1.amazonaws.com/dev/"

                      console.log("email: " + username_email);
                      $.ajax({
                            url: API_ENDPOINT + '?username_email=' + username_email,
                            type: 'GET',
                            success: function (response, status, xhr) {
                                jQuery.each(response, function(i, data) {
                                  $("#posts").append(postFormat(data['title'], data['property']));
                                });
                            },
                            error: function (jqXHR, response) {
                                alert(response);
                            }
                        });
                    }
                });
              }
          });
      };
})();