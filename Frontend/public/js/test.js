var userData = localStorage.getItem('userData');
var token = localStorage.getItem('token');

if (userData==null || token==null){
    location.assign("http://localhost:3001/loginPage.html")
}
else{
    $.ajax({
    headers: { "authorization": "Bearer " + token.toString() },
    url: "http://localhost:8081/user/listing/",//supply the api url
    dataType: "json",
    type: "GET",///supply the method
    contentType: "application/json",//standard
    complete: function (data, textStatus, xhr) {//retrieve some data back from server
        code=data.status
        if (code==403){
            location.assign("http://localhost:3001/loginPage.html")
        }
        
    }
})}

