const mongoose =  require('mongoose');

updateLogSchema = mongoose.Schema({   
    success: { type: Boolean,required: true   },  
       saveDate: { type: Date, required: true, default: Date.now,expires: 60*60*24*2    } ,
        productImage:{type:String,required :true},}),



          module.exports = mongoose.model('Upload', updateLogSchema);