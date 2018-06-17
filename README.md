## Installation
`npm install --save node-seo-checker`

## Usage
```

var Manager = require('node-seo-checker');

var manager = new Manager();

// locate the configuration and (pre-defined)ruling setting file path
var configPath = './config.json'; // more detail, please see section: setting description
var rulePath = './rules.json'; // more detail, please see section: setting description

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
```
## Setting description

> **Config.json**
>```
>{
>    "inputs" :[
>    {
>       "type" : "stream", // we could use type: file as another input as well
>       "file_path" : "C:\\xxxx\\test\\test.html"
>    }
>],
>    "outputs" :[
>    {
>        "type" : "console"
>    },
>    {
>        "type" : "file",
>        "file_path" : "C:\\xxxx\\test\\scan.txt"
>    },
>    {
>        "type" : "stream",
>        "file_path" : "C:\\xxxx\\test\\out_stream.txt"
>    }
>]
>}
>```

- It could assign input type as file or stream (node stream)
- It could assign multiple outputs types(console & file & stream), they might export multiple as well

----------

> **rule.json**
>```
>{
>    "img" : 
>    {
>        "attrs" : ["alt"],
>        "is_exist" : [0],
>        "enable" : [1]
>    },
>    "a" :
>    {
>        "attrs" : ["rel"],
>        "is_exist" : [0],
>        "enable" : [1]
>    },
>    "title" :
>    {
>        "root" : "head",
>        "attrs" : [],
>        "is_exist" : [0],
>        "enable" : [1]
>    },
>    "meta" :
>    {
>        "root" : "head",
>        "attrs" : ["name", "name"],
>        "values" : ["descriptions", "keywords"],
>        "is_exist" : [0, 0],
>        "enable" : [1, 1]
>    },
>    "strong" :
>    {
>        "count" : 15,
>        "sign" : ">=",
>        "enable" : 1
>    },
>    "h1" :
>    {
>        "count" : 1,
>        "sign" : ">=",
>        "enable" : 1
>    }
>}
>```

- Outer tag as target tag, ex: `img`
- If root tag not defined, default would be `html`
- Property is_exist: 0, indicate check doesn't have; otherwise (is_exist: 1), check have
- Property enable: 0, turn off the rule; enable:1, turn on the rule checking 

## Customize
- Flexible for add new rule, for instance checking meta tag, attribute name='robots' doesn't exist, it could easily add below snippet into rule.json file

```
  "meta" :
  {
        "root" : "head",
        "attrs" : ["name", "name", "name"],
        "values" : ["descriptions", "keywords", "robots"],
        "is_exist" : [0, 0, 0],
        "enable" : [1, 1, 1]
  },
```
- Also it could add new rule via extend the **RuleBase**
```

var Manager = require('node-seo-checker');
var RuleBase = require('node-seo-checker').RuleBase;
var manager = new Manager();

xxxNewRule.prototype = new RuleBase();
xxxNewRule.prototype.constructor = xxxNewRule;

function xxxNewRule(root) {
    Rule.call(this, root);
    // constructor ...
}
xxxNewRule.prototype.validate = function() {
    // validate logic ...
}
xxxNewRule.prototype.result = function() {
    // result ...
}

manager.addRule(xxxNewRule);
```
