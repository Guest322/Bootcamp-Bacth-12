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

function deleteContact(argv){
    // Fungsi yang akan dijalankan ketika perintah "delete" dipanggil
    const contacts = JSON.parse(fs.readFileSync("data/contacts.json", "utf-8")); 
    // Membaca file JSON berisi kontak dan mengonversinya menjadi array objek

    const filteredContacts = contacts.filter(
      (contact) => contact.name !== argv.name
      // Memfilter kontak untuk menghapus kontak yang namanya sesuai dengan argumen
      // Memastikan `contact` tidak null sebelum mengecek properti `name`
    );

    // Jika panjang array berubah, berarti kontak berhasil dihapus
    fs.writeFileSync("data/contacts.json", JSON.stringify(filteredContacts, null, 2), "utf-8");
    // Menulis ulang file JSON dengan data kontak yang sudah diperbarui
    console.log(`Kontak dengan nama "${argv.name}" berhasil dihapus.`);
}

// Mengekspor fungsi dan objek yang diperlukan agar dapat digunakan di file lain
module.exports = { newContact, deleteContact, question, rl, validator };
