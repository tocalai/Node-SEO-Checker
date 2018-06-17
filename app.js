var seoManager = require('./src/manager');


seoManager.Reader = require('./src/reader');
seoManager.Writer = require('./src/writer');
seoManager.RuleBase = require('./src/rulebase');
seoManager.Rule = require('./src/rule');

module.exports = seoManager;