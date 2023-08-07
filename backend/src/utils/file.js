import fs from "fs";
import fsExtra from "fs-extra";
import url from "url";
import path from "path";
import { error } from "console";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export const rootDir = path.join(__dirname, "../..");

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
  //! check all of files exist

  //! localFunction
  const unlinkQueue = files.map(function (file) {
    return new Promise(function (resolve, reject) {
      const path = `${dir}/${file}`;
      fs.unlink(path, (err) => {
        if (err) return reject(err);
        return resolve(path + " was deleted!");
      });
    });
  });

  //! exec unlinkQueue
  return Promise.all(unlinkQueue)
    .then(function (files) {
      //! files: array
      console.log("All files have been successfully removed");
      return files;
    })
    .catch((error) => {
      console.log("__file\n__catch__error: ", error, "\n");
      throw error;
    });
};

export async function checkFilePermission(path) {
  try {
    await fs.access(path, fs.constants.R_OK);
    console.log(path + "is Readable");
    return Promise.resolve(path + "is Readable");
  } catch (err) {
    console.error(path + "is Not readable");
    return Promise.reject(error);
  }
}

export function checkFilesPermission(dir, files = []) {
  const filesPermission = files.map((file) => {
    return new Promise(function (resolve, reject) {
      const path = `${dir}/${file}`;
      fs.access(
        path,
        // fs.constants.F_OK |
        fs.constants.R_OK | fs.constants.W_OK,
        // fs.constants.X_OK,
        (error) => {
          if (error) return reject(error);

          // console.log(`${file} ${error ? 'does not exist' : 'exists'}`);
          return resolve(`${file} is exists'}`);
        }
      );
    });
  });

  return Promise.all(filesPermission)
    .then(function (files) {
      //! files: array
      console.log("All files are exists");
      return files;
    })
    .catch(function (error) {
      throw error;
    });
}

export const deleteAndCopyFolder = async (sourceFolder, targetFolder) => {
  try {
    await fsExtra.remove(targetFolder);
    await fsExtra.copy(sourceFolder, targetFolder);
  } catch (error) {
    throw error;
  }
};
