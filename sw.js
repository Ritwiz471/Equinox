"use strict"

self.addEventListener("push", function(event) {
    console.log(`Pushed with "${event.data.text()}"`);

    const title = "Alert";
    const options = {
        body: "Event name",
        icon: "date-and-time-schedule.jpg"
    }

    event.waitUntil(self.registration.showNotification(title, options));
});