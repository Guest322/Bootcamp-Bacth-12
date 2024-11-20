// Memanggil Modul Readline yang digunakan untuk mengambil input dari pengguna melalui terminal
const readline = require('node:readline');
// Mengambil stdin dan stdout dari modul process untuk input dan output melalui terminal
const { stdin: input, stdout: output } = require('node:process');
// Memanggil modul validator yang digunakan untuk memvalidasi input seperti email dan nomor ponsel
const validator = require('validator');

// Membuat interface readline untuk komunikasi input/output dengan terminal
const rl = readline.createInterface({ input, output });

// Pertanyaan pertama untuk meminta input nama dari pengguna
rl.question('Nama: ', (name) => {
  // Menampilkan nama yang telah dimasukkan oleh pengguna
  console.log(`Nama Anda adalah: ${name}`);

  // Pertanyaan kedua untuk meminta input nomor ponsel
  rl.question('Nomor Ponsel: ', (phone) => {
    // Melakukan validasi terhadap nomor ponsel yang dimasukkan oleh pengguna
    // validator.isMobilePhone() memvalidasi format nomor ponsel sesuai dengan negara yang ditentukan (id-ID untuk Indonesia)
    const validPhone = validator.isMobilePhone(phone, 'id-ID');
    
    // Mengecek hasil validasi nomor ponsel
    if (validPhone) {
      // Jika nomor ponsel valid, maka tampilkan pesan dengan nomor ponsel yang valid
      console.log(`Nomor Ponsel Anda adalah: ${phone}`);
    } else {
      // Jika nomor ponsel tidak valid, tampilkan pesan error
      console.log('Nomor Ponsel Anda tidak valid');
    }

    // Pertanyaan ketiga untuk meminta input email dari pengguna
    rl.question('Email: ', (mail) => {
      // Melakukan validasi terhadap email yang dimasukkan oleh pengguna
      // validator.isEmail() memvalidasi apakah email yang dimasukkan memiliki format yang benar
      const validEmail = validator.isEmail(mail);

      // Mengecek hasil validasi email
      if (validEmail) {
        // Jika email valid, maka tampilkan pesan dengan email yang valid
        console.log(`Email Anda adalah: ${mail}`);
      } else {
        // Jika email tidak valid, tampilkan pesan error
        console.log('Email Anda tidak valid');
      }

      // Setelah semua pertanyaan selesai, menutup interface readline agar program berhenti
      rl.close();
    });
  });
});
