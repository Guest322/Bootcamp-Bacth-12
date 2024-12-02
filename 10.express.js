// Import modul Express, yang digunakan untuk membuat server
const express = require("express");

// Import modul express-ejs-layouts, yang digunakan untuk mendukung sistem layout pada template EJS
const expressLayouts = require('express-ejs-layouts');

// Import modul Morgan, yang digunakan untuk logging request ke server
const morgan = require("morgan");

// Import fungsi-fungsi custom dari file func.js
const func = require("./src/func");

// Import modul File System (fs) untuk membaca dan menulis file JSON
const fs = require('fs');

// Modul bawaan Node.js untuk mengakses variabel global (tidak digunakan di sini)
const { title } = require("process");

// Inisialisasi aplikasi Express
const app = express();

// Tentukan port untuk server berjalan
const port = 3000;

// Middleware Morgan untuk mencatat setiap request yang masuk
app.use(morgan("dev"));

// Atur view engine menjadi EJS untuk merender halaman HTML
app.set("view engine", "ejs");

// Gunakan express-ejs-layouts untuk mendukung penggunaan layout EJS
app.use(expressLayouts);

// Atur file layout default
app.set("layout", "layouts/layout");

// Middleware untuk mengatur folder public sebagai tempat penyimpanan file statis
app.use(express.static("public"));

// Middleware untuk mencatat waktu request masuk
app.use((req, res, next) => {
    console.log('Time:', Date.now())
    next();
});

// Middleware untuk parsing data form (urlencoded)
app.use(express.urlencoded({ extended: true }));

// Rute untuk halaman utama
app.get("/", (req, res) => {
    const name = "Harry"; // Variabel untuk menyimpan nama
    res.render("index", { name, title: "Home" }); // Render halaman index dengan data nama dan title
});

// Rute untuk halaman kontak
app.get("/contact", (req, res) => {
    // Membaca data kontak dari file JSON
    const cont = JSON.parse(fs.readFileSync("data/contacts.json", "utf-8"));

    // Render halaman kontak dengan data kontak dan title
    res.render("contact", { cont, title: "Contact" });
});

// Rute untuk halaman tambah data
app.get("/dataAdd", (req, res) => {
    res.render("dataAdd", { title: "Tambah Data" }); // Render halaman tambah data
});

// Rute untuk menyimpan data baru
app.post("/addData", (req, res) => {
    const { name, phone, mail } = req.body; // Destruktur data dari form
    func.newContact(req.body); // Menyimpan data menggunakan fungsi custom
    res.redirect("contact"); // Redirect ke halaman kontak
});

// Rute untuk halaman update data
app.get("/dataUpdate/:name", (req, res) => {
    const name = req.params.name; // Ambil parameter nama dari URL
    const contacts = func.readContact(); // Membaca semua kontak
    const contact = contacts.find(contact => contact.name.toLowerCase() === name.toLowerCase()); // Cari kontak berdasarkan nama

    if (!contact) {
        return res.status(404).send("Contact not found."); // Jika tidak ditemukan, kirim pesan 404
    }

    res.render("dataUpdate", { contact, title: "Update Contact" }); // Render halaman update dengan data kontak
});

// Rute untuk menyimpan perubahan data
app.post("/dataUpdate/:name", (req, res) => {
    const oldName = req.params.name; // Nama lama (sebelum diupdate)
    const { name, phone, mail } = req.body; // Data baru dari form
    func.updateContact({ name: oldName }, { name, phone, mail }); // Update data menggunakan fungsi custom
    res.redirect("/contact"); // Redirect ke halaman kontak
});

// Rute untuk menghapus data kontak
app.post("/delete/:name", (req, res) => {
    const name = req.params.name; // Ambil nama dari parameter URL
    func.deleteContact({ name }); // Hapus kontak menggunakan fungsi custom
    res.redirect("/contact"); // Redirect ke halaman kontak
});

// Rute untuk halaman "about"
app.get("/about", (req, res) => {
    res.render("about", { title: "About" }); // Render halaman about
});

// Middleware untuk menangani rute yang tidak ditemukan (404)
app.use((req, res) => {
    res.status(404).send("<h1>404 : Page Tidak Ditemukan</h1>"); // Kirim pesan 404
});

// Jalankan server pada port yang ditentukan
app.listen(port, () => {
    console.log(`Server Is Running On Port ${port}`); // Pesan saat server berhasil dijalankan
});
