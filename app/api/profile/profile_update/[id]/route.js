import { connectToDB } from "../../../../utils/database"
import User from "../../../models/user"

export const PATCH = async (req, {params}) => {
  
  try {
await connectToDB()
  const currentUser = await User.findById(params.id)
  const {image, name} = await req.json()
  const newImage = image || currentUser.profilePic
  const newName = name || currentUser.username

 const updateCurrentUser = await User.findOneAndUpdate(
  {_id: params.id},
  {profilePic:newImage, username:newName},
  {new:true, runValidators: true})
 
  if (!currentUser) {
    return new Response('User not found', {status: 404})
  }
  return new Response(JSON.stringify(updateCurrentUser), {status: 200})
  } catch (err) {
    return new Response(err, {status: 500})
  }
}