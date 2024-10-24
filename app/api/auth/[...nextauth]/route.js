import NextAuth from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials"
import {connectToDB} from '../../../utils/database'
import {compare} from 'bcrypt'
import User from '../../models/user'

 const handler = NextAuth({
    callbacks : {
 //async jwt & async session returns full userCredentials
async jwt({token, user, trigger, session}) {
    if (trigger ===  "update") {
        token = session
        return {...token, ...session.user}
    }
    return {...token, ...user};
},
async session ({session, token}) {
    session.user = token
    return session
}
    },
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
   providers: [CredentialsProvider ({
    credentials: {
        username: {},
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        await connectToDB()
        const user = await User.findOne({email: credentials.email})
        const passwordCorrect = await compare(credentials?.password || '', user.password)
        if(passwordCorrect) {
            return {
                id: user._id,
                name: user.username,
                email: user.email,
                profilePic: user.profilePic || '',
            }
        }
        return null
   }
})]
 })

 export {handler as GET, handler as POST};