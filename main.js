"use strict"

let isSubscribed = false;
let swRegistration = null;

if ("serviceWorker" in navigator && "PushManager" in window) {
    console.log("Supported");

    navigator.serviceWorker.register("sw.js")
    .then(function(swReg) {
        console.log("Service Worker registered", swReg);

        swRegistration = swReg;
    })
    .catch(function(error) {
        console.log("Service Worker error", error);
    });
}