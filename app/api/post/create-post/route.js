import { connectToDB } from "../../../utils/database"
import Post from "../../models/post"

export const POST = async (req) => {
    const {creator,content,image} = await req.json()
     try {
     await connectToDB()
     const newPost = new Post({
        creator,
        content,
        image
        })
        await newPost.save()
        return new Response(JSON.stringify(newPost), {status:201})
     } catch(err) {
        return new Response(err,{status:500})
     }
    }