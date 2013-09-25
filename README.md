Gretel
======

Follows and collects breadcrumbs across the web.

Heavily relies on [Christopher Giffard's node-simplecrawler](https://github.com/cgiffard/node-simplecrawler)

Usage
=====

###CLI
    gretel [options]

    Options:

      -h, --help                  output usage information
      -V, --version               output the version number
      -s, --startUri [uri]        Uri to start crawling from
      -q, --queuePath [filePath]  File path to load / save queue from


###Module
    var gretel = require('gretel')('www.example.com');

    gretel.start();


Optionally load / save breadcrumb queue state

    gretel.load('./breadcrumbs.json', function(error){
        if(error){
            return console.log(error.stack || error);
        }

        gretel.start();
    });

    gretel.queue.freeze("./breadcrumbs.json", function(error){
        if(error){
            console.log(error.stack || error);
        }
    });

Other settings on gretel are the same as node-simplecrawler (she is actually an instance of Crawler)
for more info and examples see the [readme for node-simplecrawler](https://github.com/cgiffard/node-simplecrawler)

    // sync processing
    gretel.on('fetchcomplete', function(queueItem, data, response) {
        console.log(queueItem.url);
    });

    // async processing
    gretel.on("fetchcomplete", function(queueItem, data, response) {
        var continue = this.wait();
        doSomethingAsync(data, function(){
            console.log(queueItem.url);
            continue();
        });
    });