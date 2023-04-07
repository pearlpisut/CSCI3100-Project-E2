const {MongoClient} = require('mongodb')
const uri = "mongodb+srv://pearl:pearl_e2_3100@battlego.wywajfd.mongodb.net/?retryWrites=true&w=majority";
let collection

module.exports = {
    connectToDb: (cb) => {
        collection = []
        MongoClient.connect(uri)
            .then((client => {
                collection = client.db("test")
                return cb()
            }))
            .catch(err => {
                console.log(err)
                return cb(err)
            })
    },
    getDb: () => collection
}