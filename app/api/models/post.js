import {Schema,model,models} from "mongoose";
import User from '../models/user'

const SubCommentSchema = new Schema({
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
},
})

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
  },
  subComments: {
    type: [Schema.Types.ObjectId],
    ref: "SubComment",
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
    type: [Schema.Types.ObjectId],
    ref: 'Comment',

  }

},{timestamps: true})

const Post = models.Post || model('Post',PostSchema)
const Comment = models.Comment || model('Comment',CommentSchema)
const SubComment = models.SubComment || model('SubComment', SubCommentSchema)
export default Post
export {Comment}
export {SubComment}