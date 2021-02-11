const fs = require('fs');
const { join, posix, resolve, parse } = require('path');
const readline = require('readline');
const { platform } = require('os');
const { validPath, hasPath } = require('./util');
const configFile = resolve(__dirname, '.config');

const folders = {
  dev: ['images', 'images/sprite', 'sass', 'js'],
  sass: ['base', 'layout', 'mixin', 'functions', 'utilities'],
  file: ['style-edit.scss'],
  source: ['css', 'images', 'js']
};

const config = {
  dev: '',
  source: '',
};

const create = {
  folders: async () => {
    const config = fs.readFileSync(configFile, 'utf8');
    const path = {
      dev: JSON.parse(config).dev,
      source: JSON.parse(config).source
    };
    const root = parse(path.dev).name;
    await createItem(path.dev, root, 'root');
    await createItem(path.dev, folders.dev, 'folder');
    await createItem(path.source, root, 'root');
    await createItem(path.source, folders.source, 'folder');
    await createItem(join(path.dev, 'sass'), folders.sass, 'folder');
    await createItem(join(path.dev, 'sass'), folders.file, 'file');
  },
  config: async () => {
    const exist = hasPath(configFile);
    const content = JSON.stringify(config, null, 2);
    if (exist) {
      console.log('.config 已存在');
    } else {
      console.log('.config 不存在，建立中...');
    }
    fs.writeFileSync(configFile, content);
    console.log('.config 已建立');
  },
}

async function createItem(path, itemName = [], type) {
  let itemExist;
  const create = {
    file: (path) => {
      fs.writeFileSync(path, '');
      console.log(`${path} 已建立`);
    },
    folder: path => {
      fs.mkdirSync(path);
      console.log(`${ path } 已建立`);
    },
  }

  itemName = typeof itemName == 'string' ? [itemName] : itemName;

  for (let i of itemName) {
    let endpoint = type === 'root' ? join(resolve(path, i), '..') : resolve(path, i);

    itemExist = hasPath(endpoint);
    if (itemExist) {
      console.log(`${i} 已存在`);
    } else {
      if (type === 'root') type = 'folder';
      create[type](endpoint);
    }
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('請輸入開發路徑 ex: ./src\r\n', answer => {
  config.dev = validPath(answer);
  rl.question('請輸入輸出路徑 ex: ./dist\r\n', answer => {
    config.source = validPath(answer);
    rl.close();
  })
})

rl.on('close', async() => {
  await create.config();
  await create.folders(config);
});
