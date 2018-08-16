# create-sp-vanilla-js
SharePoint Development Starter Kit

Non-opinionated SharePoint 2013 starter kit for vanilla client-side Javascript development. 
This project uses [parcel](https://github.com/parcel-bundler/parcel), [sp-rest-proxy](https://github.com/koltyakov/sp-rest-proxy), [@pnp/sp](https://pnp.github.io/pnpjs/sp/), and [babel](https://github.com/babel/babel), amoung other packages. 

Although your code with work with most modern browsers, the project was designed specifically to work on IE 10, as the SharePoint's default masterpage still targets IE 10 with a meta tag.  

## Getting Started

Install globally. 
````
npm install --global create-sp-vanilla-js
````
or 
````
yarn add --global create-sp-vanilla-js
````

Once installed, use the cli to create a new project. 
````
create-sp-vanilla-js my-new-project-name
````

*CD, into your project directory. Update your JavaScript in index.js. Html in index.html, the entry point for your solution, can also be used to set any global variables (handly when targeting CEWPs).
*Execute, npm run proxy, then answer the interactive questions to configure the proxy connection to your SharePoint site. Ctrl-c to end task.
*Execute, 
````
npm run dev 
````
(uses concurrently), to start the proxy and dev server simultaneously
*Develop interactively, with real SharePoint data. Enjoy!

### Prerequisites

Requires [Node.js](https://nodejs.org/)
It's very helpful if you have access to SharePoint 2013, since this is a SharePoint development starter kit.
Although the generated project will work with SharePoint 2016 and SharePoint Online, it is not optimized for SharePoint 2016 or Online. 
Please see my other starter kits for those platforms.


## Authors

* **Kayode Bristol** - *Initial work* - [create-sp2013-react-mobx-app](https://github.com/kayodebristol/create-sp2013-react-mobx-app)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments
Special thanks to [Andrew Koltyakov](https://github.com/koltyakov). 
