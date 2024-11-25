const readline = require('node:readline'); 
const validator = require('validator'); 
const fs = require('fs'); 

const dirFolder = "./data"; // Directory for storing contact data
const dirFile = "/data/contacts.json"; // File for saving contacts

// Create a readline interface for terminal I/O
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to ask a question in CLI and get user input
const question = (questions) => {
  return new Promise((resolve) => {
    rl.question(questions, (input) => {
      resolve(input); // Return user input
    });
  });
};

// Read all contacts from the JSON file
function readContact() {
  const contacts = JSON.parse(fs.readFileSync("data/contacts.json", "utf-8")); 
  return contacts;
}

// Save a new contact to the JSON file
function newContact(contact) {
  if (!fs.existsSync("data/contacts.json")) { // If file doesn't exist, create it
    fs.writeFileSync("data/contacts.json", "[]", "utf-8");
  }
  const contacts = JSON.parse(fs.readFileSync("data/contacts.json", "utf-8"));
  contacts.push(contact); // Add the new contact
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts, null, 2), 'utf-8'); // Save updated contacts
}

// Delete a contact by name
function deleteContact(argv) {
  const contacts = JSON.parse(fs.readFileSync("data/contacts.json", "utf-8"));
  const filteredContacts = contacts.filter(
    (contact) => contact.name.toLowerCase() !== argv.name.toLowerCase()
  );
  fs.writeFileSync("data/contacts.json", JSON.stringify(filteredContacts, null, 2), "utf-8"); 
  console.log(`Kontak dengan nama "${argv.name}" berhasil dihapus.`);
}

// Display details of a specific contact
function detailContact(argv) {
  const contacts = JSON.parse(fs.readFileSync("data/contacts.json", "utf-8"));
  const filteredContacts = contacts.filter(
    (contact) => contact.name.toLowerCase() === argv.name.toLowerCase()
  );
  filteredContacts.forEach((filteredContact, index) => {
    console.log(`|=============={${index + 1}}==============|`);
    console.log(` Nama          : ${filteredContact.name}`);
    console.log(` Nomor Telepon : ${filteredContact.phone}`);
    console.log(` Email         : ${filteredContact.mail}`);
    console.log(`|===============================|`);
  });
}

// Update a contact's details
const updateContact = async(argv, contact) => {
  const contacts = JSON.parse(fs.readFileSync("data/contacts.json", "utf-8"));
  const filteredContacts = contacts.filter(
    (contact) => contact.name.toLowerCase() !== argv.name.toLowerCase()
  );
  if (filteredContacts.length === contacts.length) {
    console.log("Data tidak ditemukan.");
  } else {
    filteredContacts.push(contact); // Add updated contact
    fs.writeFileSync("data/contacts.json", JSON.stringify(filteredContacts, null, 2), 'utf-8');
  }
}

// Export functions for use in other modules
module.exports = { newContact, deleteContact, readContact, detailContact, updateContact, question, rl, validator };
