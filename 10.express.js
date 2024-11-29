// Import modul Express, yang digunakan untuk membuat server
const express = require("express");

// Import modul File System (fs) untuk membaca file JSON
const fs = require('fs');

// Inisialisasi aplikasi Express
const app = express();

// Tentukan port untuk server berjalan
const port = 3000;

// Mengatur view engine menjadi "ejs" untuk rendering template EJS
app.set("view engine", "ejs");

// Rute untuk halaman utama
app.get("/", (req, res) => {
    // res.sendFile(__dirname + '/views/index.html'); // Kode lama untuk mengirim file HTML statis

    // Variabel `name` yang berisi string "Harry"
    const name = "Harry";

    // Render file "index.ejs" dan mengirim variabel `name` ke template
    res.render("index", { name });
});

// Rute untuk halaman kontak
app.get("/contact", (req, res) => {
    // res.sendFile(__dirname + '/views/contact.html'); // Kode lama untuk mengirim file HTML statis

    // Komentar kode untuk daftar kontak manual
    // cont = [
    //     {
    //         name : "Harry",
    //         phone : "081322343345"
    //     },{
    //         name : "Rafli",
    //         phone : "081322343346"
    //     },{
    //         name : "Yusron",
    //         phone : "081322343347"
    //     },{
    //         name : "Hafidz",
    //         phone : "081322343348"
    //     },
    // ]

    // Membaca file JSON "contacts.json" yang berisi data kontak
    // Menggunakan metode `readFileSync` untuk membaca file secara sinkron
    const cont = JSON.parse(fs.readFileSync("data/contacts.json", "utf-8"));

    // Render file "contact.ejs" dan mengirimkan data kontak (`cont`) ke template
    res.render("contact", { cont });
});

// Rute untuk halaman "about"
app.get("/about", (req, res) => {
    // res.sendFile(__dirname + '/views/about.html'); // Kode lama untuk mengirim file HTML statis

    // Render file "about.ejs"
    res.render("about");
});

// Middleware untuk menangani rute yang tidak ditemukan (404)
app.use((req, res) => {
    // Mengembalikan status 404 dengan pesan HTML sederhana
    res.status(404).send("<h1>404 : Page Tidak Ditemukan</h1>");
});

// Menjalankan server pada port yang ditentukan
app.listen(port, () => {
    // Menampilkan pesan di konsol saat server berjalan
    console.log(`Server Is Running On Port ${port}`);
});
