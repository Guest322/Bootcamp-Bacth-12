const readline = require('node:readline'); // Mengimpor modul readline untuk menerima input dari terminal
const validator = require('validator');   // Mengimpor modul validator untuk memvalidasi data
const fs = require('fs');                 // Mengimpor modul fs untuk bekerja dengan file
dirFolder = "./data";
dirFile = "/data/contacts.js";


// Membuat antarmuka readline untuk membaca input dan menulis output dari/ke terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Fungsi untuk menanyakan pertanyaan ke pengguna, mengembalikan jawaban sebagai Promise
const question = (questions) => {
    return new Promise((resolve) => {
        rl.question(questions, (input) => {
            resolve(input); // Resolusi jawaban pengguna
        });
    });
};

// Fungsi untuk menyimpan kontak baru ke file JSON
function newContact(contact) {
    // Jika file contacts.json tidak ada, buat file baru dengan array kosong
    if (!fs.existsSync("data/contacts.json")) {
        fs.writeFileSync("data/contacts.json", "[]", "utf-8");
    }

    // Membaca isi file contacts.json
    const contacts = JSON.parse(fs.readFileSync("data/contacts.json", "utf-8"));

    // Menambahkan kontak baru ke dalam array
    contacts.push(contact);

    // Menyimpan kembali array kontak ke file dalam format JSON
    fs.writeFileSync("data/contacts.json", JSON.stringify(contacts, null, 2), 'utf-8');
}

// Mengekspor fungsi dan objek yang diperlukan agar dapat digunakan di file lain
module.exports = { newContact, question, rl, validator };
