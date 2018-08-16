#!/usr/bin/env node

let shell = require("shelljs");
let colors = require("colors");
let fs = require("fs"); //fs already comes included with node.
let proc = require("child_process"); 
let appName = process.argv[2];
let appDirectory = `${process.cwd()}/${appName}`;

let rootTemplates = require("./templates/rootTemplates.js");


const installParcel = () => {
  return new Promise(resolve => {
    if (appName) {
      if(!shell.which("parcel")){
        shell.exec("npm i parcel-bundler -g", () => {
          resolve(true);
        });
      } else{
        resolve(true);
      }
    } else {
      console.log("\nNo app name was provided.".red);
      console.log("\nProvide an app name in the following format: ");
      console.log("\ncreate-sp-vanilla-js ", "app-name\n".cyan);
      resolve(false);
    }
  });
};

const gitInit = ()=>{
  return new Promise((resolve, reject)=>{
    if(shell.which("git")){
      proc.execFileSync("git", ["init"], {stdio: "inherit", shell: true}); 
    }
    resolve(true); 
  })
}

const npmInit = ()=>{
  return new Promise((resolve, reject)=>{
    proc.execFileSync("npm", ["init"], {stdio: "inherit", shell: true}); 
    resolve(true); 
  })
}

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
      `mkdir ${appName}`,
      console.log("\nCreated application folder\n".green)
    );
    shell.exec(
      `cd ${appName} && mkdir config`,
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
      "\nInstalling @pnp/common @pnp/graph @pnp/logging @pnp/odata @pnp/sp datejs js-logger babel-polyfill babel-runtime es6-promise isomorphic-fetch"
        .cyan
    );
    shell.exec(
      "\nnpm i @pnp/common @pnp/graph @pnp/logging @pnp/odata @pnp/sp datejs js-logger babel-polyfill babel-runtime es6-promise isomorphic-fetch",
      () => {
        console.log("\nFinished installing default packages\n".green);
        console.log("\nInstalling dev dependencies \n".cyan);
        shell.exec(
          "npm i --save-dev  sp-rest-proxy concurrently babel-preset-env babel-plugin-js-logger babel-core babel-plugin-transform-runtime",
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

  let success = await installParcel();
  if (!success) {
    console.log(
      "\nSomething went wrong while trying to install parcel-bundler"
        .red
    );
    return false;
  }
  
  await makeDirectories();
  await cdIntoNewApp();
  await gitInit(); 
  success = await npmInit(); //proc.execFileSync('npm', ['init'], {stdio: 'inherit'}); 
  if(!success){
    console.log(
      "\nSomething went wrong runing npm init!"
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
          start: "parcel index.html --no-cache --open",
          proxy: "node ./api-server.js",
          dev: "concurrently --kill-others \"npm run proxy\" \"npm run start\"",
          build: "parcel build index.html " 
        },
        data.scripts
      );
      console.log(data);
      return data;
    },
    () => {
      console.log("\nError updating package.json");
    }
  );

  await updateTemplates(rootTemplates, "");
  await installPackages();

  console.log("\nAll done!");
  
  console.log("\nThis starter kit uses SharePoint Patterns and Practices (pnp) to retrieve SharePoint Data."
  .blue); 
  console.log("\nsp-rest-proxy allows communication with SharePoint while developing in nodejs."
  .blue); 
  console.log("\nGetting Started: "
  .green); 
  console.log("\n1. CD, into your project directory. Update your JavaScript in index.js. Html in index.html, the entry point for your solution, can also be used to set any global variables (handly when targeting CEWPs). index."
  .bold); 
  console.log("\n2. Execute, npm run proxy, then answer the interactive questions to configure the proxy connection to your SharePoint site. Ctrl-c to end task."
  .bold); 
  console.log("\n3. Execute, npm run dev (uses concurrently), to start the proxy and dev server simultaneously."
  .bold); 
  console.log("\n4. Develop interactively, with real SharePoint data. Enjoy!"
  .bold);

};
run();
