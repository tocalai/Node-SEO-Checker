
var _ = require('underscore');
var cheerio = require('cheerio');
var when = require('when');
var fs = require('fs');

var Reader = require('./reader');
var Writer = require('./writer');
var Rule = require('./rule');

var writer = new Writer();


function Manager() {
    this.rules = [];
    this.reader = null;
    this.writer = null;
    this.dom = null;
}

Manager.prototype.addRule = function(oRule) {
    this.rules.push(oRule);
}

Manager.prototype.setReader = function (oReader) {
    this.reader = oReader;
}

Manager.prototype.setWriter = function (oWriter) {
    this.writer = oWriter;
}

function generateRules(ruleJson) {
    var rules = [];
    for(var key in ruleJson) {
        var root = typeof ruleJson[key].root === 'undefined' ? 'html' : ruleJson[key].root;
        var attrs = ruleJson[key].attrs;
        var values = ruleJson[key].values;
        var exists = ruleJson[key].is_exist;
        var enables = ruleJson[key].enable;
        var count = ruleJson[key].count;
        var sign = ruleJson[key].sign;

        var criteria = {};
        if(_.isArray(enables) && _.isArray(exists)) {
           for(var i = 0; i < enables.length; i++) {
                if (enables[i] === 0) {
                    var attr = typeof attrs === 'undefined' ? undefined : attrs[i];
                    var value = typeof values === 'undefined' ? undefined : values[i];
                    console.log('Root: ' + root + ', target tag: ' + key + ', attribute: ' + attr + ', value: ' + value + ' of rule were disabled');
                    continue;
                }

                criteria = {};
                criteria.is_exist = exists[i];
                if(typeof attrs === 'undefined' || attrs.length === 0) {                    
                    var tagExistedRule = new Rule.CheckTagExistedRule(root, key);
                    tagExistedRule.setCriteria(criteria);
                    rules.push(tagExistedRule);
                }
                else if(attrs.length > 0 && (typeof values === 'undefined' || values.length == 0)) {
                    criteria.attr = attrs[i];
                    var tagAttrExistedRule = new Rule.CheckTagAttrExistedRule(root, key);
                    tagAttrExistedRule.setCriteria(criteria);
                    rules.push(tagAttrExistedRule);
                }
                else if(attrs.length > 0 && values.length > 0) {
                    criteria.attr = attrs[i];
                    criteria.value = values[i];
                    var tagAttrValueExistedRule = new Rule.CheckTagAttrValueExistedRule(root, key);
                    tagAttrValueExistedRule.setCriteria(criteria);
                    rules.push(tagAttrValueExistedRule);
                }
           }
        }
        else {
            if(enables === 0) {
                console.log('Root: ' + root + ' target tag: ' + key + ' of rule were disabled');
                continue;
            }

            if(typeof count !== 'undefined' && typeof sign !== 'undefined') {
                // rule for checking occurrence 
                criteria.count = count;
                criteria.sign = sign;
                var tagOccurrenceRule = new Rule.CheckTagOccurenceRule(root, key);
                tagOccurrenceRule.setCriteria(criteria);
                rules.push(tagOccurrenceRule);
            }
        }

    }

    return rules;
    
}

Manager.prototype.setInputOutput = function(configPath) {
   // read config setting from config.json
   var configJson = JSON.parse(fs.readFileSync(configPath, 'utf8'));
   for(var key in configJson) {
      if(key.toString() === 'inputs') {     
        _.each(configJson[key], (input) => {
        var inFilePath = typeof input.file_path !== 'undefined' ||  input.file_path !== '' ? input.file_path : '/../test/test.html';     
            switch(input.type) {
              default:
                //this.setReader(new Reader().createInputFile(__dirname + inFilePath));
                this.setReader(new Reader().createInputFile(inFilePath));
                break;  
              case 'file':
                this.setReader(new Reader().createInputFile(inFilePath));
                break;
              case 'stream':
                var inStream = fs.createReadStream(inFilePath); 
                this.setReader(new Reader().createInputStream(inStream));
                break;      
           }
        });
        
      }
      else if(key.toString() === 'outputs') {
          _.each(configJson[key], (output) => {
                var outFilePath = '/../test/out.txt';
                switch(output.type) {
                  default:
                    this.setWriter(writer.createOutputConsole());
                    break;
                  case 'console':
                    this.setWriter(writer.createOutputConsole());
                    break;    
                  case 'file':
                    outFilePath = typeof output.file_path !== 'undefined' ||  output.file_path !== '' ? output.file_path : outFilePath;
                    this.setWriter(writer.createOutputFile(outFilePath));
                    break;
                  case 'stream':
                    outFilePath = typeof output.file_path !== 'undefined' ||  output.file_path !== '' ? output.file_path : outFilePath;
                    var outStream = fs.createWriteStream(outFilePath); 
                    this.setWriter(writer.createOutputStream(outStream));
                    break;
               }
            });
        }
    }
}

Manager.prototype.checkSEO = function(rulePath) {
    console.log('Start SEO analysis');
    console.log('---------------');

    var deferred = when.defer();

    var ruleJson = JSON.parse(fs.readFileSync(rulePath, 'utf8'));

    this.rules = generateRules(ruleJson);

    if (_.isNull(this.reader)) {
        deferred.reject(new Error('Invalid reader'));
        return;
    }

    this.reader().done(
        (result) => {
            this.dom = cheerio.load(result);

            var outputs = [];
            _.each(this.rules, (rule) => {
                rule.setDoc(this.dom);
                rule.validate();
                var result = rule.result();
                if(result !== '') {
                    outputs.push(result);
                }
            });
            
            if(outputs.length > 0 && !_.isNull(this.writer)) {
                this.writer.write(outputs.join('\r\n'));
            }

            console.log('---------------');
            deferred.resolve('End all SEO analysis');
        },
        (err) => {
            console.log(err);
            deferred.reject(err);
        }
      );

      return deferred.promise;

}



module.exports = Manager;