var gitcussion = function(repoName){
	this.templatesUrl = chrome.extension.getURL('templates/');
	this.repoName = repoName
	this.apiBase = "https://gitcuss.herokuapp.com/";
	this.setup();
}

gitcussion.prototype.setup = function(){
	this.setupHandlebars();
	this.setupGitcussionBox();
}

gitcussion.prototype.run = function(){
    this.loadData();
}

gitcussion.prototype.loadData = function(){
	var _this = this;
	var url = this.apiBase + "r/" + this.repoName;
	$.ajax({
		url: url,
		success: function(data){
			_this.parseData(data);
		},
		beforeSend: function (request)
        {
            request.setRequestHeader("Content-Type", "application/json");
        },
	});
}

gitcussion.prototype.parseData = function(data){
	$("#gitcussion").html(this.addGitcussionBox(data));
	this.setBindings();
}

gitcussion.prototype.setupGitcussionBox = function(){
	$("#readme").after("<div id=gitcussion>Gitcussion is loading..</div>");
	this.addLoadingGif();
}

gitcussion.prototype.setupHandlebars = function(){
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

    this.registerHandlebarsHelpers();
}

gitcussion.prototype.registerHandlebarsHelpers = function(){
    Handlebars.registerHelper('parse-comment', function(options) {
        str = options.fn(this);
        str = str.replace(/(^|\W+)\@([\w\-]+)/gm,'$1<a href="http://github.com/$2" class="user-mention" target="_blank">@$2</a>');
        return str
    });
}

gitcussion.prototype.addBox = function(){
	console.log("boxbox")
}

gitcussion.prototype.addGitcussionBox = function (repo){
	var template = Handlebars.getTemplate('gitcussion_box');
	Handlebars.registerPartial("comment", Handlebars.getTemplate('comment'));
	var context = {repo: repo};
	var html    = template(context);
	return html
};

gitcussion.prototype.setBindings = function(){
	$("#gitcussion").on("click", "h1", function(){
		$("#gitcussion > article").slideToggle();
		$(this).toggleClass("collapsed");
		$(this).find("span").toggleClass("octicon-triangle-down");
		$(this).find("span").toggleClass("octicon-triangle-up");
	});
}

gitcussion.prototype.addLoadingGif = function(){
	var gifUrl = "https://assets-cdn.github.com/images/spinners/octocat-spinner-128.gif"
	var img = $('<img />',{ src: gifUrl});
	$('#gitcussion').html(img)
}