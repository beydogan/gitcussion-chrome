var repoName = $('meta[property="og:title"]').attr("content");

$(document).ready(function(){
    var p = new gitcussion(repoName);
    p.run();  
})

