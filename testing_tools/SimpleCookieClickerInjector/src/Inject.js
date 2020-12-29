
let script = document.createElement('script');
script.textContent = `
// functions from https://github.com/jdfreder/pingjs
/**
 * Creates and loads an image element by url.
 * @param  {String} url
 * @return {Promise} promise that resolves to an image element or
 *                   fails to an Error.
 */
function request_image(url) {
    return new Promise(function(resolve, reject) {
        var img = new Image();
        img.onload = function() { resolve(img); };
        img.onerror = function() { reject(url); };
        img.src = url + '?random-no-cache=' + Math.floor((1 + Math.random()) * 0x10000).toString(16);
    });
}

/**
 * Pings a url.
 * @param  {String} url
 * @param  {Number} multiplier - optional, factor to adjust the ping by.  0.3 works well for HTTP servers.
 * @return {Promise} promise that resolves to a ping (ms, float).
 */
function ping(url, multiplier) {
    return new Promise(function(resolve, reject) {
        var start = (new Date()).getTime();
        var response = function() { 
            var delta = ((new Date()).getTime() - start);
            delta *= (multiplier || 1);
            resolve(delta); 
        };
        request_image(url).then(response).catch(response);
        
        // Set a timeout for max-pings, 5s.
        setTimeout(function() { reject(Error('Timeout')); }, 5000);
    });
}

let InjectYourCCMod = setInterval(() => {
    console.log("Trying to inject your mod... ")   
    ping("http://localhost:5500/dist/index.js", 0.3).then(() => {
        if (typeof Game.LoadMod !== undefined) {
            console.log("YourCCMod Loaded!")
            Game.LoadMod("http://localhost:5500/dist/index.js");
            clearInterval(InjectYourCCMod)
        } else {
            console.log("Game not finished loading, trying again in 500ms.")
        }
    }).catch((err) => {
        if (err === "Timeout") {
            checkLocalhost()
        } else {
            console.log(err);
        }
    })
}, 500)
`;
script.id = 'yourccmod';
script.type = "text/javascript"
document.head.appendChild(script);