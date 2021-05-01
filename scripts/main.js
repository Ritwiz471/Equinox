"use strict"

const publicKey = "BAYe4RIspczWYaIH6kXnCe1NvTfHBJdS5S-egM6s8hZDq4ZUunyg70I71xtdXsr5pbfpl641cT4o6L7aH9Rzplg";
const privateKey = "QXmU6IYGY10WxRuFk-TyF1ejQcIa26xoiDOgTN7L3eA";
let sub = null;

let isSubscribed = false;
let swRegistration = null;

function toUInt8(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
  .replace(/\-/g, '+')
  .replace(/_/g, '/');
  const binString = window.atob(base64);
  const output = new Uint8Array(binString.length);

  for (let i = 0; i < binString.length; ++i) {
    output[i] = binString.charCodeAt(i);
  }
  return output;
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
  subscribe();

  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);
    
    updateSubOnServer(subscription);
    console.log(isSubscribed);

    updateUI();
  });
}

function updateUI() {
  if (!isSubscribed) {
    document.getElementById("submit-button").disabled = true;
  } else {
    document.getElementById("submit-button").disabled = false;
  }
}

function subscribe() {
  const serverKey = toUInt8(publicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: serverKey
  })
  .then(function(subscription) {
    console.log("Subscribed");
    updateSubOnServer(subscription);
    isSubscribed = true;

    updateUI();
  })
  .catch(function(err) {
    console.log("Failed to Subscribe", err);

    updateUI();
  })
}

function updateSubOnServer(subscription) {
  sub = JSON.stringify(subscription);
}

function pushNot(name) {
  fetch('/api/send-push-msg', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      subscription: JSON.parse(sub),
      data: name,
      applicationKeys: {
        public: publicKey,
        private: privateKey,
      }
    })
  })
  .catch(function(err) {
    console.log("No subscription available");
  })
  .then((response) => {
    if (response.status !== 200) {
      return response.text()
      .then((responseText) => {
        throw new Error(responseText);
      });
    }
  });
}