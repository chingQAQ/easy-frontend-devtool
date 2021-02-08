
const { writeFileSync, readFileSync } = require('fs');
const { join, posix, resolve } = require('path');
const readline = require('readline');
const { platform } = require('os');
const { validPath, hasPath } = require('./util.js');
const outputPath = resolve(__dirname, '.config');
const existence = hasPath(outputPath);
const config = {
  dev: '',
  source: '',
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = {
  input: () => new Promise(resolve => 
    rl.question('請輸入開發路徑 ex: ./src\r\n', answer => resolve(answer))),
  output: () => new Promise(resolve => 
    rl.question('請輸入輸出路徑 ex: ./dist\r\n', answer => resolve(answer))),
};

rl.on('close', createConfig);

function createConfig() {
  const merge = {};
  if (existence) {
    const old = JSON.parse(readFileSync(outputPath, 'utf8'));
    Object.keys(config).forEach(i => {
      if (config[i] !== old[i]) {
        console.log(`有新的${i}，覆蓋至${config[i]}`);
        merge[i] = config[i];
      } else {
        console.log(`${i}相同`)
        merge[i] = old[i];
      }
    })

    const content = JSON.stringify(merge, null, 2);
    writeFileSync(outputPath, content);
    console.log('.config 已合併');
  } else {
    console.log('.config 不存在，建立中...');
    const content = JSON.stringify(config, null, 2);
    writeFileSync(outputPath, content);
    console.log('.config 已建立');
  }
}

module.exports = async () => {
  try {
    Promise.all([
      await question.input(),
      await question.output()
    ])
    .then(([input, output]) => {
      config.dev = validPath(input) || '';
      config.source = validPath(output) || '';
      rl.close();
    })
  } catch (err) {
    console.error('設定錯誤或已取消', err)
    process.exit();
  }
}