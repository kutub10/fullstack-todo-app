//Switch between sign in and sign up pages
document.getElementById("showSignUp").addEventListener("click", function() {
    document.getElementById("firstPage").style.display = "none";
    document.getElementById("secondPage").style.display = "block";
});

// SIGN UP Handler
document.getElementById("signUpForm").addEventListener("submit", async function(e){
    e.preventDefault();
    const data={
        username: document.getElementById("userName").value,
        email: document.getElementById("signUpEmail").value,
        password: document.getElementById("signUpPassword").value
    }
    console.log(data);
    try{
        const res = await fetch("/signup",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(data)
        });
        const result = await res.json();
        alert(result.message);
        if (res.ok) {
            document.getElementById("secondPage").style.display = "none";
            document.getElementById("firstPage").style.display = "block";
        }
    }catch(err){
        alert("Error:"+err.message);
    }
});

// // SIGN IN Handler
document.getElementById("signInForm").addEventListener("submit", async function(e){
    e.preventDefault();
    const data = {
        email: document.getElementById("signInEmail").value,
        password: document.getElementById("signInPassword").value
    };
    try{
        const res = await fetch("/signin",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(data)
        });
        const result = await res.json();
        alert(result.message);
        // You can save token to localStorage and redirect to Todo dashboard here if desired
         if (res.ok) {   // only show todo if login success
            localStorage.setItem("token",result.token);
            document.getElementById("firstPage").style.display = "none";
            document.getElementById("thirdPage").style.display = "block";
     }
    }catch(err){
        alert("Error:"+err.message);
    }
});
async function addToDo(){
    const element = document.getElementById("taskInput");
    const value =element.value.trim();
    if(value ===""){
        alert("please enter a task");
        return;
    }
    try{
        const res = await fetch("/todo",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "Authorization":localStorage.getItem("token")
            },
            body: JSON.stringify({title:value})
        });
        const result = await res.json();
        console.log(result);
        alert(result.message);

    }catch{
        alert("ERROR:"+err.message);
    }
    const newDiv = document.createElement("div");
    newDiv.className="task";

    const taskText = document.createElement("span");
    taskText.innerHTML = "&#10004; " + value;
    newDiv.appendChild(taskText);


    const deleteButt = document.createElement("button");
    deleteButt.className = "deleteBtn"; // optional styling
    deleteButt.textContent="Delete";
    newDiv.appendChild(deleteButt);
    deleteButt.onclick=function(){
        deleteToDo(newDiv);
    }

    document.getElementById("taskList").appendChild(newDiv);
    element.value="";
}
function deleteToDo(deletediv){
    deletediv.remove();
}
