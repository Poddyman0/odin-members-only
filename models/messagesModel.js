const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: {type: String, required: true},
    timestamp: { type: Date, default: Date.now },
    text: {type: String, required: true},    
    messageByUser: { type: Schema.Types.ObjectId, ref: "User" },
})

MessageSchema.virtual("url").get(function () {
    return `/catalog/message/${this._id}`;
  });

MessageSchema.virtual("timestamp_formatted").get(function () {
   return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATE_MED);
});
  
MessageSchema.virtual("timestamp_yyyy_mm_dd").get(function () {
  return DateTime.fromJSDate(this.timestamp).toISODate(); // format 'YYYY-MM-DD'
});

module.exports = mongoose.model("Message", MessageSchema);