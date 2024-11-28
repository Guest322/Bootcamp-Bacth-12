const readline = require('node:readline'); // Mengimpor modul readline untuk menerima input dari terminal
const validator = require('validator');   // Mengimpor modul validator untuk memvalidasi data
const fs = require('fs');                 // Mengimpor modul fs untuk bekerja dengan file

// Direktori folder dan file untuk penyimpanan data
const dirFolder = "./data";
const dirFile = "data/contacts.json";

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

// Fungsi untuk membaca kontak dari file JSON
function readContact() {
    // Membaca file contacts.json dan mengonversi isinya menjadi array objek
    const contacts = JSON.parse(fs.readFileSync("data/contacts.json", "utf-8"));
    return contacts;
}

// Fungsi untuk menyimpan kontak baru ke file JSON
function newContact(argv) {
    // Jika file contacts.json tidak ada, buat file baru dengan array kosong
    if (!fs.existsSync("data/contacts.json")) {
        fs.writeFileSync("data/contacts.json", "[]", "utf-8");
    }

    // Membaca isi file contacts.json
    const contacts = JSON.parse(fs.readFileSync("data/contacts.json", "utf-8"));

    // Memeriksa apakah nama yang dimasukkan sudah ada dalam daftar kontak
    const existingContact = contacts.filter(contact => contact.name.toLowerCase() === argv.name.toLowerCase());

    if (existingContact) {
        console.log(`Data dengan nama "${argv.name}" sudah tersedia.`);
    } else {
        // Menambahkan kontak baru ke dalam array jika nama belum ada
        contacts.push(argv);

        // Menyimpan kembali array kontak ke file dalam format JSON
        fs.writeFileSync("data/contacts.json", JSON.stringify(contacts, null, 2), 'utf-8');
        console.log(`Kontak dengan nama "${argv.name}" berhasil ditambahkan.`);
    }
}

// Fungsi untuk menghapus kontak berdasarkan nama
function deleteContact(argv) {
    const contacts = JSON.parse(fs.readFileSync("data/contacts.json", "utf-8"));

    // Memfilter kontak untuk menghapus yang sesuai dengan nama di argumen
    const filteredContacts = contacts.filter(
        (contact) => contact.name.toLowerCase() !== argv.name.toLowerCase()
    );

    // Menulis ulang file JSON dengan data kontak yang diperbarui
    fs.writeFileSync("data/contacts.json", JSON.stringify(filteredContacts, null, 2), "utf-8");
    console.log(`Kontak dengan nama "${argv.name}" berhasil dihapus.`);
}

// Fungsi untuk menampilkan detail kontak berdasarkan nama
function detailContact(argv) {
    const contacts = JSON.parse(fs.readFileSync("data/contacts.json", "utf-8"));

    // Memfilter kontak berdasarkan nama yang sesuai
    const filteredContacts = contacts.filter(
        (contact) => contact.name.toLowerCase() === argv.name.toLowerCase()
    );

    // Menampilkan detail kontak
    filteredContacts.forEach((filteredContact, index) => {
        console.log(`|=============={${index + 1}}==============|`);
        console.log(` Nama          : ${filteredContact.name}`);
        console.log(` Nomor Telepon : ${filteredContact.phone}`);
        console.log(` Email         : ${filteredContact.mail}`);
        console.log(`|===============================|`);
    });
}

// Fungsi untuk mengupdate kontak berdasarkan nama
const updateContact = async(argv,contact) => {
    const contacts = JSON.parse(fs.readFileSync("data/contacts.json", "utf-8"));

    // Memfilter kontak yang tidak sesuai dengan nama yang ingin diupdate
    const filteredContacts = contacts.filter(
        (contact) => contact.name.toLowerCase() !== argv.name.toLowerCase()
    );

    if (filteredContacts.length === contacts.length) {
        console.log("Data tidak ditemukan.");
    } else {
        // Menambahkan kontak baru ke dalam array
        filteredContacts.push(contact);

        // Menyimpan kembali array kontak ke file dalam format JSON
        fs.writeFileSync("data/contacts.json", JSON.stringify(filteredContacts, null, 2), 'utf-8');
    }
}

// Mengekspor fungsi-fungsi untuk digunakan di file lain
module.exports = { newContact, deleteContact, readContact, detailContact, updateContact, question, rl, validator };
