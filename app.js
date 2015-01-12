var apiBase = "https://gitcuss.herokuapp.com/";
var repoName = $('meta[property="og:title"]').attr("content");
var templatesUrl = chrome.extension.getURL('templates/');

$(document).ready(function(){



Handlebars.getTemplate = function(name) {
    if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
        $.ajax({
            url : templatesUrl + name + '.html',
            datatype: 'text/javascript',
            success : function(response, status, jqXHR) {
                if (Handlebars.templates === undefined) {
                    Handlebars.templates = {};
                }
                //Handlebars.templates[name] = Handlebars.compile(jqXHR.responseText);
                Handlebars.templates[name] = Handlebars.compile(response);
            },
            async : false
        });
    }
    return Handlebars.templates[name];
};

var addGitcussionBox = function (repo){
	var template = Handlebars.getTemplate('gitcussion_box');
	Handlebars.registerPartial("comment", Handlebars.getTemplate('comment'));
	var context = {repo: repo};
	var html    = template(context);
	return html
};

var setBindings = function(){
	$("#gitcussion").on("click", "h1", function(){
		$("#gitcussion > article").slideToggle();
		$(this).toggleClass("collapsed");
		$(this).find("span").toggleClass("octicon-triangle-down");
		$(this).find("span").toggleClass("octicon-triangle-up");
	});
}


var xhr = new XMLHttpRequest();
var resp;
xhr.open("GET", apiBase + "/r/" + repoName, true);
xhr.setRequestHeader("Content-Type", "application/json");

xhr.onload = function () {
    resp = JSON.parse(xhr.responseText);
    console.log(resp);
    $("#readme").after(addGitcussionBox(resp));
    setBindings();
}
xhr.send();

	

})

