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

var query = getQueryVariable();
var title = query[0];
var email = query[1];

var data;

function getQueryVariable() {
  var query = window.location.search.substring(1);
  var vari = [];
  vari.push(query.split("&")[0].split("=")[1]); // title
  vari.push(query.split("&")[1].split("=")[1]); // email
  console.log('query: ' + vari);
  return vari;
} 

function postFormat(heading, text, url, email, username_email) {
    var player = "<div style='margin: 0 auto; display: table;'><audio controls><source src='" + url + "' type='audio/mpeg'></audio></div>"
    if (email == username_email) {
      post = '<h1 align="center">' + heading + "</h1></br>" + player + "</br><p>" + text + "</p>";
    }
    else {
      post = '<h1 align="center">' + heading + "<button type=\"button\" class=\"btn btn-primary btn-sm\" style=\"margin: 5px;\" onclick=\"save()\">save</button></h1></br>" + player + "</br><p>" + text + "</p>";
    }
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
                      
                      // show search result from DB
                      var API_ENDPOINT = "https://t79ovhlh7h.execute-api.us-east-1.amazonaws.com/dev";
                      $.ajax({
                            url: API_ENDPOINT + '?username_email=' + email + '&title=' + title,
                            type: 'GET',
                            success: function (response, status, xhr) {
                                data = response[0];
                                console.log(data['url']);
                                var post = document.getElementById("result");
                                post.innerHTML = postFormat(data['title'], data['text'], data['url'], data['username_email'], username_email);
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

// save (input) to DB
function save(){
  var API_ENDPOINT = "https://b0z7fvnl9c.execute-api.us-east-1.amazonaws.com/dev/"

  var inputData = {
    "voice": data['voice'],
    "title": data['title'],
    "text" : data['text'],
    "username_email": username_email,
    "property": "private"
  };

  $.ajax({
        url: API_ENDPOINT,
        type: 'POST',
        crossDomain: true,
        data:  JSON.stringify(inputData)  ,
        contentType: 'application/json; charset=utf-8',
        success: function (data, status, xhr) {
          alert("Congratulations, you have saved a new item!\nPlease check in \"My library\"");
        },
        error: function (jqXHR, response) {
          var statusCode = jqXHR.status;
          if (statusCode == 444) {
            alert("This title has already exists, please choose a new one.")
          }
        }
    });
  $('#save').hide();
}

$("#signoutBtn").click(function () {
  var cognitoUser = userPool.getCurrentUser();
  if (cognitoUser != null) {
          cognitoUser.signOut();
          console.log("successfully logged out!");
          window.location.replace("index.html");
        }
});