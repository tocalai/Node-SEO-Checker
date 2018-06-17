var Manager = require('./../src/manager');

var manager = new Manager();

// locate the configuration and ruling setting file path
var configPath = './config.json';
var rulePath = './rules.json';

// bind the input/output according the configuration setting
manager.setInputOutput(configPath);

// perform the SEO checking and export to output destination
manager.checkSEO(rulePath).then(
    function(result) {
      console.log(result);
    },
    function(err) {
      console.log("Catch error: " + err);
    }
);