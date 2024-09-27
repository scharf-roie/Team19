let userBox = document.querySelector("input.username");
let passBox = document.querySelector("input.password");
let login = document.querySelector("button");

let username = "none";
let password = "none";

function getCreds()
{
    username = userBox.value;
    password = passBox.value;

    let para = document.createElement("p");
    para.textContent = `Your username is ${username} and your password is ${password}`;
    document.querySelector("body").appendChild(para);

    let data = new FormData();
    data.append("user", username);
    data.append("password", password);



    const xhr = new XMLHttpRequest();

    function handleEvent(e) {
        console.log(`${e.type}: ${e.loaded} bytes transferred\n`);
    }

    xhr.addEventListener('loadstart', handleEvent);
    xhr.addEventListener('load', handleEvent);
    xhr.addEventListener('loadend', handleEvent);
    xhr.addEventListener('progress', handleEvent);
    xhr.addEventListener('error', handleEvent);

    xhr.open("POST", "mongodb+srv://roie-scharf:StudyUp@studyup.sceg5zs.mongodb.net/?retryWrites=true&w=majorityPORT=8888", true);
    
    xhr.onload = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
          console.log(data);
        } else {
          console.log(`Error: ${xhr.status}`);
        }
    };
    xhr.send(data);
}

login.addEventListener('click', getCreds);

