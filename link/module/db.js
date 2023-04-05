var sqlite3 = require('sqlite3').verbose();
var dbPath = `${__dirname}/db.db`;

let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    try {
        if (err) {
            console.log(err.message)
        } else {
            console.log("DB 연결 성공!")
        }
    } catch (err) {
        console.log(err)
    }
});

module.exports.db = db