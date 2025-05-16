async function handleSubmit(event) {
    event.preventDefault(); 

    const userId = document.getElementById("userId").value;
    const password = document.getElementById("password").value;

    const loginData = {userId,password};

    console.log("this is your data "+loginData.userId+" "+loginData.password);

    const baseURl = "http://localhost:8082/loginUser"
    try{
        const response = await fetch(baseURl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });

      const data = await response.json();
      console.log(data);

      if(data){
        window.location.href = "/index.html"
      }else{
        alert("Invalid credentials,please try again");
      }
    }
    catch (error) {
        alert("Error is occuring while calling the api")
    }
}
