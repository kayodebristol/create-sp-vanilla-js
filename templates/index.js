module.exports = `
import 'babel-polyfill'; 
import 'isomorphic-fetch';
import { sp } from "@pnp/sp";

(async function(){
    require('es6-promise').polyfill();
    sp.setup({
        sp: {
            defaultCachingStore: "local", // or "local"
            defaultCachingTimeoutSeconds: 360,
            globalCacheDisable: false, // or true to disable caching in case of debugging/testing
            headers: {
                Accept: "application/json;odata=verbose",
            },
        },
    });
 
    const today = new Date(); 

    let siteInfo = await sp.web.get()
    Logger.useDefaults(); 
    Logger.debug("Host: " + siteInfo.Url + " Site Name: " + siteInfo.Title + " Description: " + siteInfo.Description) ;
  
})();
`