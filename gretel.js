module.exports = function(startUris){

    var Crawler = require('simplecrawler'),
        util = require('util'),
        url = require('url'),
        fs = require('fs'),
        fetchCondition = /\.pdf|\.js|\.css|\.ico|\.svg|\.png|\.jpg|\.jpeg|\.gif|\.csv$/i,
        defaultBreadcrumbFile = './breadcrumbs.json',
        gretel;

    function genericCallback(error){
        if(error){
            console.log(error.stack || error);
        }
    }

    if(!startUris || typeof startUris === 'string'){
        startUris = [startUris];
    }
    gretel = new Crawler();

    for (var i = 0; i < startUris.length; i++) {
        var newUrl = url.parse(startUris[i]);
        gretel.queue.add(newUrl.protocol, newUrl.host || newUrl.path, newUrl.port || 80, newUrl.host ? newUrl.path : '/', genericCallback);
    }

    gretel.filterByDomain = false;
    gretel.ignoreWWWDomain = true;
    gretel.stripQuerystring = true;
    gretel.timeout = 5000;

    gretel.addFetchCondition(function(parsedURL) {
        return !parsedURL.path.match(fetchCondition);
    });

    gretel.load = function(filePath, callback) {
        if(!callback){
            callback = function(error){
                if(error){
                    console.log(error.stack || error);
                }
            };
        }

        if(!filePath){
            filePath = defaultBreadcrumbFile;
        }

        fs.exists(filePath, function (exists) {
            if(exists){
                console.log( 'Loading previous breadcrumbs...' );
                gretel.queue.defrost(filePath, callback);
            } else {
                console.log( 'No breadcrumbs to load.' );
                callback();
            }
        });

    };

    gretel.save = function(filePath, callback) {
        if(!callback){
            callback = function(error){
                if(error){
                    console.log(error.stack || error);
                }
            };
        }

        if(!filePath){
            filePath = defaultBreadcrumbFile;
        }

        console.log( 'Saving breadcrumbs for later...' );
        gretel.queue.freeze(filePath, callback);
    };


    return gretel;

};