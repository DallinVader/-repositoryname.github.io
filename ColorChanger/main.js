var CurrentColor;
var StyleSheetForJS = document.body;

function ChangeColorOnColorPage() {
    // Generate a random color code in hexadecimal format
    CurrentColor = "#" + (Math.random() * 16777215 | 0).toString(16);
    console.log(CurrentColor);

    // Set the background color of the body
    StyleSheetForJS.style.backgroundColor = CurrentColor;

    return CurrentColor;
}
