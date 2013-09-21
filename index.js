var Crawler = require("simplecrawler"),
    crawler = new Crawler("www.example.com"),
    fetchCondition = /\.pdf|\.js|\.css|\.ico|\.svg|\.png|\.jpg|\.gif$/i;

// Defrost queue
console.log( "Loading previous breadcrumbs..." );
crawler.queue.defrost("breadcrumbs.json");

crawler.filterByDomain = false;

crawler.addFetchCondition(function(parsedURL) {
    return !parsedURL.path.match(fetchCondition);
});

crawler.on("fetchcomplete",function(queueItem, data, response, callback) {
    console.log(queueItem.url);
    // console.log(queueItem.host);
});

crawler.start();

process.on( 'SIGINT', function() {
    console.log( "Saving breadcrumbs for later..." );
    // // Freeze queue
    crawler.queue.freeze("breadcrumbs.json");
    process.exit();
});


