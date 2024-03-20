
import mongoose, {Schema, model} from "mongoose"


const tweetSchema = new Schema({
    owner:{
        type: Schema.Types.ObjectId,
          ref: "User",
          required:true
      },content:{
        type:String,
        required:true
      }
},{timestamps:true})


export const Tweet = new model ("Tweet", tweetSchema)