//Dependencies
const To_Regex = require("to-regex")

//Variables
const Self_Args = process.argv.slice(2)

var Self = {}

//Functions
Self.padLeft = function(str){
    return str[0] + str
}

Self.padRight = function(str) {
    return str + str[str.length - 1]
}

Self.replaceDots = function(str){
    return str.replace(/\./g, 'X')
}

Self.doubleEscape = function(str){
    return str.replace(/\\/g, '\\\\')
}

Self.prefixLn = function(str){
    return '\r\n\n\r' + str
}

Self.postfixLn = function(str){
    return str + '\r\n\n\r'
}

Self.replicateLn = function(str){
    return str.repeat(2) + '\u2028' + str
}

Self.sliceRight = function(str){
    let length = str.length / 2

    return str.slice(length)
}

Self.sliceLeft = function(str) {
    let length = str.length / 2

    return str.slice(0, length)
}

Self.flip = function(str){
    let length = str.length / 2

    return str.slice(length) + str.slice(0, length)
}

Self.reverse = function(str){
    str = str.split('')
    str = str.reverse()

    return str.join('')
}

Self.changeCase = function(str){
    if (str.toLowerCase() === str){
        str = str.toUpperCase()
    }else{
        str = str.toLowerCase()
    }

    return str
}

Self.shuffle = function(str){
    let arr = str.split('')
    let index = arr.length

    while (index--) {
        var rand = Math.floor(Math.random() * (index + 1))
        [arr[rand], arr[index]] = [arr[index], arr[rand]]
    }

    return arr.join('')
}

Self.shift = function(str){
    let arr = str.split('')
    let index = arr.length
    let rand = Math.ceil(Math.random() * 5)

    while (index--) {
        let char = arr[index]
        arr[index] = String.fromCharCode(
            char.charCodeAt(char) << rand
        )
    }

    return arr.join('')
}

function Fuzz(str, re, literalFlag){
    let flags = ''
    let outputs = {'matches': [], 'mismatches': []}
    if (!literalFlag) {
        re = re.trim()
        if (re.startsWith('/') && /\/\w*$/.test(re)) {
            let parts = re.split('/')
            flags = parts[2]
            re = parts[1]
        }
    }
    for (let func of Object.values(Self)) {
        let result
        let matchStr = func(str)
        if (matchStr === str)
            continue
        re = flags ? new RegExp(re, flags) : new RegExp(re)
        do {
            let dict = {}

            result = re.exec(matchStr)
            if(result !== null){
                dict.index = result.index
                dict.match = result[0]
                dict.input = result.input
                outputs.matches.push(dict)
            }else{
                outputs.mismatches.push(matchStr)
            }
        } while (re.lastIndex && result !== null && re.lastIndex !== matchStr.lastIndexOf(result) + 1)
    }

    return outputs
}

//Main
if(Self_Args.length == 0){
    console.log(`node index.js <regex> <flag> <string>
Example: node index.js /hello/ g hello_test`)
    process.exit()
}

if(Self_Args[0] == ""){
    console.log("Invalid regex.")
    process.exit()
}

if(Self_Args[1] == ""){
    console.log("Invalid flag.")
    process.exit()
}

if(Self_Args[2] == ""){
    console.log("Invalid string.")
    process.exit()
}

Self_Args[0] = To_Regex(Self_Args[0], { contains: true })
const results = Fuzz(Self_Args.slice(2).join(" "), /hello/, true)
console.log(results)
