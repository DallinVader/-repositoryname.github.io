function UpdateName(){
    var NameInput = document.getElementById("NameInput")
    var NameOutText = document.getElementById("InName")
    var HelloThere = document.getElementById("HelloThere")
    HelloThere.innerText = "Hello There"
    NameOutText.innerText = NameInput.value
    console.log(NameInput.value);
}