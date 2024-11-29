// Import modul HTTP untuk membuat server
const http = require("http");

// Import modul File System (fs) untuk membaca file HTML
const fs = require("fs");

// Tentukan port untuk server berjalan
const port = 3000;

// Membuat server HTTP
http.createServer((req, res) => {
    // Mendapatkan URL dari permintaan (request)
    const url = req.url;

    // Fungsi untuk merender halaman HTML
    const renderPage = (path, res) => {
        // Menulis header HTTP dengan status 200 (OK) dan tipe konten HTML
        res.writeHead(200, {"content-type" : "text/html"});

        // Membaca file HTML dari path yang diberikan secara sinkron
        const data = fs.readFileSync(path, "utf-8");

        // Menulis data (konten halaman HTML) ke dalam respons
        res.write(data);

        // Menandakan bahwa respons selesai
        res.end();
    }

    // Penanganan rute berdasarkan URL
    if (url === "/") {
        // Jika URL adalah "/", render halaman "index.html"
        renderPage("./views/index.html", res);
    } else if (url === "/about") {
        // Jika URL adalah "/about", render halaman "about.html"
        renderPage("./views/about.html", res);
    } else if (url === "/contact") {
        // Jika URL adalah "/contact", render halaman "contact.html"
        renderPage("./views/contact.html", res);
    } else {
        // Jika URL tidak sesuai dengan rute yang tersedia, kirim respons 404
        res.writeHead(404, {"content-type" : "text/html"});

        // Menulis pesan kesalahan sederhana untuk halaman 404
        res.write("<center><h1>404 : Page Tidak Ditemukan</h1></center>");

        // Menandakan bahwa respons selesai
        res.end();
    }
})
// Server mulai mendengarkan pada port yang ditentukan
.listen(port, () => {
    // Menampilkan pesan di konsol saat server berhasil berjalan
    console.log(`Server is running on port ${port}`);
});
