const http = require("http");
const fs = require("fs");

const port = 3000;



http.createServer((req, res) => {
    const url = req.url;

    const renderPage = (path, res) => {
        res.writeHead(200, {"content-type" : "text/html"});
        const data = fs.readFileSync(path, "utf-8");
        res.write(data);
        res.end();
    }

    if (url === "/"){
        renderPage("./views/index.html", res);
    }else if (url === "/about"){
        renderPage("./views/about.html", res);
    }else if (url === "/contact"){
        renderPage("./views/contact.html", res);
    }else{
        res.writeHead(404, {"content-type" : "text/html"});
        res.write("<center><h1>404 : Page Tidak Ditemukan</h1></center>");
        res.end();
    }
})
.listen(port, () => {
    console.log(`Server is running on port ${port}`);  
})