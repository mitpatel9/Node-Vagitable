const fs = require('fs');
const http = require('http');
const url = require('url')


const replacedata = (temp, product) => {
    let output = temp.replace(/<%PRODUCTNAME%>/g, product.productName);
    output = output.replace(/{%ID%}/g, product.id);
    output = output.replace(/<%PRODUCTIMG%>/g, product.image);
    output = output.replace(/<%PRODUCTQUANTITY%>/g, product.quantity);
    output = output.replace(/<%PRODUCTPRICE%>/g, product.price);
    output = output.replace(/<%PRODUCTDEC%>/g, product.description);
    return output;
}
// server and routing
const index = fs.readFileSync(`${__dirname}/Template/index.html`, 'utf-8');
const product = fs.readFileSync(`${__dirname}/Template/Product.html`, 'utf-8');
const card = fs.readFileSync(`${__dirname}/Template/Card.html`, 'utf-8');

const Data = fs.readFileSync(`${__dirname}/Data/Data.json`, 'utf-8');
const dataobject = JSON.parse(Data);



const server = http.createServer((req, res) => {

    const {query,pathname}=url.parse(req.url,true);

    if (pathname === "/") {

        const cardhtml = dataobject.map((el) => replacedata(card, el)).join(' ');
        const outputhtml = index.replace('<%PRODUCT_CARD%>', cardhtml)
        res.writeHead(200, { 'content-type': 'text/html' })
        res.end(outputhtml);

    } else if (pathname === '/product') {
        res.writeHead(200, { 'content-type': 'text/html' });
        const productdata=dataobject[query.id];
        const producthtml=replacedata(product,productdata)
        res.end(producthtml)
    } else if(pathname==='/api'){
        res.end(Data)
    }

})

server.listen(3000, () => {
    console.log("server is runnig is 3000 port")
})

