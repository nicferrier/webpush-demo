const path = require("path");
const webpush = require('web-push');
const express = require("express");
const bodyParser = require("body-parser");

// VAPID keys should only be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();

// webpush.setGCMAPIKey('<Your GCM API Key Here>');

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const app = express();

app.use("/www", express.static(path.join(__dirname, "www")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "demo.html"));
});

app.get("/pubkey", (req, res) => {
    res.json(vapidKeys.publicKey);
});

app.post("/subscribe", bodyParser.json(), (req, res) => {
    const subscription = req.body
    res.status(201).json({});

    const payload = JSON.stringify({
        title: 'Push notifications with Service Workers',
    });

    webpush.sendNotification(subscription, payload)
        .catch(error => console.error("send notify error:", error));
});

const listener = app.listen(8091, function () {
    console.log("listening on", listener.address().port);
});

// End
