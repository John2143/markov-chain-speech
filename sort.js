let fs = require("fs");

let lineReader = require("readline").createInterface({
  input: fs.createReadStream("all.txt")
});

let rain = fs.openSync("rain.txt", "w");
let john = fs.openSync("john.txt", "w");

lineReader.on("line", function (line) {
    let dat = /(\[\d+:\d+:\d+ [AP]M\]) ([^:]+): (.+)/g.exec(line);
    if(!dat) return;
    let fd;
    if(dat[2].toLowerCase().indexOf("rain") == -1){
        fd = john;
    }else{
        fd = rain;
    }
    fs.writeSync(fd, dat[3] + "\n");
});

lineReader.on("close", function(){
    fs.closeSync(rain);
    fs.closeSync(john);
});
