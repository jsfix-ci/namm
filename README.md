# namm

example reddit clone application: https://github.com/melnx/namm_example

sample usage:
```
require('namm')
    .public(__dirname + '/public')                // static folder completely accessible to the client
    //.layout(__dirname + '/public/base.html')    // [optional] override the layout if you want
    .partials(__dirname + '/public/partials')     // partial views to load for different model actions (e.g.: ./public/partials/posts/index.html)
    .favicon(__dirname + '/public/favicon.ico')   // [optional] favicon path
    .models(__dirname + "/models")                // models folder (e.g.: ./models/Post.js)
    .config(require('./config.js'))               // basic configuration file for mongo
    .stripe(require('./stripeOptions'))           // [optional] stripe options for recurring payment subscriptions
    .share({                                      // [optional] share data from server to client, configure menu/title
        title: "WebFone",
        menu:  {
            "Token" : "/Token",
            "Analytics" : "/Calls/pie",
            "History" : "/Calls"
        }
    })
    .routes(__dirname + '/routes')                // [optional] custom server-side endpoints
    //.services(__dirname + '/services')          // [optional] services shared with the angular app
    //.views(__dirname + '/views')                // [optional] login view override
    //.sockets()                                  // [optional] sockets for online status tracking/chat
    //.connectors('./connectors')
    .init();                                      // actually start the application
```
