const DebugText = document.getElementById("DebugText");

const PhoneRegex = /^[0-9]?[-. ]?\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
const EmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const AddressRegex = /\b\d+\s+[a-zA-Z0-9\s,]+\b/;
const NameRegex = /^[a-zA-Z]+$/;

let UserName = document.getElementById("Name");
let UserAddress = document.getElementById("Address");
let UserEmail = document.getElementById("Email");
let UserPhone = document.getElementById("Phone");

function SubmitToVader() {

    let CurrentUserPhone = UserPhone.value;
    let AddLongRangeCallNum = "";

    if(!NameRegex.test(UserName.value)){
        DebugText.innerText = "Name Invalid"
        return;
    }

    if(!AddressRegex.test(UserAddress.value)){
        DebugText.innerText = "Address Invalid"
        return;
    }

    if(!EmailRegex.test(UserEmail.value)){
        DebugText.innerText = "Email Invalid"
        return;
    }

    if(PhoneRegex.test(CurrentUserPhone)){
        if(CurrentUserPhone.replace(/\D/g, '').length == 11){
            CurrentUserPhone = CurrentUserPhone.substring(1);
            AddLongRangeCallNum = "1-";
        }
        if(CurrentUserPhone.replace(/\D/g, '').length == 10){
            CurrentUserPhone = CurrentUserPhone.replace(/\./g, "");
            CurrentUserPhone = CurrentUserPhone.replace(/(\(?[0-9]{3}\)?)/, "($1)");

            DebugText.innerText = AddLongRangeCallNum + CurrentUserPhone.replace(/(\(?[0-9]{3}\)?)([0-9]{3})([0-9]{4})/, "$1-$2-$3");
        }
    }
    else{
        DebugText.innerText = "Phone Invalid"
        return;
    }
}

//Load random image when the window loads.
let RandoImg = ["url(../images/Enlist.jpg)", "url(../images/StarWarsDarthVaderLift.jpg)", "url(../images/Enlist2.jpg)", "url(../images/Vader.jpg)"]
function OnWindowLoad(){
    let RandRange = Math.round(Math.random() * RandoImg.length);
    let Body = document.getElementById("bod").style.backgroundImage = RandoImg[RandRange];
}
