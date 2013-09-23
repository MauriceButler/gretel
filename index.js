#!/usr/bin/env node

var program = require('commander'),
    packageJson = require('./package.json'),
    gretel;

function list(value) {
    return value.split(',') || [];
}

program._name = packageJson.name;
program
    .version(packageJson.version)
    .option('-s, --startUris <uris>', 'Uri(s) to start crawling from', list)
    .option('-q, --queuePath [filePath]', 'File path to load / save queue from')
    .parse(process.argv);

gretel = require('./gretel')(program.startUris);

if(!program.queuePath){
    program.queuePath = 'breadcrumbs.json';
}

process.on( 'SIGINT', function() {
    gretel.save(program.queuePath, function(error){
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
    console.log( 'All breadcrumbs have been followed...' );
    process.exit(0);
});

gretel.load(program.queuePath, function(error){
    if(error){
        return console.log(error.stack || error);
    }

    gretel.start();
});
