'use strict';

var storag = undefined;

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
    chrome.extension.sendMessage({directive: event.target.classList[0], value: event.target.value, sound: event.target.dataset.for}, function                 (response) {});
}


function setEventForAllElements(request) {
    var event = request.event || "click";
    var func = request.func || function () { console.log("Are you sure ?!"); }
    var className = request.className || "";
    
    var elements = document.getElementsByClassName(className);
    for (var i = 0; i < elements.length; i++) {
        elements[i].addEventListener(event, func);
    }
    
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

function save(event) {
    chrome.extension.sendMessage({directive: "save_context"}, function(response) {
        chrome.storage.sync.set(response.context, function() {
            event.toElement.style.display = "none";
            var message = document.getElementById("message");
            message.className = response.status ? "done" : "error";
            message.style.display = "block";
            message.textContent = response.status ? "Done!" : "Error!";
            setTimeout(function () {
                document.getElementById("save_context").style.display = "block";
                document.getElementById("message").style.display = "none";
            }, 5 * 1000);
        });
    });
}

document.addEventListener('DOMContentLoaded', function () {
    initStyle();
    setEventForAllElements({
        event: "click",
        func: play,
        className: "play"
    });
       setEventForAllElements({
        event: "click",
        func: stop,
        className: "stop"
    });
    setEventForAllElements({
        event: "change",
        func: changeVolume,
        className: "range"
    });
    
    document.getElementById("save_context").addEventListener("click", save);
    
});