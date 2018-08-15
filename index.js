#!/usr/bin/env node

let shell = require("shelljs");
let colors = require("colors");
let fs = require("fs"); //fs already comes included with node.

let appName = process.argv[2];
let appDirectory = `${process.cwd()}/${appName}`;

let rootTemplates = require("./templates/rootTemplates.js");


const CreateParcelApp = () => {
  return new Promise(resolve => {
    if (appName) {
      shell.exec("npm i parcel -g", () => {
        shell.exec(`mkdir ${appName}`, () => {
          console.log("Created app directory");
          shell.cd(`${appName}`), () =>{
            shell.exec(`git init`), ()=>{
              shell.exec(`npm init`)
            }
          }
          resolve(true);
        });
      });
    } else {
      console.log("\nNo app name was provided.".red);
      console.log("\nProvide an app name in the following format: ");
      console.log("\ncreate-sp-vanilla-js ", "app-name\n".cyan);
      resolve(false);
    }
  });
};

const cdIntoNewApp = () => {
  return new Promise(resolve => {
    shell.cd(`${appName}`);
    console.log(`\nEntering ${appName} folder`);
    resolve(true);
  });
};


const makeDirectories = () => {
  return new Promise(resolve => {
    shell.exec(
      `mkdir config`,
      console.log("\nCreated sp-rest-proxy config folder\n".green)
    );
    resolve(true);
  });
};

const updateTemplates = (template, path) => {
  return new Promise(resolve => {
    let promises = [];
    Object.keys(template).forEach((fileName, i) => {
      promises[i] = new Promise(res => {
        fs.writeFile(
          `${appDirectory}/${path}/${fileName}`,
          template[fileName],
          function(err) {
            if (err) {
              return console.log(err);
            }
            res();
          }
        );
      });
    });
    Promise.all(promises).then(() => {
      resolve();
    });
  });
};

const installPackages = () => {
  return new Promise(resolve => {
    console.log(
      "\nInstalling @pnp/common @pnp/graph, @pnp/logging, @pnp/odata, @pnp/sp, datejs, js-logger babel-ployfill babel-runtime es6-promise isomorphic-fetch \n"
        .cyan
    );
    shell.exec(
      'npm i @pnp/common @pnp/graph @pnp/logging @pnp/odata @pnp/sp datejs js-logger babel-ployfill babel-runtime es6-promise isomorphic-fetch',
      () => {
        console.log("\nFinished installing default packages\n".green);
        console.log("\nInstalling dev dependencies \n".cyan);
        shell.exec(
          "npm i --save-dev babel-preset-env sp-rest-proxy concurrently babel-plugin-js-logger babel-ployfill babel-runtime es6-promise isomorphic-fetch",
          () => {
            console.log("\nFinished installing dev dependencies\n".green);
            resolve();
          }
        );
      }
    );
  });
};

const updatePackageJSON = (filename, updateCb, cb) => {
  return new Promise(resolve => {
    fs.readFile(filename, function(er, data) {
      // ignore errors here, just don't save it.
      try {
        data = JSON.parse(data.toString("utf8"));
      } catch (ex) {
        er = ex;
      }

      if (er) {
        return cb();
      }

      data = updateCb(data);

      data = JSON.stringify(data, null, 2) + "\n";
      console.log(data);
      fs.writeFile(filename, data, err => {
        if (err) {
          console.log(err);
        }
      });
    });
    resolve(true);
  });
};

const run = async () => {
  let success = await CreateParcelApp();
  if (!success) {
    console.log(
      "Something went wrong while trying to create a new React app using create-react-app"
        .red
    );
    return false;
  }

  await updatePackageJSON(
    `${appDirectory}/package.json`,
    data => {
      console.log(typeof data);
      data = Object.assign({ proxy: "http://localhost:8080" }, data);
      data.scripts = Object.assign(
        {
          start: "parcel index.html --no-cache",
          proxy: "node ./api-server.js",
          startServers: "concurrently --kill-others \"npm run proxy\" \"npm run start\"",
          build: "parcel build index.js --out-dir {TargetDir} --out-file {FileName}" 
        },
        data.scripts
      );
      console.log(data);
      return data;
    },
    () => {
      console.log("Error updating package.json");
    }
  );
  await cdIntoNewApp();
  await makeDirectories();
  await updateTemplates(rootTemplates, "");
  await installPackages();
  console.log("All done!");
};
run();
