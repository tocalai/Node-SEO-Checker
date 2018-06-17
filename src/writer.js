var _ = require('underscore');
var fs = require('fs');

function Writer() {
    this.filePath = null;
    this.outStream = null;
    this.pipes = [];
}

Writer.prototype.write = function(message) {
    if(message !== undefined && message !== '') {
        if(!_.isNull(this.pipes) && this.pipes.length > 0) {
            _.each(this.pipes, (pipe) => {
                    var that = this;
                    pipe(message, that);
            });
        }
    }    
}

const output2Console = (message, that) => {
    console.log(message);
};

Writer.prototype.createOutputConsole = function() {    
   this.pipes.push(output2Console);
   return this;
}

const output2File = (message, that) => {
    if(typeof that.filePath === 'undefined' || _.isNull(that.filePath)) {
        console.log('Error, file path not set properly');
        return;
    }

    fs.writeFile(that.filePath, message, function(err) {
        if(err) {
            console.log(err);
        }
    });    
}

Writer.prototype.createOutputFile = function(filePath) {
    this.filePath = filePath;
    this.pipes.push(output2File);
    return this;
}

const output2Stream = (message, that) => {
    if(typeof that.outStream === 'undefined' || _.isNull(that.outStream)) {
        console.log('Error, out stream not set properly');
        return;
    }


    try {
        that.outStream.write(message);
        that.outStream.end();
    }
    catch (err) {
        console.log('Output to stream occurred error: ' + err);
    }
}

Writer.prototype.createOutputStream = function(outStream) {
    this.outStream = outStream;
    this.pipes.push(output2Stream);
    return this;
}

module.exports = Writer;