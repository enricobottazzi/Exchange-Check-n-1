const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

var EC = require('elliptic').ec;

// Create and initialize EC context
// (better do it once and reuse it)
var ec = new EC('secp256k1');

// Generate keys
var key1 = ec.genKeyPair();
var key2 = ec.genKeyPair();
var key3 = ec.genKeyPair();

// declare private and public keys
const privatekey1 = key1.getPrivate().toString(16);
const publickey1 = key1.getPublic().encode(`hex`);
const privatekey2 = key2.getPrivate().toString(16);
const publickey2 = key2.getPublic().encode(`hex`);
const privatekey3 = key3.getPrivate().toString(16);
const publickey3 = key3.getPublic().encode(`hex`)


const pair = {
  [publickey1] : privatekey1,
  [publickey2] : privatekey2,
  [publickey3] : privatekey3
}

console.log(pair)
// link balances with address

const balances = {
  [publickey1]: 50,
  [publickey2]: 75,
  [publickey3]: 100
}

// log balancese
console.log(balances)

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post('/send', (req, res) => {
  const {sender, recipient, amount, privateKey} = req.body;
  if (pair[sender] == privateKey) {
  balances[sender] -= amount;
  balances[recipient] = (balances[recipient] || 0) + +amount;
  res.send({ balance: balances[sender] });
}
  else { console.log ("no way")}

});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});