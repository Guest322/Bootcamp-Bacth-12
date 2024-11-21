const func = require("./src/func")

const main = async () => {
    const name = await func.question("Nama : ");
    
    var phone;
    do {
        phone = await func.question("Nomor Telepon : ");
    } while (!func.validator.isMobilePhone(phone, 'id-ID'));

    var mail;
    do {
        mail = await func.question("Email : ");
    } while (!func.validator.isEmail(mail));

    const contact = {
        name,
        phone,
        mail,
    };

    func.newContact(contact)
    func.rl.close();
}

main();
