import {mongoose,Schema,model,models} from "mongoose";

const PostSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
 content: {
    type: String,
    required: [true,'Content is required'],
 },
  image: {
    type: String,
  }
},{timestamps: true})

const Post = models.Post || model('Post',PostSchema)

export default Post