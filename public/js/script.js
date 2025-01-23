const userContainer = document.getElementById("users-container");

const fetchUsers = async ()=>{
    try{
        const response = await fetch("/people");
        if(!response.ok){
            throw new Error("Failed to get users");
        }

        const users = await response.json();
        console.log(users);

        userContainer.innerHTML = "";

        users.forEach((user) => {
            const userDiv = document.createElement("div");
            userDiv.className = "user";
            userDiv.innerHTML = `${user.firstName} ${user.lastName} Email: ${user.email}`;
            userContainer.appendChild(userDiv);
        });
    }catch(error){
        console.error("Error: ", error);
        userContainer.innerHTML = "<p style='color:red'>Failed to get users</p>";
    }
}

fetchUsers();