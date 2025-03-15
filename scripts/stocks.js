fetch("navbar.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-container").innerHTML = data;
            console.log("Navbar loaded");
        })
        .catch(error => console.error("Error loading navbar:", error));