let encryptLib = require("cryptlib");
let constants = {
    encryptionKey: encryptLib.getHashSha256("xza548sa3vcr641b5ng5nhy9mlo64r6k", 32),
    encryptionIV: "5ng5nhy9mlo64r6k",
    link: "https://amazons3.com/",
    host_mail: "smtp.gmail.com",
    port_base_url: "http://localhost:5000/"
}

module.exports = constants;