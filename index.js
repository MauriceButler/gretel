#!/usr/bin/env node

var program = require('commander'),
    packageJson = require('./package.json'),
    gretel;

program._name = packageJson.name;
program
    .version(packageJson.version)
    .option('-s, --startUri [uri]', 'Uri to start crawling from')
    .option('-q, --queuePath [filePath]', 'File path to load / save queue from')
    .parse(process.argv);

gretel = require('./gretel')(program.startUri);

process.on( 'SIGINT', function() {
    console.log( "Saving breadcrumbs for later..." );
    gretel.queue.freeze("breadcrumbs.json", function(error){
        if(error){
            console.log(error.stack || error);
            process.exit(1);
        }
        process.exit(0);
    });
});

gretel.on('fetchcomplete', function(queueItem, data, response, callback) {
    console.log(queueItem.url);
    callback();
});

gretel.on('complete ', function() {
    console.log( "All breadcrumbs have been followed..." );
    process.exit(0);
});

gretel.load(program.queuePath, function(error){
    if(error){
        return console.log(error.stack || error);
    }

    gretel.start();
});
