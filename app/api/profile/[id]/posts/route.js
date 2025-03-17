import {connectToDB} from '../../../../utils/database'
import Post from '../../../models/post'

export const GET = async(req,{params}) => {
    const {searchParams} = new URL(req.url)
    const page = searchParams.get('page') || 1
    const limit = searchParams.get('limit') || 10
    // const search = searchParams.get('search') || ''
    const skipNum = Number((page- 1) * limit)
    let cursor = Number(page)
    // let content = {
    //   content:{ $regex: search, $options: 'i'}
    // }
    try {
await connectToDB()
const post = await Post.find({creator:params.id}).populate("creator").skip(skipNum).limit(limit).sort('-createdAt')
if(!post) {
    return new Response('You have no posts', {status: 404})
}
 return new Response(JSON.stringify([{post,cursor}]), {status: 200})
    } catch(err) {
console.log(err)
    return new Response(err, {status: 500})
    }
}