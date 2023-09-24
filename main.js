// Variables
const nameText = "Dallin Whitaker";
const classInfoText = "Web Design /Web App Development 2 (TTA)";

let Num1;
let Num2;

let Result;

// Opens a tab to ColorChange site
function ChangePageToColorChanger(){
    window.open("ColorChanger")
}

// Opens a tab to NameDisplay site
function ChangePageToNameDisplay(){
    console.log("Change Page");
    window.open("NameDisplay")
}

// Opens tab to Week 2 java main.html
function ChangePageToWeek2Java(){
    console.log("Change Page");
    window.open("Week2JavaScript")
}

//OnPageLoaded function is triggerd by onload="OnPageLoaded()"
function OnPageLoaded(){
    document.getElementById("name").innerHTML = nameText;
    document.getElementById("classInfo").innerHTML = classInfoText;
    console.log("function OnPageLoaded() ran On " + '"' + document.title + '"' + " Page")

    Num1 = document.getElementById("FirstNumberCal").value = Math.floor(Math.random() * (-100 - 100) + 100);
    Num2 = document.getElementById("SecondNumberCal").value = Math.floor(Math.random() * (-100 - 100) + 100);

}

function CalculateCal(){
    Num1 = document.getElementById("FirstNumberCal").value;
    Num2 = document.getElementById("SecondNumberCal").value;
    let Cal = document.getElementById("MES").value;

    switch(Cal){
        case "-":
            Result = Num1 - Num2;
            break
        case "+":
            Result = parseFloat(Num1) + parseFloat(Num2);
            break
        case "/":
            Result = Num1 / Num2;
            break
        case "*":
            Result = Num1 * Num2;
            break
    }


    document.getElementById("OutputCalText").innerHTML = Result;
}