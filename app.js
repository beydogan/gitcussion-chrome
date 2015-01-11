var xhr = new XMLHttpRequest();
var resp;
xhr.open("GET", "http://localhost:3000/r/ruby/ruby", true);
xhr.setRequestHeader("Content-Type", "application/json");

xhr.onload = function () {
    resp = JSON.parse(xhr.responseText);
    console.log(resp);
}
xhr.send();