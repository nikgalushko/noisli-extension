'use strict';
function indexOf (arr, element) {
    if (!(arr.length && (arr.length > 0))) {
        return -1;
    }
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === element) 
            return i;
    }
    
    return -1;
}

function play(event) {
    chrome.extension.sendMessage({directive: event.toElement.classList[0], sound: event.toElement.dataset.sound}, function (response) {
        var elements = document.getElementsByTagName("input");
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].type === "range") {
                if (elements[i].dataset.for === event.toElement.dataset.sound) {
                    elements[i].value = response.volume;
                    break;
                }
            }
        }
        event.toElement.style.display = "none";
        document.getElementById("stop" + "_" + event.toElement.dataset.sound).style.display = "block";
    });
}

function stop(event) {
    chrome.extension.sendMessage({directive: event.toElement.classList[0], sound: event.toElement.dataset.sound}, function (response) {
        event.toElement.style.display = "none";
        document.getElementById("play" + "_" + event.toElement.dataset.sound).style.display = "block";
    });
}

function changeVolume(event) {
    chrome.extension.sendMessage({directive: event.target.id, value: event.target.value, sound: event.target.dataset.for}, function                 (response) {});
}

function initStyle () {
    var inputElements = document.getElementsByTagName("input");
    for (var i = 0; i < inputElements.length; i++) {
        if (inputElements[i].type === "range") {
            chrome.extension.sendMessage({directive: "getCurrentVolume", forSound: inputElements[i].dataset.for}, function (response) {
                var arr = document.getElementsByTagName("input");
                for (var j = 0; j < arr.length; j++) {
                    if (arr[j].type === "range") { 
                        if (arr[j].dataset.for === response.forSound) {
                            arr[j].value = response.currentVolume;
                        }
                    }       
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initStyle();
    var elements = document.getElementsByClassName("play");
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", play);
    }
    elements = document.getElementsByClassName("stop");
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("click", stop);
    }
    elements = document.getElementsByClassName("range");
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener("change", changeVolume);
    }
});