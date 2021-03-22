const fs = require('fs');
const path = require('path');

async function contractAddress() {
  const src = path.join(__dirname, '../frontend/contracts-address.json');
  const baseUrl = path.join(__dirname, '../frontend');
  const dist = path.join(__dirname, '../deployed-contracts.json');
  const assert = require('assert').strict;
  assert(fs.existsSync(dist), 'deployed-contracts.json 文件不存在！');
  if (!fs.existsSync(baseUrl)) {
    fs.mkdirSync(baseUrl);
  }
  if (fs.existsSync(src)) {
    fs.unlinkSync(src);
  }
  if (fs.existsSync(path.join(__dirname, '../frontend/contracts-abi.json'))) {
    fs.unlinkSync(path.join(__dirname, '../frontend/contracts-abi.json'));
  }
  copyFile(dist, src);
}

function copyFile(src, dist) {
  const fs = require('fs');
  fs.writeFileSync(dist, fs.readFileSync(src));
}

async function contractAbI() {
  const dist = path.join(__dirname, '../artifacts/contracts');
  const baseUrl = path.join(__dirname, '../frontend');
  const abiSrc = path.join(__dirname, '../frontend/contracts-abi.json');
  const assert = require('assert').strict;
  assert(fs.existsSync(dist), '部署文件不存在');
  if (!fs.existsSync(baseUrl)) {
    fs.mkdirSync(baseUrl);
  }
  let abi = {};
  extractABI(dist, abi);
  fs.writeFileSync(abiSrc, JSON.stringify(abi, null, 2));
}

function extractABI(dist, abi) {
  const files = fs.readdirSync(dist);
  files.forEach((fileName) => {
    let fileDir = path.join(dist, fileName);
    let stats = fs.statSync(fileDir);
    if (stats.isFile() && !/(\.dbg\.)|(\.DS_Store)/.test(fileName)) {
      abi[fileName.replace('.json', '')] = JSON.parse(
        fs.readFileSync(fileDir, { encoding: 'utf8' })
      ).abi;
    } else if (stats.isDirectory()) {
      extractABI(fileDir, abi);
    }
  });
}

function main() {
  return Promise.all([contractAddress(), contractAbI()]);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
