import { connectToDB } from "../../../utils/database"
import User from "../../models/user"
import {hash} from 'bcrypt'

export const POST = async (req) => {

  try {
    await connectToDB()
    const {username,email, userPassword} = await req.json();
    const password = await hash(userPassword, 10);
    const newUser = {username, email,password}
    const user = new User(newUser)
    await user.save()
    return new Response(JSON.stringify([newUser]),{status:201})
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify(err.message), {status: 500})
  }
}
