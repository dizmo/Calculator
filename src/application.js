//= require Main

function showFront() {
    dizmo.showFront();
}

var events = {};

document.addEventListener('dizmoready', function() {
    window.MAIN = new Calculator.Main();
});
