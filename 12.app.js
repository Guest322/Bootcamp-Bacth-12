const express = require("express"); // Import modul Express, yang digunakan untuk membuat server
const app = express(); // Inisialisasi aplikasi Express
const expressLayouts = require('express-ejs-layouts'); // Import modul express-ejs-layouts untuk mendukung sistem layout pada template EJS
const morgan = require("morgan"); // Import modul Morgan untuk logging request ke server
const { body, validationResult } = require('express-validator'); // Import fungsi validasi dari express-validator
const fs = require('fs'); // Import modul File System (fs) untuk membaca dan menulis file JSON
const func = require("./src/func"); // Import fungsi-fungsi custom dari file func.js

const port = 3000; // Tentukan port untuk server berjalan

app.set("view engine", "ejs"); // Atur view engine menjadi EJS untuk merender halaman HTML
app.set("layout", "layouts/layout"); // Atur file layout default

app.use(morgan("dev")); // Middleware Morgan untuk mencatat setiap request yang masuk
app.use(expressLayouts); // Gunakan express-ejs-layouts untuk mendukung penggunaan layout EJS
app.use(express.static("public")); // Middleware untuk mengatur folder public sebagai tempat penyimpanan file statis

// Middleware untuk mencatat waktu request masuk
app.use((req, res, next) => {
    console.log('Time:', Date.now()) // Log waktu setiap request
    next(); // Lanjutkan ke middleware berikutnya
});

// Middleware untuk parsing data form (urlencoded)
app.use(express.urlencoded({ extended: true }));

// Rute untuk halaman utama
app.get("/", (req, res) => {
    const name = "Harry"; // Variabel untuk menyimpan nama
    res.render("index", { name, title: "Home" }); // Render halaman index dengan data nama dan title
});

// Rute untuk halaman kontak
app.get("/contact", async (req, res) => {
    const cont = await func.readContact(); // Membaca kontak dari fungsi custom
    res.render("contact", { cont, title: "Contact" }); // Render halaman kontak dengan data yang diperoleh
});

// Rute untuk halaman tambah data
app.get("/dataAdd", (req, res) => {
    res.render("dataAdd", { title: "Tambah Data", errors: [] }); // Render halaman tambah data, dengan error kosong
});

// Rute untuk menyimpan data baru dengan validasi
app.post(
    "/addData", // Rute untuk menambahkan data kontak baru
    [
        // Validasi untuk field 'name'
        body('name')
            .trim() // Menghapus spasi di awal dan akhir input
            .notEmpty().withMessage('Nama harus diisi.') // Memastikan input nama tidak kosong
            .isLength({ min: 1 }).withMessage('Nama tidak bisa diisi hanya dengan spasi.'), // Memastikan input nama valid dan bukan hanya spasi

        // Validasi untuk field 'phone'
        body('phone')
            .isMobilePhone('id-ID') // Memeriksa apakah input adalah nomor telepon yang valid di Indonesia
            .withMessage('Format nomor telepon yang anda isi tidak valid.') // Pesan kesalahan jika format tidak sesuai
    ], 
    async (req, res) => {
    const errors = validationResult(req); // Mengambil hasil validasi
    // Jika ada kesalahan validasi, render ulang halaman dengan pesan kesalahan
    if (!errors.isEmpty()) {
        return res.status(400).render("dataAdd", {
            title: "Tambah Data", // Judul halaman untuk menambahkan data
            errors: errors.array(), // Menampilkan daftar kesalahan validasi
        });
    }
    const { name, phone, mail } = req.body; // Ambil data dari form
    await func.newContact({ name, phone, mail }); // Simpan data kontak baru
    res.redirect("/contact"); // Redirect ke halaman kontak
});

// Rute untuk menampilkan detail data pada page baru
app.get("/dataDetail/:name", async (req, res) => {
    const name = req.params.name; // Ambil parameter nama dari URL
    try {
        const contact = await func.detailContact(name); // Pass 'name' to the function untuk mendapatkan detail kontak
        if (contact.length === 0) {
            // Jika tidak ada kontak yang ditemukan, kirimkan status 404
            return res.status(404).send("Contact not found");
        }
        res.render("dataDetail", { contact, title: "Detail Data" }); // Render halaman dataDetail dengan data kontak
    } catch (err) {
        console.error(err.message); // Log error jika terjadi kesalahan
        res.status(500).send("Server error"); // Kirimkan status error 500 jika terjadi masalah di server
    }
});

// Rute untuk halaman update data
app.get("/dataUpdate/:name", async (req, res) => {
    const name = req.params.name; // Ambil parameter nama dari URL
    try {
        const contact = await func.detailContact(name); // Pass 'name' to the function untuk mendapatkan detail kontak
        if (contact.length === 0) {
            // Jika tidak ada kontak yang ditemukan, kirimkan status 404
            return res.status(404).send("Contact not found");
        }
        res.render("dataUpdate", { contact, title: "Update Contact", errors: [] }); // Render halaman update dengan data kontak
    } catch (err) {
        console.error(err.message); // Log error jika terjadi kesalahan
        res.status(500).send("Server error"); // Kirimkan status error 500 jika terjadi masalah di server
    }
});

// Rute untuk menyimpan perubahan data dengan validasi
app.post(
    "/updateData/:name", // Rute untuk memperbarui data kontak
    [
        // Validasi untuk field 'name'
        body('name')
            .trim() // Menghapus spasi di awal dan akhir input
            .notEmpty().withMessage('Nama wajib diisi.') // Memastikan input tidak kosong
            .isLength({ min: 1 }).withMessage('Nama tidak boleh hanya terdiri dari spasi.') // Memastikan input lebih dari satu karakter
            .custom(func.dataDuplicate), // Validasi tambahan untuk memeriksa duplikasi nama

        // Validasi untuk field 'phone'
        body('phone')
            .isMobilePhone('id-ID') // Memeriksa apakah input adalah nomor telepon valid di Indonesia
            .withMessage('Format nomor telepon tidak valid.'), // Pesan kesalahan jika format salah
    ], 
    async (req, res) => {
    const errors = validationResult(req); // Mengambil hasil validasi

    // Jika ada kesalahan validasi, render ulang form dengan pesan kesalahan
    if (!errors.isEmpty()) {
        return res.status(400).render("dataUpdate", {
            title: "Update Kontak", // Judul halaman
            errors: errors.array(), // Daftar kesalahan validasi
            contact: {
                name: req.body.name,  // Mengembalikan input nama yang diisi sebelumnya
                phone: req.body.phone, // Mengembalikan input telepon yang diisi sebelumnya
                mail: req.body.mail, // Mengembalikan input email yang diisi sebelumnya
            }, // Mengembalikan data input sebelumnya agar pengguna tidak perlu mengetik ulang
        });
    }    
    const oldName = req.params.name; // Ambil nama lama dari parameter URL
    const { name, phone, mail } = req.body; // Ambil data baru dari form
    await func.updateContact(oldName, { name, phone, mail }); // Simpan perubahan data kontak
    res.redirect("/contact"); // Redirect ke halaman kontak
});

// Rute untuk menghapus data kontak
app.post("/delete/:name", async (req, res) => {
    const name = req.params.name; // Ambil parameter nama dari URL
    await func.deleteContact(name); // Panggil fungsi untuk menghapus kontak berdasarkan nama
    res.redirect("/contact"); // Redirect ke halaman kontak
});

// Rute untuk halaman "about"
app.get("/about", (req, res) => {
    res.render("about", { title: "About" }); // Render halaman about
});

// Middleware untuk menangani rute yang tidak ditemukan (404)
app.use((req, res) => {
    res.status(404).send("<h1>404 : Page Tidak Ditemukan</h1>"); // Kirimkan pesan 404 jika rute tidak ditemukan
});

// Jalankan server pada port yang ditentukan
app.listen(port, () => {
    console.log(`Server Is Running On Port ${port}`); // Pesan saat server berhasil dijalankan
});
