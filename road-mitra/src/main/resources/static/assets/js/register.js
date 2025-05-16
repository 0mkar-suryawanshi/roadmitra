async function handleSubmit(event) {
    event.preventDefault(); 

    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;

    const registerData = {email,name,password};

   

    const baseURl = "http://localhost:8082/addUser"
    try{
        const response = await fetch(baseURl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(registerData),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("User registered successfully:", data);
            alert("User registered successfully");
            window.location.href = "login.html";
        } else {
            const errorData = await response.json();
            console.error("Error registering user:", errorData);
            alert("Error registering user: " + errorData.message);
        }
    }
    catch (error) {
        alert("Error is occuring while calling the api")
    }
}
