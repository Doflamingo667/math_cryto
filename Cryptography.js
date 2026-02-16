function encryption(text, key){
    let result = ""
    const ASCII_START = 32; //You can check the ASCII table.
    const ASCII_RANGE = 95;

    for(let char of text){
        let code = char.charCodeAt(0); //Syntax to convert letter to ASCII
        
        if(code >= 32 && code <=126){
            result += String.fromCharCode((code - ASCII_START + key) % ASCII_RANGE + ASCII_START);
        }
        else{
            result += char;
        }
    }

    return result;
}

function decryption(text, key){
    let result = "";
    const ASCII_START = 32;
    const ASCII_RANGE = 95;

    for(let char of text){
        let code = char.charCodeAt(0);

        if(code >= 32 && code <= 126){
            result += String.fromCharCode((code - ASCII_START - key) % ASCII_RANGE + ASCII_START);
        }else{
            result += char;
        }
    }
    return result;
}

function force() {
    let text = document.getElementById("input").value;
    let output = document.getElementById("output");
    output.innerHTML = ""; 

    for (let i = 1; i <= 95; i++) {
        let decrypted = decryption(text, i);

        document.getElementById("result2").innerHTML += `
            <p><strong>Key ${i}:</strong> ${decrypted}</p>
        `;
    }
}

function encrypted(){
    let text = document.getElementById("text").value;
    let key = parseInt(document.getElementById("key").value);

    document.getElementById("result").innerHTML = "Result: " + encryption(text, key);
    document.getElementById("result").style.background = "yellow";

}

function decrypted(){
    let text = document.getElementById("text").value;
    let key = parseInt(document.getElementById("key").value);

    document.getElementById("result").innerHTML = "Result: " + decryption(text, key);
    document.getElementById("result").style.background = "yellow";
}

function force() {
    let text = document.getElementById("text2").value;
    let result = document.getElementById("result2");

    result.innerHTML = "";

    for (let i = 1; i <= 95; i++) {
        let decrypted = decryption(text, i);

        result.innerHTML += `
            <p><strong>Key ${i}:</strong> ${decrypted}</p>
        `;
    }
}

/// --- Core Math Functions ---

// 1. Check if a number is prime
function isPrime(num) {
    if (num <= 1n) return false;
    if (num <= 3n) return true;
    if (num % 2n === 0n || num % 3n === 0n) return false;
    for (let i = 5n; i * i <= num; i += 6n) {
        if (num % i === 0n || num % (i + 2n) === 0n) return false;
    }
    return true;
}

// 2. Greatest Common Divisor
function gcd(a, b) {
    while (b !== BigInt(0)) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
}

// 3. Modular Exponentiation (base^expo mod m)
function power(base, expo, m) {
    let res = BigInt(1);
    base = BigInt(base) % BigInt(m);
    let e = BigInt(expo);
    while (e > BigInt(0)) {
        if (e % BigInt(2) === BigInt(1)) res = (res * base) % BigInt(m);
        base = (base * base) % BigInt(m);
        e = e / BigInt(2);
    }
    return res;
}

// 4. Modular Inverse (Extended Euclidean Algorithm)
function modInverse(e, phi) {
    let m0 = phi, t, q;
    let x0 = BigInt(0), x1 = BigInt(1);
    if (phi === BigInt(1)) return BigInt(0);
    while (e > BigInt(1)) {
        q = e / phi;
        t = phi;
        phi = e % phi, e = t;
        t = x0;
        x0 = x1 - q * x0;
        x1 = t;
    }
    if (x1 < BigInt(0)) x1 += m0;
    return x1;
}

// --- Interaction Functions ---

function KeyGenerate() {
    const pInput = document.getElementById('p').value;
    const qInput = document.getElementById('q').value;

    if (!pInput || !qInput) return alert("សូមបញ្ចូល p និង q!");

    const p = BigInt(pInput);
    const q = BigInt(qInput);

    // Validate Primes
    if (!isPrime(p)) return alert(`p = ${p} មិនមែនជាចំនួនបឋមទេ!`);
    if (!isPrime(q)) return alert(`q = ${q} មិនមែនជាចំនួនបឋមទេ!`);

    const n = p * q;
    const phi = (p - BigInt(1)) * (q - BigInt(1));

    // Common e = 65537
    let e = BigInt(65537); 
    if (gcd(e, phi) !== BigInt(1)) {
        e = BigInt(3);
        while (gcd(e, phi) !== BigInt(1)) {
            e += BigInt(2);
        }
    }

    let d = modInverse(e, phi);

    // បង្ហាញលទ្ធផលសម្រាប់ឱ្យអ្នកប្រើចម្លងទុកដោយខ្លួនឯង
    document.getElementById('result3').innerHTML = `
        <span style="color: green;">បង្កើតកូនសោរជោគជ័យ:</span><br>
        <strong>n:</strong> ${n} <br>
        <strong>e:</strong> ${e} <br>
        <strong>d:</strong> ${d}
    `;
    
    
}

function RSAencrypt() {
    const msg = document.getElementById('textEn').value;
   
    const e = BigInt(document.getElementById('e1').value);
    const n = BigInt(document.getElementById('n1').value);

    if (n < 128n) {
        alert("ប្រយ័ត្ន៖ តម្លៃ n តូចជាង 128 អាចនឹងធ្វើឱ្យការបំប្លែងអក្សរ ASCII មិនត្រឹមត្រូវ!");
    }

    let cipherArray = [];
    for (let i = 0; i < msg.length; i++) {
        let m = BigInt(msg.charCodeAt(i));
        if (m >= n) {
            alert(`អក្សរ "${msg[i]}" មានតម្លៃ ASCII ${m} ធំជាង n (${n})។ វានឹង Decrypt ចេញខុស!`);
        }
        cipherArray.push(power(m, e, n));
    }
    
    // បង្ហាញតែលទ្ធផលក្នុង span ប៉ុណ្ណោះ
    document.getElementById('enResult').innerText = cipherArray.join(",");
    
    // ចំណុចកែប្រែ៖ លុបបន្ទាត់ដែលបញ្ជូនទៅ textDe ចេញ
}

function RSAdecrypt() {
    const cipherText = document.getElementById('textDe').value;
    // ត្រូវប្រាកដថា ID ក្នុង HTML គឺ "d" និង "n2"
    const d = BigInt(document.getElementById('d').value);
    const n = BigInt(document.getElementById('n2').value);

    if (!cipherText) return alert("សូមបញ្ចូល Ciphertext!");

    let codes = cipherText.split(",");
    let result = "";

    for (let c of codes) {
        if(c.trim() === "") continue;
        try {
            let m = power(BigInt(c.trim()), d, n);
            result += String.fromCharCode(Number(m));
        } catch (err) {
            console.error("Error during decryption:", err);
        }
    }

    document.getElementById('deResult').innerText = result;
}