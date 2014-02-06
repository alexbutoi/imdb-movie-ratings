function writeCsv() {
    var csv = '';
    for (var i = 0; i < arguments.length - 1; i++) {
        csv += arguments[i] + ';';
    }
    if (arguments.length > 0) {
        csv += arguments[arguments.length - 1];
    }
    process.stdout.write(csv);
    process.stdout.write('\n');
}
 
function processMovie(movie) {
    http.get('http://www.omdbapi.com/?i=&t=' + encodeURIComponent(movie), function (res) {
        var data = '';
        res.setEncoding('utf8');
        res.on('data', function (chunk) { data += chunk });
        res.on('end', function () {
            var movieData = JSON.parse(data);
            var rating = movieData.imdbRating || 'n/a';
            var year = movieData.Year || 'n/a';
            var genre = movieData.Genre || 'n/a';
            var title = movieData.Title || 'n/a';
	    var awards = movieData.Awards || 'n/a';
            writeCsv(movie, title, rating, genre, year, awards);
        });
    });
}
 
var fs = require('fs');
var http = require('http');
var stream = fs.createReadStream(process.argv[2], { flags: 'r', encoding: 'utf8', fd: null,bufferSize: 1 });
var line = '';
 
stream.on('data', function (chunk) {
    for(var i = 0; i < chunk.length; i++){
        var char = chunk[i];
        if(char == '\n' || char == '\r'){
 
            line = line.replace(/^\uFEFF/, '');
 
            if (line.length > 0) {
                processMovie(line);
            }
 
            line = '';
        }
        else {
            line += char;
        }
    }
});
