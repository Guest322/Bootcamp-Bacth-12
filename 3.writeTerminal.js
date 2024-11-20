// Memanggil Modul Readline
const readline = require('node:readline');
// Memanggil Modul Prosess
const { stdin: input, stdout: output } = require('node:process');

// membuat constanta rl yang memiliki nilai fuction createInterface untuk input dan output di terminal
const rl = readline.createInterface({ input, output });

// menggunakan method question dari module readline yang nilai namanya akan di masukan di callback answer
rl.question('Nama : ', (answer) => {
  // menampilkan string dengan console log dan jawaban dari callback answer
  console.log(`Nama Mu Adalah : ${answer}`);

    rl.question('Nomor Ponsel : ', (answer) => {
      console.log(`Nomor Ponsel Mu Adalah : ${answer}`);

      rl.question('Email : ', (answer) => {
        console.log(`Email Mu Adalah: ${answer}`);
        
      // menutup interface
      rl.close();
    });
  });
});