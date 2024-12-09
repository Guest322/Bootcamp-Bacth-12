const express = require("express");// Import modul Express, yang digunakan untuk membuat server
const app = express();// Inisialisasi aplikasi Express
const expressLayouts = require('express-ejs-layouts');// Import modul express-ejs-layouts, yang digunakan untuk mendukung sistem layout pada template EJS
const morgan = require("morgan");// Import modul Morgan, yang digunakan untuk logging request ke server
const { body, validationResult } = require('express-validator');
const fs = require('fs');// Import modul File System (fs) untuk membaca dan menulis file JSON
const func = require("./src/func");// Import fungsi-fungsi custom dari file func.js

const port = 3000;// Tentukan port untuk server berjalan

app.set("view engine", "ejs");// Atur view engine menjadi EJS untuk merender halaman HTML
app.set("layout", "layouts/layout");// Atur file layout default

app.use(morgan("dev"));// Middleware Morgan untuk mencatat setiap request yang masuk
app.use(expressLayouts);// Gunakan express-ejs-layouts untuk mendukung penggunaan layout EJS
app.use(express.static("public"));// Middleware untuk mengatur folder public sebagai tempat penyimpanan file statis

// Middleware untuk mencatat waktu request masuk
app.use((req, res, next) => {
    console.log('Time:', Date.now())
    next();
});

// Middleware untuk parsing data form (urlencoded)
app.use(express.urlencoded({ extended: true }));

//Variabel untuk mencari dan menemukan apakah nama merupakan duplikasi atau bukan
const isNameDuplicate = (newName, { req }) => {
    // Membaca file JSON berisi data kontak
    const contacts = JSON.parse(fs.readFileSync("data/contacts.json", "utf-8"));
    
    // Mendapatkan nama lama dari parameter rute (route parameter)
    const oldName = req.params.name.toLowerCase();

    // Memeriksa apakah nama baru sudah ada dalam kontak
    // tetapi bukan nama lama (untuk menghindari kesalahan deteksi saat nama tidak diubah)
    const duplicate = contacts.find(
        (contact) => 
            contact.name.toLowerCase() === newName.toLowerCase() && // Nama baru cocok
            contact.name.toLowerCase() !== oldName                 // Tapi bukan nama lama
    );

    // Jika nama duplikat ditemukan, lempar error
    if (duplicate) {
        throw new Error(`Kontak dengan nama "${newName}" sudah ada.`);
    }

    // Jika tidak ada duplikat, kembalikan nilai true untuk melanjutkan proses
    return true;
};

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
    res.render("dataAdd", { title: "Tambah Data" , errors : []}); // Render halaman tambah data
});

// Rute untuk menyimpan data baru
// app.post("/addData", (req, res) => {
//     const { name, phone, mail } = req.body; // Destruktur data dari form
//     func.newContact(req.body); // Menyimpan data menggunakan fungsi custom
//     res.redirect("contact"); // Redirect ke halaman kontak
// });

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
    (req, res) => {
        // Mengecek hasil validasi
        const errors = validationResult(req);

        // Jika ada kesalahan validasi, render ulang halaman dengan pesan kesalahan
        if (!errors.isEmpty()) {
            return res.status(400).render("dataAdd", {
                title: "Tambah Data", // Judul halaman untuk menambahkan data
                errors: errors.array(), // Menampilkan daftar kesalahan validasi
            });
        }

        // Jika validasi berhasil, tambahkan data kontak baru
        func.newContact(req.body); // Memanggil fungsi untuk menyimpan data baru

        // Mengarahkan pengguna ke halaman daftar kontak setelah data berhasil ditambahkan
        res.redirect("/contact");
    }
);

//Rute untuk menampilkan detail data pada page baru
app.get("/dataDetail/:name", (req,res) => {
    const name = req.params.name; // Ambil parameter nama dari URL
    const contacts = func.readContact(); // Membaca semua kontak
    const contact = contacts.find(contact => contact.name.toLowerCase() === name.toLowerCase()); // Cari kontak berdasarkan nama

    if (!contact) {
        return res.status(404).send("Contact not found."); // Jika tidak ditemukan, kirim pesan 404
    }
    res.render("dataDetail", {contact, title: "Detail Data" });
});

// Rute untuk halaman update data
app.get("/dataUpdate/:name", (req, res) => {
    const name = req.params.name; // Ambil parameter nama dari URL
    const contacts = func.readContact(); // Membaca semua kontak
    const contact = contacts.find(contact => contact.name.toLowerCase() === name.toLowerCase()); // Cari kontak berdasarkan nama

    if (!contact) {
        return res.status(404).send("Contact not found."); // Jika tidak ditemukan, kirim pesan 404
    }

    res.render("dataUpdate", { contact, title: "Update Contact", errors: [] }); // Render halaman update dengan data kontak
});

// Rute untuk menyimpan perubahan data
// app.post("/updateData/:name", (req, res) => {
//     const oldName = req.params.name; // Nama lama (sebelum diupdate)
//     const { name, phone, mail } = req.body; // Data baru dari form
//     func.updateContact({ name: oldName }, { name, phone, mail }); // Update data menggunakan fungsi custom
//     res.redirect("/contact"); // Redirect ke halaman kontak
// });

// Rute untuk menyimpan perubahan data dengan validasi
app.post(
    "/updateData/:name", // Rute untuk memperbarui data kontak berdasarkan nama lama
    [
        // Validasi untuk field 'name'
        body('name')
            .trim() // Menghapus spasi di awal dan akhir input
            .notEmpty().withMessage('Nama wajib diisi.') // Memastikan input tidak kosong
            .isLength({ min: 1 }).withMessage('Nama tidak boleh hanya terdiri dari spasi.') // Memastikan input lebih dari satu karakter
            .custom(isNameDuplicate), // Validasi tambahan untuk memeriksa duplikasi nama

        // Validasi untuk field 'phone'
        body('phone')
            .isMobilePhone('id-ID') // Memeriksa apakah input adalah nomor telepon valid di Indonesia
            .withMessage('Format nomor telepon tidak valid.') // Pesan kesalahan jika format salah
    ],
    (req, res) => {
        // Mengambil hasil validasi
        const errors = validationResult(req);

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

        // Mendapatkan nama lama dari parameter URL
        const oldName = req.params.name;

        // Memperbarui kontak dengan data baru yang dikirimkan pengguna
        func.updateContact({ name: oldName }, req.body);

        // Mengalihkan ke halaman daftar kontak setelah berhasil memperbarui data
        res.redirect("/contact");
    }
);


// Rute untuk menghapus data kontak
app.post("/delete/:name", (req, res) => {
    const name = req.body.name; // Ambil nama dari parameter URL
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
