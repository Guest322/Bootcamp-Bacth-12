const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

rl.question('Nama : ', (answer) => {
  console.log(`Nama Mu Adalah : ${answer}`);
    rl.question('Nomor Ponsel : ', (answer) => {
      console.log(`Nomor Ponsel Mu Adalah : ${answer}`);
      rl.question('Email : ', (answer) => {
        console.log(`Email Mu Adalah: ${answer}`);

        console.log('Terimakasih Sudah Mengisi!!!');
      rl.close();
    });
  });
});