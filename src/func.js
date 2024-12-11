// Import koneksi ke database PostgreSQL
const pool = require("./conn/dbPostgres");

// Fungsi untuk mengambil semua kontak
async function readContact() {
    // Menjalankan query SQL untuk mengambil semua data dari tabel 'data_contact'
    const result = await pool.query('SELECT * FROM data_contact');
    return result.rows; // Mengembalikan hasil query (baris data kontak)
}

// Fungsi untuk menambahkan kontak baru
async function newContact(contact) {
    try {
        const { name, phone, mail } = contact; // Mengambil nilai name, phone, dan mail dari objek contact
        // Menjalankan query untuk menambahkan data kontak baru ke dalam tabel 'data_contact'
        const result = await pool.query(
            'INSERT INTO data_contact (name, phone, mail) VALUES ($1, $2, $3) RETURNING *',
            [name, phone, mail] // Menyisipkan nilai ke dalam query
        );
        console.log(`Contact added: ${JSON.stringify(result.rows[0])}`); // Menampilkan kontak yang baru ditambahkan di log
    } catch (err) {
        console.error(err.message); // Menangani dan mencetak error jika ada kesalahan dalam query
    }
}

// Fungsi untuk mengambil detail kontak berdasarkan nama
async function detailContact(name) {
    try {
        // Menjalankan query untuk mengambil data kontak yang memiliki nama yang sesuai (case-insensitive)
        const result = await pool.query(
            'SELECT * FROM data_contact WHERE LOWER(name) = LOWER($1)',
            [name]
        );
        return result.rows; // Mengembalikan hasil query, meskipun tidak ada hasil ditemukan (akan mengembalikan array kosong)
    } catch (err) {
        console.error(err.message); // Menangani error jika query gagal
        throw err; // Melempar kembali error untuk ditangani di fungsi pemanggil
    }
}

// Fungsi untuk menghapus kontak berdasarkan nama
async function deleteContact(name) {
    try {
        // Menjalankan query untuk menghapus data kontak berdasarkan nama yang sesuai (case-insensitive)
        const result = await pool.query(
            'DELETE FROM data_contact WHERE LOWER(name) = LOWER($1) RETURNING *',
            [name]
        );
        if (result.rowCount > 0) {
            // Jika ada kontak yang terhapus, tampilkan di log
            console.log(`Contact deleted: ${JSON.stringify(result.rows[0])}`);
        } else {
            // Jika tidak ada kontak yang ditemukan dengan nama tersebut
            console.log(`No contact found with name: ${name}`);
        }
    } catch (err) {
        console.error(err.message); // Menangani error jika query gagal
    }
}

// Fungsi untuk mengambil detail kontak berdasarkan nama
async function detailContact(name) {
    try {
        // Menjalankan query untuk mengambil data kontak berdasarkan nama (case-insensitive)
        const result = await pool.query(
            'SELECT * FROM data_contact WHERE LOWER(name) = LOWER($1)',
            [name]
        );
        return result.rows[0]; // Mengembalikan baris pertama jika ada hasil
    } catch (err) {
        console.error(err.message); // Menangani error jika query gagal
    }
}

// Fungsi untuk mengupdate data kontak
async function updateContact(oldName, newContact) {
    try {
        const { name, phone, mail } = newContact; // Mengambil nilai baru untuk nama, telepon, dan email
        // Menjalankan query untuk memperbarui data kontak berdasarkan nama lama
        const result = await pool.query(
            'UPDATE data_contact SET name = $1, phone = $2, mail = $3 WHERE LOWER(name) = LOWER($4) RETURNING *',
            [name, phone, mail, oldName] // Menyisipkan nilai baru dan nama lama
        );
        if (result.rowCount > 0) {
            // Jika ada kontak yang berhasil diperbarui, tampilkan di log
            console.log(`Contact updated: ${JSON.stringify(result.rows[0])}`);
        } else {
            // Jika tidak ada kontak yang ditemukan untuk nama yang diberikan
            console.log(`No contact found with name: ${oldName}`);
        }
    } catch (err) {
        console.error(err.message); // Menangani error jika query gagal
    }
}

// Fungsi untuk memeriksa duplikasi nama kontak
async function dataDuplicate(newName, { req }) {
    try {
        // Mendapatkan nama lama dari parameter rute (route parameter)
        const oldName = req.params.name.toLowerCase();

        // Query untuk memeriksa apakah ada nama baru yang duplikat (tetapi bukan nama lama)
        const result = await pool.query(
            'SELECT * FROM data_contact WHERE LOWER(name) = LOWER($1) AND LOWER(name) != LOWER($2)',
            [newName, oldName]
        );

        // Jika ada duplikat, hasil query akan mengembalikan baris
        if (result.rows.length > 0) {
            throw new Error(`Kontak dengan nama "${newName}" sudah ada.`);
        }

        // Jika tidak ada duplikat, kembalikan nilai true untuk melanjutkan proses
        return true;

    } catch (err) {
        console.error(err.message); // Menangani dan mencetak error jika terjadi masalah
        throw err;  // Melempar error agar bisa ditangani lebih lanjut
    }
};

// Mengekspor semua fungsi agar dapat digunakan di file lain
module.exports = { newContact, detailContact, deleteContact, readContact, detailContact, updateContact, dataDuplicate};
