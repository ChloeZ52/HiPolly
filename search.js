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

function getQueryVariable() {
  var query = window.location.search.substring(1);
  var vari = query.split("&")[0].split("=")[1];
  console.log('query: ' + vari);
  return vari;
} 

function postFormat(title, email, username_email) {
    if (email == username_email) {
      console.log(email + " " + username_email + ' you');
      post = '<div class=\"col-lg-6\" style=\"margin: 5px\" ><h2 style=\"display:inline; margin: 5px\">' + title + "</h2><span class=\"badge badge-info badge-pill\">you</span></br></br><button class=\"btn btn-secondary\" onclick=\"{location.href=\'mysearch.html?title=" + title + "&email=" + email + "\'}\">Listen &raquo;</button></div>";
    }
    else {
      console.log(email + " " + username_email + ' not you');
      post = '<div class=\"col-lg-6\" style=\"margin: 5px\" ><h2 style=\"display:inline; margin: 5px\">' + title + "</h2></br></br><button class=\"btn btn-secondary\" onclick=\"{location.href=\'mysearch.html?title=" + title + "&email=" + email + "\'}\">Listen &raquo;</button></div>";
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
                      var usernameShow = document.getElementById("usernameShow");
                      usernameShow.innerHTML = '<button type="button" class="btn btn-outline-light my-2 my-sm-0" onclick=\"{location.href=\'user.html\'}\">' + username + '</button>'
                      
                      // show search result from ES
                      var API_ENDPOINT = "https://search-hipolly-3feapsk6psjha4ku6emuewk73m.us-east-1.es.amazonaws.com/";
                      $.ajax({
                            url: API_ENDPOINT + '_search/?q=' + query,
                            type: 'GET',
                            success: function (data, status, xhr) {
                                var items = data['hits']['hits'];
                                jQuery.each(items, function(i, item) {
                                  var result = item['_source'];
                                  var title = result['title'];
                                  var email = result['username_email'];
                                  $("#result").append(postFormat(title, email, username_email));
                                });
                                },
                            error: function (jqXHR, response) {
                                alert(response + " " + jqXHR['status']);
                            }
                        });
                    }
                });
              }
          });
      };
})();
