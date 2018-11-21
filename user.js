var API_ENDPOINT = "https://b0z7fvnl9c.execute-api.us-east-1.amazonaws.com/dev"

function postFormat(heading, text) {
	post = '<div class="col-md-4"><h2>\
							' + heading + "</h2><p>" + text + '</p> \
            <p><a class="btn btn-secondary" href="#" role="button">Listen &raquo;</a></p></div>';
    return post;
}

$("#showPosts").click(function () {
    var postId = "*";
    $("#showPosts").hide();

	$.ajax({
				url: API_ENDPOINT + '?postId='+postId,
				type: 'GET',
				success: function (response) {

	        jQuery.each(response, function(i,data) {

						$("#posts").append(postFormat(data['title'], data['text']));
	        });
				},
				error: function () {
						alert("error");
				}
		});
				
});


document.getElementById("sayButton").onclick = function(){

	var inputData = {
		"voice": $('#voiceSelected option:selected').val(),
		"title": $('#title').val(),
		"text" : $('#postText').val()
	};

	$.ajax({
	      url: API_ENDPOINT,
	      type: 'POST',
	      crossDomain: true,
	      data:  JSON.stringify(inputData)  ,
	      contentType: 'application/json; charset=utf-8',
	      success: function (response) {
					//$("#postCreated").load('New posts created!');
					alert("Congratulations, you have successfully created a new file!");
	      },
	      error: function () {
	          alert("error");
	      }
	  });
}
