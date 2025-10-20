import CryptoJS from "crypto-js";

const secretKey = "mySecretKey123"; // Replace with your actual secret key

const encryptedName = CryptoJS.AES.encrypt("Chris Brown", secretKey).toString();

console.log(encryptedName);
