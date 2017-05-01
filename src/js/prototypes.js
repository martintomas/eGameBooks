var truncate = require('truncate-html')

//Format string
if (!String.prototype.format) { // First, checks if it isn't implemented yet.
    String.prototype.format = function(args) {
        if(!Array.isArray(args)) args = [args]
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ?
                args[number] :
                match;
        });
    };
}

//check if value is integer
Number.isInteger = Number.isInteger || function(value) {
    return typeof value === 'number' &&
        isFinite(value) &&
        Math.floor(value) === value;
};

//return string that has some define maximal length
String.shaveText = function(value, maxChars, maxLastWord = 20) {
    if (value.length < maxChars) return value //full string is selected --> no shave

    let val = value.slice(0, maxChars)
    let rest = value.slice(maxChars).split(' ', 2)

    if (rest[0].length < maxLastWord) {
        if (rest.length > 1) return val + rest[0] + ' ...' //use eclipse because there is some part of string missing
        else return val + rest[0] //return full string
    } else return val + rest[0].slice(0, maxChars) + '...'
}

String.shaveHTML = function(value, maxChars, args = {}) {
    return truncate(value, maxChars, args)
}