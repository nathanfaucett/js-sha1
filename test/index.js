var tape = require("tape"),
    sha1 = require("..");


tape("sha1(message, options)", function(assert) {
    assert.equal(
        sha1("this is a test"),
        "4595c5b7ac9f265cdf89acec0069630697680f96",
        "should generate unique sha1 for text"
    );
    assert.end();
});
