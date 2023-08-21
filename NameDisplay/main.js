function UpdateName(){
    var NameInput = document.getElementById("NameInput")
    var NameOutText = document.getElementById("InName")
    NameOutText.innerText = NameInput.value
    console.log(NameInput.value);
}