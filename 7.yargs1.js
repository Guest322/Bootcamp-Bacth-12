const func = require("./src/func"); // Mengimpor modul func yang berisi fungsi-fungsi utilitas
const yargs = require("yargs"); // Mengimpor yargs untuk parsing argumen dari command-line
const fs = require("fs"); // Mengimpor modul fs untuk bekerja dengan file

// Perintah untuk menambahkan kontak baru
yargs.command({
  command: "add", // Nama perintah yang digunakan di CLI
  describe: "Menambahkan kontak baru", // Deskripsi perintah yang akan ditampilkan di help
  builder: {
    name: {
      describe: "Nama kontak", // Penjelasan untuk argumen nama
      demandOption: true, // Menandai bahwa argumen ini wajib
      type: "string", // Tipe data yang diterima untuk argumen ini adalah string
    },
    phone: {
      describe: "Nomor telepon kontak", // Penjelasan untuk argumen nomor telepon
      demandOption: true, // Menandai bahwa argumen ini wajib
      type: "string", // Tipe data yang diterima untuk argumen ini adalah string
    },
    mail: {
      describe: "Email kontak", // Penjelasan untuk argumen email
      demandOption: true, // Menandai bahwa argumen ini wajib
      type: "string", // Tipe data yang diterima untuk argumen ini adalah string
    },
  },
  handler(argv) {
    // Fungsi yang akan dijalankan ketika perintah "add" dipanggil
    const contact = {
      name: argv.name, // Mengambil nilai nama dari argumen yang diberikan oleh pengguna
      phone: argv.phone, // Mengambil nilai nomor telepon dari argumen yang diberikan oleh pengguna
      mail: argv.mail, // Mengambil nilai email dari argumen yang diberikan oleh pengguna
    };
    func.newContact(contact); // Memanggil fungsi dari modul func untuk menyimpan kontak ke file JSON
    console.log("Kontak berhasil ditambahkan:", contact); // Menampilkan pesan keberhasilan beserta data kontak yang baru ditambahkan
  },
});

// Perintah untuk menghapus kontak
yargs.command({
  command: "delete", // Nama perintah yang digunakan di CLI
  describe: "Menghapus kontak berdasarkan nama", // Deskripsi perintah yang akan ditampilkan di help
  builder: {
    name: {
      describe: "Nama kontak yang akan dihapus", // Penjelasan untuk argumen nama
      demandOption: true, // Menandai bahwa argumen ini wajib
      type: "string", // Tipe data yang diterima untuk argumen ini adalah string
    },
  },
  handler(argv) {
    func.deleteContact(argv); //Memanggil Fungsi dari modul func untuk menghapus kontak dari file JSON
  },
});

// Memparsing argumen dari command-line menggunakan yargs
yargs.parse();
// Menutup antarmuka setelah semua input selesai
func.rl.close();
