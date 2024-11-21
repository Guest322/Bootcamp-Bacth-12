const func = require("./src/func"); // Mengimpor fungsi dari file func.js

// Fungsi utama yang dijalankan secara asinkron
const main = async () => {
    var name;
    var phone;
    var mail;

    // Meminta pengguna memasukkan nama
    do {
        name = await func.question("Nama : ");    
    } while (!name);
    
    // Validasi nomor telepon
    do {
        // Meminta pengguna memasukkan nomor telepon
        phone = await func.question("Nomor Telepon : ");
        // Validasi apakah nomor telepon valid sesuai format "id-ID"
    } while (!func.validator.isMobilePhone(phone, 'id-ID'));

    // Validasi email
    do {
        // Meminta pengguna memasukkan alamat email
        mail = await func.question("Email : ");
        // Validasi apakah email valid
    } while (!func.validator.isEmail(mail));

    // Membuat objek kontak berdasarkan input pengguna
    const contact = {
        name,
        phone,
        mail,
    };

    // Menyimpan data kontak ke file JSON
    func.newContact(contact);

    // Menutup antarmuka readline setelah semua input selesai
    func.rl.close();
};

// Menjalankan fungsi utama
main();
