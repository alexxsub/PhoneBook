
Phone.insertMany(array)
    .then( (docs)=> {
        console.log(docs);
        mongoose.connection.close() ;
    })
    .catch( (err)=> {
       console.log(err.message);
    });