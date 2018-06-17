function RuleBase(root) {
    this.dom = null;
    this.criteria = null;
    this.root = root !== '' ? root : "html";
    this.ret = null;
}

RuleBase.prototype.setDoc = function(oDoc) {
    this.doc = oDoc;
}

RuleBase.prototype.setCriteria = function(oCriteria) {
    this.criteria = oCriteria;
}

RuleBase.prototype.validate = function() {}
RuleBase.prototype.result = function() {}

module.exports = RuleBase;