// first we do a search, and specify a scroll timeout
client.search({
  index: 'project.chatbot-test.*',
  scroll: '10s',
  body: query_json
}, function getMoreUntilDone(error, response) {

  var obj = JSON.parse(JSON.stringify(response))
   var all_hits = obj.body;
  // console.log(obj);
 
  //collect all the records
  obj.body.hits.hits.forEach(function (hit) {
    //console.log(hit);
    allRecords.push(hit);
  });

  if (obj.body.hits.total !== allRecords.length) {
    // now we can call scroll over and over
    client.scroll({
      scrollId: obj.body._scroll_id,
      scroll: '10s'
    }, getMoreUntilDone);
  } else {
    console.log('all done');
  }

  console.log("TOTAL LENGHT OF ARRAY : " + allRecords.length);
  //console.log(allRecords[0]);
});