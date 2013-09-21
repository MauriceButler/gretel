module.exports = function(startUri){

    var Crawler = require('simplecrawler'),
    fs = require('fs'),
        fetchCondition = /\.pdf|\.js|\.css|\.ico|\.svg|\.png|\.jpg|\.gif$/i,
        defaultBreadcrumbFile = './breadcrumbs.json',
        gretel = new Crawler(startUri);

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