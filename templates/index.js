module.exports = `
import 'babel-polyfill'; 
import 'isomorphic-fetch';
import Logger from 'js-logger';
import { sp } from "@pnp/sp";

(async function(){
    Logger.useDefaults(); 
    require('es6-promise').polyfill();
    sp.setup({
        sp: {
            defaultCachingStore: "local", // or "local"
            defaultCachingTimeoutSeconds: 360,
            globalCacheDisable: false, // or true to disable caching in case of debugging/testing
            headers: {
                Accept: "application/json;odata=verbose",
            },
            baseUrl: "Url of SP Web or SP Site"
        },
    });
    Logger.debug(sp); 
    
    const today = new Date(); 
    Logger.debug(today); 


    /* Set baseUrl, above, before uncommenting this section or using pnp
    let siteInfo = await sp.web.get()
    Logger.info(today + " :: Host: " + siteInfo.Url + " Site Name: " + siteInfo.Title + " Description: " + siteInfo.Description) ;
    */
  
})();
`