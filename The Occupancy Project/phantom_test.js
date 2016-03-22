var phantom = require('phantom');
 
phantom.create().then(function(ph) {
  ph.createPage().then(function(page) {
    page.open('https://stackoverflow.com/').then(function(status) {
      console.log(status);
      page.property('content').then(function(content) {
        console.log(content);
        page.close();
        ph.exit();
      });
    });
  });
});