// Variables
const nameText = "Dallin Whitaker";
const classInfoText = "Web Design /Web App Development 2 (TTA)";


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
}