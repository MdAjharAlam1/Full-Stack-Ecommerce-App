const db = null
import chalk from "chalk";
import {config} from "dotenv"
config()
import inquirer from "inquirer";
import {MongoClient} from "mongodb"
import bcrypt from "bcrypt"



const log = console.log

const promptOptions = [
    {
        type:"list",
        name:"role",
        message:"Press arrow up key and down key to choose role ",
        choices:[
            chalk.green("User"),
            chalk.blue("Admin"),
            chalk.red("Exist")
        ]
    }
]

const requiredValidation = (input,name) => {
    if(input.length > 0 )
        return true
    
    return log(chalk.red(`${name} is required !`))
}

const emailValidation = (email)=>{
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid =  regex.test(email)
    if(isValid){
        return true
    }
    return log(chalk.red("Please enter email in valid format"))
}

const passwordValidation = (input)=>{
    if(input.length < 6){
        return log(chalk.red("Password should be atleast 6 character"))
    }
    return true
}

const inputOptions = [
    {
        type:"input",
        name:"fullname",
        message:"Enter your Fullname :- ",
        validate : (input) =>{
            return(

                requiredValidation(input,"Fullname")
            )
        }
    },
    {
        type:"input",
        name:"email",
        message:"Enter your Email :- ",
        validate : (input) =>{
            return(
                requiredValidation(input,"Email"),
                emailValidation(input)
            )
        }
    },
    {
        type:"input",
        name:"password",
        message:"Enter your Password :- ",
        validate : (input) =>{
            return (
                requiredValidation(input,"Password"),
                passwordValidation(input)
            )
        }

    }
]

const createRole = async(role,db) =>{
    try {
        const input = await inquirer.prompt(inputOptions)
        input.password = await bcrypt.hash(input.password, 12)
        input.role = role
        input.createdAt = new Date()
        input.updatedAt = new Date()
        input.__v = 0
        const User = db.collection("users")
        await User.insertOne(input)
        log(chalk.green(`${role} has been created Successfully`))
        process.exit()
        
    } 
    catch (err) {
        log(chalk.red(`Signup Failed - ${err.message}`))
        process.exit()
    }
}

const exitApp = () =>{
    log(chalk.blue("Goodbye ! Exiting the App"))
    process.exit()
}

const welcome = async(db) =>{
    log(chalk.bgRed.white.bold(" 🌟 Admin Signup Console 🌟 "))
    const {role} =  await inquirer.prompt(promptOptions)

    if(role.includes("Admin"))
        return createRole("admin",db)

    if(role.includes("User"))
        return createRole("user",db)

    if(role.includes("Exit"))
        return exitApp()
}   

const main = () =>{
    MongoClient.connect(process.env.DB_URL)
    
    .then((conn)=>{
        const db = conn.db(process.env.DB_NAME)
        welcome(db)
    })
    .catch((err)=>{
        log(chalk.red(`Signup Failed - ${err.message}`))
    })
}

main()