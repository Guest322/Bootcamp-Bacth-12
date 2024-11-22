const func = require("./src/func");
const yargs = require("yargs");

yargs.command({
  command: "add",
  describe: "add new contact",
  builder: {
    name: {
      describe: "contact name",
      demandOption: true,
      type: "string",
    },
    phone: {
      describe: "contact mobile",
      demandOption: true,
      type: "string",
    },
    mail: {
      describe: "contact email",
      demandOption: true,
      type: "string",
    },
  },
  handler(argv) {
    const contact = {
      name: argv.name,
      phone: argv.phone,
      mail: argv.mail,
    };
    func.newContact(contact);
    console.log(contact);
  },
});

yargs.parse();
func.rl.close();