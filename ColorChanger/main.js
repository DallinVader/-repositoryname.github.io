var CurrentColor;
var StyleSheetForJS = document.body;
var Speed = 1000;
var intervalId;

function OnStart(){
    
}

function RandomSliderFunc(){
    StyleSheetForJS.style.backgroundImage = "none";
    CurrentColor = "#" + (Math.random() * 16777215 | 0).toString(16);
    StyleSheetForJS.style.backgroundColor = CurrentColor;

    var SliderSpeed = document.getElementById("SpeedSlider");
    Speed = SliderSpeed.value;

    clearInterval(intervalId);
    intervalId = setInterval(RandomSliderFunc, Speed);
}
