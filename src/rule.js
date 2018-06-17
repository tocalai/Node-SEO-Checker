var _ = require('underscore');

var RuleBase = require('./rulebase');

// rule check for tag existed
CheckTagExistedRule.prototype = new RuleBase();
CheckTagExistedRule.prototype.constructor = CheckTagExistedRule;

function CheckTagExistedRule(root, tag) {
    RuleBase.call(this, root);
    this.tag = tag;
}

CheckTagExistedRule.prototype.validate = function() {
   if(!_.isNull(this.doc)) {
      this.ret = this.doc(`${this.root} ${this.tag}`).length
   }
}

CheckTagExistedRule.prototype.result = function() {
    if(!_.isNull(this.ret) && !_.isNull(this.criteria)) {
        var message = 'This <' + this.root + '> ' + (this.ret > 0 ? 'have ' : 'without ') + '<' + this.tag + '> tag';
        var out = this.criteria.is_exist ^ this.ret;
        if(out === 0) {
            return message;
        }
        return '';
    }
}

// rule check tag occurrence
CheckTagOccurenceRule.prototype = new RuleBase();
CheckTagOccurenceRule.prototype.constructor = CheckTagOccurenceRule;

function CheckTagOccurenceRule(root, tag) {
    RuleBase.call(this, root);
    this.tag = tag;
}

CheckTagOccurenceRule.prototype.validate = function() {
    if(!_.isNull(this.doc)) {
       this.ret = this.doc(`${this.root} ${this.tag}`).length
    }
}

CheckTagOccurenceRule.prototype.result = function() {
    if(!_.isNull(this.ret) && !_.isNull(this.criteria)) {
        var out = eval(this.ret + ' ' + this.criteria.sign + ' ' + this.criteria.count);
        
        if(out) {
            var message = 'This <' + this.root + '> have ' + this.criteria.sign + ' ' +  this.criteria.count + ' ' + '<' + this.tag + '> tag';
            return message;
        }
        return '';
    }
}

// rule check for tag below's attribute exist
CheckTagAttrExistedRule.prototype = new RuleBase();
CheckTagAttrExistedRule.prototype.constructor = CheckTagAttrExistedRule;

function CheckTagAttrExistedRule(root, tag) {
    RuleBase.call(this, root);
    this.tag = tag;
}

CheckTagAttrExistedRule.prototype.validate = function() {
    if(!_.isNull(this.doc) && !_.isNull(this.criteria)) {
       if(this.criteria.is_exist == 0) {
           this.ret = this.doc(`${this.root} ${this.tag}:not([${this.criteria.attr}])`).length;
       } 
       else {
           this.ret = this.doc(`${this.root} ${this.tag}[${this.criteria.attr}]`).length;
       }
       
    }
}

CheckTagAttrExistedRule.prototype.result = function() {
    if(!_.isNull(this.ret) && !_.isNull(this.criteria)) {
        var message = '';
        if(this.ret > 0) {
            message = 'There are ' + this.ret + ' <' + this.tag + '> ' + (this.criteria.is_exist === 0 ? 'without ' : 'have ') + this.criteria.attr + ' attribute';
        }
        return message;
    }
}

// rule check for tag below's attribute's value exist
CheckTagAttrValueExistedRule.prototype = new RuleBase();
CheckTagAttrValueExistedRule.prototype.constructor = CheckTagAttrValueExistedRule;

function CheckTagAttrValueExistedRule(root, tag) {
    RuleBase.call(this, root);
    this.tag = tag;
}

CheckTagAttrValueExistedRule.prototype.validate = function() {
    if(!_.isNull(this.doc) && !_.isNull(this.criteria)) {
       this.ret = this.doc(`${this.root} ${this.tag}[${this.criteria.attr}*=${this.criteria.value}]`).length; 
    }
}

CheckTagAttrValueExistedRule.prototype.result = function() {
    if(!_.isNull(this.ret) && !_.isNull(this.criteria)) {
        var message = 'This <' + this.root + '> ' + (this.ret > 0 ? 'have ' : 'without ') + '<' + this.tag + '> tag ' + 'contain [attribute: ' + this.criteria.attr + ', value: ' + this.criteria.value + ']';
        var out = this.criteria.is_exist ^ this.ret;
        if(out === 0) {
            return message; 
        }
        return '';
    }
}


module.exports = {
    CheckTagExistedRule : CheckTagExistedRule,
    CheckTagOccurenceRule : CheckTagOccurenceRule,
    CheckTagAttrExistedRule : CheckTagAttrExistedRule,
    CheckTagAttrValueExistedRule : CheckTagAttrValueExistedRule
};