const readline = require('node:readline'); // Import modul readline untuk input dari terminal
const validator = require('validator');   // Import modul validator untuk validasi data
const fs = require('fs');                 // Import modul fs untuk bekerja dengan file

// Membuat antarmuka terminal untuk input pengguna
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Menanyakan nama pengguna
rl.question('Nama: ', (name) => {
  // Menanyakan nomor ponsel pengguna
  rl.question('Nomor Ponsel: ', (phone) => {
    // Memeriksa apakah nomor ponsel valid sesuai format Indonesia
    if (!validator.isMobilePhone(phone, 'id-ID')) {
      console.log('Nomor Ponsel Anda tidak valid'); // Jika tidak valid, tampilkan pesan
    }

    // Menanyakan email pengguna
    rl.question('Email: ', (mail) => {
      // Memeriksa apakah email valid
      if (!validator.isEmail(mail)) {
        console.log('Email Anda tidak valid'); // Jika tidak valid, tampilkan pesan
      }

      // Membuat objek kontak baru berdasarkan input pengguna
      const newContact = { name, phone, mail };

      // Membaca data kontak yang sudah ada di file atau memulai dengan array kosong
      var contacts = []; // Inisialisasi array kosong
      if (fs.existsSync('data/contacts.json')) {// Periksa apakah file contacts.json ada
        const fileContent = fs.readFileSync('data/contacts.json', 'utf-8'); // Baca isi file
        contacts = JSON.parse(fileContent); // Ubah string JSON menjadi array
      }else{
        // Mebuat file baru apabila file contacts.json tidak di temukan
        fs.writeFileSync('data/contacts.json', JSON.stringify(contacts, null, 2), 'utf-8')
        const fileContent = fs.readFileSync('data/contacts.json', 'utf-8'); // Baca isi file
        contacts = JSON.parse(fileContent); // Ubah string JSON menjadi array
      }
        

      // Menambahkan kontak baru ke daftar kontak yang sudah ada
      contacts.push(newContact);

      // Menyimpan daftar kontak yang telah diperbarui kembali ke file contacts.json
      fs.writeFileSync('data/contacts.json', JSON.stringify(contacts, null, 2), 'utf-8');
      console.log('Kontak berhasil disimpan!'); // Tampilkan pesan sukses

      // Menutup antarmuka terminal
      rl.close();
    });
  });
});
