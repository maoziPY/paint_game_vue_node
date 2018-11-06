var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/test";


const insertMany = (ctx, collection, data, db) => {
    ctx.collection(collection).insertMany(data, function(err, res) {
        if (err) throw err;
        console.log("插入的文档数量为: " + res.insertedCount);
        db.close();
    });
}

const close = () => {

}

const randomWord = () => {

}

const connect = () => {
    
}


 
var data = JSON.parse(fs.readFileSync(file));
MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("test");
    var myobj = data;
    insertMany(dbo, 'site', myobj, db);
    // dbo.collection("site").insertMany(myobj, function(err, res) {
    //     if (err) throw err;
    //     console.log("插入的文档数量为: " + res.insertedCount);
    //     db.close();
    // });

    // dbo.collection("site"). find({}).toArray(function(err, result) { // 返回集合中所有数据
    //     if (err) throw err;
    //     db.close();
    // });
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

module.exports = db;