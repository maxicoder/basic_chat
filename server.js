/**
 * Created by Maxi on 09/05/2015.
 */

var http = require('http'); 
var fs = require('fs'); 
var path = require('path'); 
var mime = require('mime');
var cache = {};

function send404(response) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found.');
    response.end();
}

function sendFile(response, filePath, fileContents) {
    response.writeHead(
        200,
        {"content-type": mime.lookup(path.basename(filePath))}
    );
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
    if (cache[absPath]) {
        console.log("Yes, the file : " + absPath + " is in the cache. Calling sendFile!");
        sendFile(response, absPath, cache[absPath]);
    } else {
        console.log("File " + absPath + " not in cache. Does it exists?");
        fs.exists(absPath, function(exists) {
            if (exists) {
                console.log("Yes, " + absPath + " exists. Serve it!");
                fs.readFile(absPath, function(err, data) {
                    if (err) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                console.log("File " + absPath + " not in cache and doesn't exist. Calling send404!");
                send404(response);
            }
        });
    }
}

var server = http.createServer(function(request, response) {
    console.log("HTTP request arrived...");
    var filePath = false;

    if (request.url == '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + request.url;
    }
    var absPath = './' + filePath;

    serveStatic(response, cache, absPath);
});

server.listen(3000, function() {
    console.log("Server listening on port 3000.");
    console.log("");
});

var chatServer = require('./lib/chat_server');
chatServer.listen(server); 


































































