import axios from "axios";
import NextAuth, { AuthOptions} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";



export const authOptions : AuthOptions = {
    providers : [
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email:{label:"Email",name:"email"},
                password:{label:"Password", name:"password"}
            },
            async authorize(credentials){
                try {
                    const payload = {
                        email: credentials?.email,
                        password: credentials?.password
                    }

                    const {data} = await axios.post(`${process.env.SERVER}/api/user/login`,payload)
                    // console.log(data)
                    return data
                } catch (err) {
                    return false
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        })
    ],
    pages:{
        signIn:"/login",
        error:"/auth-failed"
    },
    callbacks:{

        async signIn({account,user}){
            if(account?.provider === "google"){
                try {
                    const payload = {
                        email : user.email,
                        provider:"google"
                    }

                    const {data} = await axios.post(`${process.env.SERVER}/api/user/login`,payload)
                    user.email = data.email
                    user.id = data.id,
                    user.role = data.role,
                    user.name = data.name
                    user.address = data.address
                    user.mobile = data.mobile
                    
                    return true
                    
                } catch (err) {
                    return false
                }
            }
            else{
                return true
            }
        },

        async jwt({token,user}){
            if(user){
                token.id = user.id
                token.role = user.role
                token.address = user.address
                token.mobile = user.mobile
            }
            return token
        },
        async session({session,token}){
            if(token){
                session.user.id = token.id as string
                session.user.role = token.role as string
                session.user.address = token.address as any
                session.user.mobile = token.mobile as any
            }
            return session

        }
    }
}

const handler = NextAuth(authOptions)
export {handler as GET , handler as POST}

