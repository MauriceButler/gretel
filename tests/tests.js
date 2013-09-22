var test = require('tape'),
    gretel = require('../gretel');

test('gretel Exists', function (t) {
    t.plan(2);
    t.ok(gretel, 'gretel Exists');
    t.equal(typeof gretel, 'function');
});
