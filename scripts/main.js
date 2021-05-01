"use strict"

const publicKey = "BAYe4RIspczWYaIH6kXnCe1NvTfHBJdS5S-egM6s8hZDq4ZUunyg70I71xtdXsr5pbfpl641cT4o6L7aH9Rzplg";

let isSubscribed = false;
let swRegistration = null;

function toUInt8(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    var bin_string = window.atob(base64);
    console.log(bin_string);
}

if ("serviceWorker" in navigator && "PushManager" in window) {
    console.log("Supported");

    navigator.serviceWorker.register("sw.js")
    .then(function(swReg) {
        console.log("Registered", swReg);

        swRegistration = swReg;

        getPermission();
    })
    .catch(function(error) {
        console.log("Service Worker error", error);
    });
}

function getPermission() {
    toUInt8(publicKey);

    swRegistration.pushManager.getSubscription()
    .then(function(subscription) {
        isSubscribed = !(subscription === null);

        if (!isSubscribed) {
            document.getElementById("main-section").hidden = true;
            document.getElementById("request-perm").hidden = false;
        }
    });
}