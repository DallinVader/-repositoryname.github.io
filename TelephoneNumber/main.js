function SubmitToVader() {
    let UserName = document.getElementById("Name").value;
    let UserAddress = document.getElementById("Address").value;
    let UserEmail = document.getElementById("Email").value;
    let UserPhone = document.getElementById("Phone").value;

    console.log(UserName, UserAddress, UserEmail, UserPhone);
}

let RandoImg = ["url(../images/Enlist.jpg)", "url(../images/StarWarsDarthVaderLift.jpg)", "url(../images/Enlist2.jpg)", "url(../images/Vader.jpg)"]
function OnWindowLoad(){
    let RandRange = Math.round(Math.random() * RandoImg.length);
    let Body = document.getElementById("bod").style.backgroundImage = RandoImg[RandRange];

    console.log(RandRange)
}
