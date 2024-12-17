import {Schema,model,models} from "mongoose";

const CommentSchema = new Schema({
  content: {
      type: String,
      required: [true, "Content is required"],
  },
  creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
  },
  commentDate: {
    type: Date
  }
})

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
  },
  like: {
    type: Array,
    default: [],
  },
  comment: {
    type: [CommentSchema]
  }

},{timestamps: true})

const Post = models.Post || model('Post',PostSchema)

export default Post