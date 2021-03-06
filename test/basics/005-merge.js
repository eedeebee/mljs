var mljs = require("../../mljs"),
    tests = exports,
    assert = require('assert'),
    winston = require('winston');

var logger = new (winston.Logger)({
  transports: [
    new winston.transports.File({ filename: 'logs/005-merge.log' })
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/005-merge.log' })
  ]
});

describe("005-merge",function() {
  it("Should complete entirely",function(done){
  var db = new mljs(); // default options
  db.setLogger(logger);
  
  // add three docs to the collection
  var col = {collection: "mergecol"};
  var uris = ["/merge/1"];
  var json1 = {name:"first whippet"};
  var json2 = {weight: "120lbs"};
  db.save(json1,uris[0],col,function(result) {
    assert(!result.inError,"Error saving doc");
    db.merge(json2,uris[0],function(result) {
      assert(!result.inError,"Error merging doc");
      db.get(uris[0],function(result) {
        assert(!result.inError,"Error getting doc");
        logger.debug("TEST: MERGE: merged doc: " + result.doc);
        //assert(json1.concat(json2) == result.doc);  
        assert((json1.name==result.doc.name && json2.weight == result.doc.weight),"Result should have name and weight: " + JSON.stringify(result.doc))
        db.delete(uris[0],function(result) {
          assert(!result.inError,"Error deleting doc");
          done();
        });
      });
    });
  });
});});