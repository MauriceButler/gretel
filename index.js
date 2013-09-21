var Crawler = require("simplecrawler"),
    program = require('commander'),
    packageJson = require('./package.json'),
    fetchCondition = /\.pdf|\.js|\.css|\.ico|\.svg|\.png|\.jpg|\.gif$/i,
    crawler;

program._name = packageJson.name;
program
    .version(packageJson.version)
    .option('-s, --start [uri]', 'Uri to start crawling from')
    .parse(process.argv);

crawler = new Crawler(program.start);

console.log( "Loading previous breadcrumbs..." );
crawler.queue.defrost("breadcrumbs.json");

crawler.filterByDomain = false;

crawler.addFetchCondition(function(parsedURL) {
    return !parsedURL.path.match(fetchCondition);
});

crawler.on("fetchcomplete",function(queueItem, data, response, callback) {
    console.log(queueItem.url);
});

crawler.start();

process.on( 'SIGINT', function() {
    console.log( "Saving breadcrumbs for later..." );
    crawler.queue.freeze("breadcrumbs.json", function(error){
        if(error){
            console.log(error.stack || error);
            process.exit(1);
        }
        process.exit(0);
    });
});


