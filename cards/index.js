let fs = require('fs')

module.exports = function greenCards(){
    fs.readFile('green.txt', 'utf-8', (err, data) => {
        if (err) throw err;
        let greenCards = data.split(/\r?\n/);
        console.log(greenCards)
        return greenCards;
        });
}

module.exports = function redCards() {
    fs.readFile('red.txt', 'utf-8', (err, data) => {
        if (err) throw err;
        let redCards = data.split(/\r?\n/);
        console.log(redCards)
        return redCards;
      });
}