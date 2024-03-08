import crypto from 'crypto';
import fs from 'fs';

function generateRandomString (length){
    return crypto.randomBytes(length).toString('hex')
}

const secretKey = generateRandomString(32);

fs.writeFileSync('.env', `SECRET_KEY = ${secretKey}`, { flag : 'a'});
console.log("String generated:", secretKey);