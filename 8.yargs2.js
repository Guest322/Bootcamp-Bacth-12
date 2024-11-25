// Mengimpor modul func yang berisi fungsi-fungsi utilitas untuk pengelolaan kontak
const func = require("./src/func");
// Mengimpor modul yargs untuk parsing argumen dari command-line
const yargs = require("yargs");
// Mengimpor modul fs untuk bekerja dengan file sistem
const fs = require("fs");

// Perintah "add" untuk menambahkan kontak baru
yargs.command({
  command: "add", // Nama perintah yang dipanggil melalui CLI
  describe: "Menambahkan kontak baru", // Deskripsi perintah yang muncul di help
  builder: {
    name: {
      describe: "Nama kontak", // Penjelasan argumen nama
      demandOption: true, // Menandai bahwa argumen ini wajib diisi
      type: "string", // Jenis data yang diterima adalah string
    },
    phone: {
      describe: "Nomor telepon kontak", // Penjelasan argumen nomor telepon
      demandOption: true, // Argumen ini wajib diisi
      type: "string", // Jenis data string
    },
    mail: {
      describe: "Email kontak", // Penjelasan argumen email
      demandOption: true, // Argumen ini wajib diisi
      type: "string", // Jenis data string
    },
  },
  handler(argv) {
    // Fungsi handler yang dipanggil saat perintah "add" dijalankan
    const contact = {
      name: argv.name, // Mengambil nama dari argumen
      phone: argv.phone, // Mengambil nomor telepon dari argumen
      mail: argv.mail, // Mengambil email dari argumen
    };
    func.newContact(contact); // Menyimpan kontak baru ke file JSON melalui modul func
    console.log("Kontak berhasil ditambahkan:", contact); // Pesan konfirmasi
  },
});

// Perintah "delete" untuk menghapus kontak berdasarkan nama
yargs.command({
  command: "delete", // Nama perintah
  describe: "Menghapus kontak berdasarkan nama", // Deskripsi perintah
  builder: {
    name: {
      describe: "Nama kontak yang akan dihapus", // Penjelasan argumen nama
      demandOption: true, // Argumen ini wajib diisi
      type: "string", // Jenis data string
    },
  },
  handler(argv) {
    func.readContact(); // Membaca kontak dari file JSON (opsional jika diperlukan sebelum penghapusan)
    func.deleteContact(argv); // Menghapus kontak melalui modul func
  },
});

// Perintah "list" untuk menampilkan daftar semua kontak
yargs.command({
  command: "list", // Nama perintah
  describe: "Menampilkan List Data", // Deskripsi perintah
  handler() {
    const contacts = func.readContact(); // Membaca semua kontak dari file JSON
    contacts.forEach((contact, index) => {
      console.log(
        `${index + 1}. Name: ${contact.name} | Phone Number: ${contact.phone} | Email: ${contact.mail}`
      );
    }); // Menampilkan daftar kontak dengan format tertentu
  },
});

// Perintah "detail" untuk menampilkan detail kontak berdasarkan nama
yargs.command({
  command: "detail", // Nama perintah
  describe: "Menampilkan detail kontak berdasarkan nama", // Deskripsi perintah
  builder: {
    name: {
      describe: "Nama kontak yang akan ditampilkan", // Penjelasan argumen nama
      demandOption: true, // Argumen ini wajib diisi
      type: "string", // Jenis data string
    },
  },
  handler(argv) {
    func.detailContact(argv); // Menampilkan detail kontak melalui modul func
  },
});

// Perintah "update" untuk memperbarui data kontak berdasarkan nama
yargs.command({
  command: "update", // Nama perintah
  describe: "Mengupdate data kontak berdasarkan nama", // Deskripsi perintah
  builder: {
    name: {
      describe: "Nama kontak yang akan diupdate", // Penjelasan argumen nama
      demandOption: true, // Argumen ini wajib diisi
      type: "string", // Jenis data string
    },
    newname: {
      describe: "Nama kontak baru", // Penjelasan argumen nama baru
      demandOption: true, // Argumen ini wajib diisi
      type: "string", // Jenis data string
    },
    newphone: {
      describe: "Nomor telepon baru", // Penjelasan argumen nomor telepon baru
      demandOption: true, // Argumen ini wajib diisi
      type: "string", // Jenis data string
    },
    newmail: {
      describe: "Email baru", // Penjelasan argumen email baru
      demandOption: true, // Argumen ini wajib diisi
      type: "string", // Jenis data string
    },
  },
  handler(argv) {
    const contact = {
      name: argv.newname, // Mengambil nama baru
      phone: argv.newphone, // Mengambil nomor telepon baru
      mail: argv.newmail, // Mengambil email baru
    };
    func.updateContact(argv, contact); // Memperbarui kontak melalui modul func
  },
});

// Memparsing argumen dari command-line menggunakan yargs
yargs.parse();
// Menutup antarmuka readline setelah semua input selesai
func.rl.close();
