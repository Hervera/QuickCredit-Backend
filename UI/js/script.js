function toggleRightMenu() {
    document.getElementById("right-menu").classList.toggle("toggle-class");
    // document.getElementById("down").style.transform = "rotate(-135deg)";
}

function toggleLeftMenu() {
  document.getElementById("aside").classList.toggle("toggle-aside");
  document.getElementById("content").classList.toggle("toggle-content");
}

if(screen.width < 700) {//get the screen width
  document.getElementById("aside").classList.toggle("toggle-aside");
  document.getElementById("content").classList.toggle("toggle-content");
}


var loginForm = document.getElementById('loginForm');
loginForm.addEventListener('submit', function(e) {
	
	var admin = document.getElementById("email").value,
	password = document.getElementById("password").value;

	if(admin == "admin@quickcredit.com" && password == "secret"){
		window.location.href = "admin/dashboard.html";
	}
	else{
		window.location.href = "client/account.html";
	}

	e.preventDefault();
}, true);


function myFunction(e) {
  var elems = document.querySelectorAll(".active");
  [].forEach.call(elems, function(el) {
    el.classList.remove("active");
  });
  e.target.className = "active";
}
