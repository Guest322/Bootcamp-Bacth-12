const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get("/contact", (req, res) => {
    res.sendFile(__dirname + '/views/contact.html');
});

app.get("/about", (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});

app.use((req, res) => {
    res.status(404).send("<h1>404 : Page Tidak Ditemukan</h1>");
});

app.listen(port, () => {
    console.log(`Server Is Running On Port ${port}`);
});
