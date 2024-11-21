const readline = require('node:readline'); // Import modul readline untuk input dari terminal
const validator = require('validator');   // Import modul validator untuk validasi data
const fs = require('fs');                 // Import modul fs untuk bekerja dengan file

// Membuat antarmuka terminal untuk input pengguna
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const question = (questions) => {
    return new Promise((resolve) => {
        rl.question(questions, (input) => {
            resolve(input);
        });
    });
};


function newContact(contact) {
    if (!fs.existsSync("data/contacts.json")) {
        fs.writeFileSync("data/contacts.json", "[]", "utf-8");
    }

    const contacts = JSON.parse(fs.readFileSync("data/contacts.json", "utf-8"));
    contacts.push(contact);
    fs.writeFileSync("data/contacts.json", JSON.stringify(contacts, null, 2), 'utf-8');
}

module.exports = { newContact, question, rl, validator};
