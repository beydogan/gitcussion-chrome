var Gitcussion = function(repoName){
	this.templatesUrl = chrome.extension.getURL('templates/');
	this.repoName = repoName
	this.apiBase = "https://gitcuss.herokuapp.com/";
	this.repoUrl = this.apiBase + "r/" + this.repoName;

	if(repoName == window.location.pathname.substr(1)){
		this.setup();
	}
}

Gitcussion.prototype.setup = function(){
	this.setupHandlebars();
	this.setupGitcussionBox();
}

Gitcussion.prototype.run = function(){
    this.loadData();
}

Gitcussion.prototype.loadData = function(){
	var _this = this;
	$.ajax({
		url: this.repoUrl,
		success: function(data) {
			_this.parseData(data);
		},
		beforeSend: function (request)
        {
            request.setRequestHeader("Content-Type", "application/json");
        },
	});
}

Gitcussion.prototype.parseData = function(data){
	$("#gitcussion").html(this.addGitcussionBox(data));
	this.setBindings();
}

Gitcussion.prototype.setupGitcussionBox = function(){
	$("#readme").parent().parent().parent().after("<div id=gitcussion>Gitcussion is loading..</div>");
	this.addLoadingGif();
}

Gitcussion.prototype.setupHandlebars = function(){
	Handlebars.templatesUrl = this.templatesUrl;

	Handlebars.getTemplate = function(name) {
        if (Handlebars.templates === undefined || Handlebars.templates[name] === undefined) {
            $.ajax({
                url : this.templatesUrl + name + '.html',
                datatype: 'text/javascript',
                success : function(response, status, jqXHR) {
                    if (Handlebars.templates === undefined) {
                        Handlebars.templates = {};
                    }
                    Handlebars.templates[name] = Handlebars.compile(response);
                },
                async : false
            });
        }
        return Handlebars.templates[name];
    };
	Handlebars.registerPartial("summary", Handlebars.getTemplate('summary'));
  this.registerHandlebarsHelpers();
}

Gitcussion.prototype.registerHandlebarsHelpers = function(){
    Handlebars.registerHelper('parse-comment', function(options) {
        str = options.fn(this);
        str = str.replace(/(^|\W+)\@([\w\-]+)/gm,'$1<a href="http://github.com/$2" class="user-mention" target="_blank">@$2</a>');
        return str
    });
}

Gitcussion.prototype.addGitcussionBox = function (repo){
	var template = Handlebars.getTemplate('gitcussion_box');
	Handlebars.registerPartial("comment", Handlebars.getTemplate('comment'));
	var context = {repo: repo};
	var html = template(context);
	return html
};

Gitcussion.prototype.setBindings = function(){
	$("#gitcussion").on("click", "h1", function(){
		$("#gitcussion > article").slideToggle();
		$(this).toggleClass("collapsed");
		$(this).find("span").toggleClass("octicon-triangle-down");
		$(this).find("span").toggleClass("octicon-triangle-up");
	});

	$("#gitcussion").find(".gitcussion-actions").find("li a").click(function(e){
		e.preventDefault();
	})

}
Gitcussion.prototype.addLoadingGif = function(){
	var gifUrl = "https://assets-cdn.github.com/images/spinners/octocat-spinner-128.gif"
	var div = $('<div />',{ class: "text-center" });
	var img = $('<img />',{ src: gifUrl});
	div.html(img)
	$('#gitcussion').html(div)
}
