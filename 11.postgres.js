const express = require("express");
const app = express();
const pool = require("./src/conn/dbPostgres");
const port = 3000;

app.use(express.json());

app.get("/addsync", async (req,res) => {
    try {
        const name = "Muhammad Harry Rizky";
        const phone = "081322344456";
        const mail = "harry@mail.com";
        const newCont = await pool.query(
            "INSERT INTO data_contact (name, phone, mail) VALUES ($1, $2, $3) RETURNING *",
            [name, phone, mail]
        );
        res.json(newCont);
    }catch (err) {
        console.error(err.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});