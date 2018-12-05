$("#signoutBtn").hide();

// get and display the username

var CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
var poolData = {
        UserPoolId : 'us-east-1_kvqCrGsdX', // Your user pool id here
        ClientId : 'acdtivi8ll9t4ce0nm8urlqj6' // Your client id here
    };
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

var username = ""
var username_email = ""

var title = getQueryVariable();

function getQueryVariable() {
  var query = window.location.search.substring(1);
  var vari = query.split("&")[0].split("=")[1];
  console.log('title: ' + vari);
  return vari;
} 


function postFormat(heading, text, url) {
    var player = "<div style='margin: 0 auto; display: table;'><audio controls><source src='" + url + "' type='audio/mpeg'></audio></div>"
    post = '<h1 align="center">' + heading + "</h1></br>" + player + "</br><p>" + text + "</p>";
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
                      
                      // API Gateway: HiPolly-GetItem
                      var API_ENDPOINT = "https://t79ovhlh7h.execute-api.us-east-1.amazonaws.com/dev"

                      console.log("email: " + username_email);
                      $.ajax({
                            url: API_ENDPOINT + '?username_email=' + username_email + '&title=' + title,
                            type: 'GET',
                            success: function (data, status, xhr) {
                                console.log(data[0]['url']);
                                var post = document.getElementById("post");
                                post.innerHTML = postFormat(data[0]['title'], data[0]['text'], data[0]['url']);
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

$("#signoutBtn").click(function () {
  var cognitoUser = userPool.getCurrentUser();
  if (cognitoUser != null) {
          cognitoUser.signOut();
          console.log("successfully logged out!");
          window.location.replace("index.html");
        }
});