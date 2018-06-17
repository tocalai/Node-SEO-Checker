var fs = require('fs');
var when = require('when');

function Reader() {
}

Reader.prototype.createInputFile = function(filePath) {

    // read function
    return function() {
        var deferred = when.defer();
        fs.readFile(filePath, (err, data) => {
            if (err)  {
                return deferred.reject(err);
            }
            var rawHtml = data.toString().replace((/  |\r\n|\n|\r/gm), '');
            deferred.resolve(rawHtml);
        });
        return deferred.promise;
    };
}

Reader.prototype.createInputStream = function(inStream) {
    return function(){
        var deferred = when.defer();
        var rawHtml = '';
        if (typeof inStream !== 'object' && typeof inStream.on !== 'function') {
            deferred.reject('Invalid stream object');
        } else {
            inStream.on('data', (buf) => {
            rawHtml = buf.toString().replace((/  |\r\n|\n|\r/gm), '');
          });
          inStream.on('error', (err) => {
            deferred.reject(err);
          });
          inStream.on('end', () => {
            deferred.resolve(rawHtml);
          });
        }
        return deferred.promise;
      };
}


module.exports = Reader;