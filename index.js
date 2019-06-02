var http = require('http');
var fs = require('fs');
var path = require('path');


var folder = process.argv[2];
if (folder == null) {
	console.log('no folder specified');
	return;
}

var port = process.argv[3];
if (port == null) {
	console.log('no port specified');
	return;
}


var contentTypes = { 
js: 'text/javascript',
css: 'text/css',
woff2: 'font/woff2',
json: 'application/json',
png: 'image/png',
jpg: 'image/jpg',
ttf: 'font/ttf',
map: 'text/plain',
svg: 'image/svg+xml'
};

var defaultFile = 'index.html';

http.createServer(function (request, response) {
    var filePath = folder + request.url;
    if (filePath == folder+'/') {
        filePath = folder+'/'+defaultFile;
	}
	filePath=filePath.split("?")[0]; //remove some ?xxx at the end of the requested file
	
    var extname = path.extname(filePath).substring(1);
	
	var contentType = contentTypes[extname] == undefined ? 'text/html' : contentTypes[extname];
	
    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
				if (extname == "") {
					console.log("[301] "+filePath+" to index.html");
					filePath = folder+'/'+defaultFile;
					fs.readFile(filePath, function(error, content) {
						console.log("[200] "+filePath);
						response.writeHead(200, { 'Content-Type': contentType });
						response.end(content, 'utf-8');
					});
				} else {
					fs.readFile('./404.html', function(error, content) {
						response.writeHead(200, { 'Content-Type': contentType });
						response.end(content, 'utf-8');
					});
				}
            } else {
				console.log("[500] "+filePath);
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end(); 
            }
        }
        else {
			console.log("[200] "+filePath);
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(port);
console.log('Server running at http://127.0.0.1:'+port+'/');