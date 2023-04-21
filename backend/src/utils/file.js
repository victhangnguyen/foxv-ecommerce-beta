import fs from 'fs';
import url from 'url';
import path from 'path';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const rootDir = path.join(__dirname, '../..');

export const deleteFile = (dir, file) => {
  fs.readdir(dir, (error, file));
  return new Promise((resolve, reject) => {
    fs.unlink(dir + file, (err) => {
      if (err) reject(err);
      resolve(`Deleted ${file}`);
    });
  });
};

export const deleteFiles = (dir, files) => {
  //! localFunction
  const unlinkQueue = files.map(function (file) {
    return new Promise(function (resolve, reject) {
      const path = `${dir}\\${file}`;
      fs.unlink(path, (err) => {
        if (err) return reject(err);
        return resolve(path + ' was deleted!');
      });
    });
  });
  //! exec unlinkQueue
  return Promise.all(unlinkQueue)
    .then(function (files) {
      //! files: array
      console.log('All files have been successfully removed');
      return files;
    })
    .catch((error) => {
      console.log('__file\n__catch__error: ', error, '\n');
      throw error;
    });
};
