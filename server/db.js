var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/test";

let [dbData, ctx, collection, db] = [[], null, 'site', null];

const insertMany = () => {
    ctx.collection(collection).insertMany(data, function(err, res) {
        if (err) throw err;
        console.log("插入的文档数量为: " + res.insertedCount);
        db.close();
    });
}

const initData = () => {
    return new Promise((resolve, reject) => {
        ctx.collection(collection). find({}).toArray(function(err, result) { // 返回集合中所有数据
            resolve(result);
            dbData = result;
            if (err) reject(err);
            db.close();
        });
    })
    // ctx.collection(collection). find({}).toArray(function(err, result) { // 返回集合中所有数据
    //     dbData = result;
    //     if (err) throw err;
    //     db.close();
    // });
}

const randomWord = () => {
    console.log(dbData.length)
    if (!dbData.length) {
        initData().then((data) => {
            console.log(data.length)
        })
    }
    // return dbData[Math.floor(Math.random()*dbData.length)];
}


// node 获取数据
// var file = __dirname+'/db.json';
// dbData = JSON.parse(fs.readFileSync(file));
MongoClient.connect(url, function(err, _db) {
    if (err) throw err;
    db = _db;
    ctx = _db.db("test");
    // insertMany(dbo, 'site', myobj, db);
    // initData()
    randomWord()
});



// var db = (function () {

//     var file = __dirname+'/db.json';
//     var db = JSON.parse(fs.readFileSync(file));
//     // return {
//         save : function () {
//             fs.writeFile(file,JSON.stringify(db,null,4));
//         },
//         add : function (word,tip) {
//             if(db.findIndex(x=>{return x.word===word;})!=-1){
//                 console.error(new Error(word+' existed'));
//                 return false;
//             }
//             db.push({word:word,tip:tip});
//             return true;
//         },
//         randomWord :function () {
//             return db[Math.floor(Math.random()*db.length)];
//         },
//         _db:db
//     }
// })();

// module.exports = db;
module.exports = {randomWord};