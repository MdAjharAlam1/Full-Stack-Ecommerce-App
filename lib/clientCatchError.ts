import { message } from "antd"
import { isAxiosError } from "axios"

const clientCatchError = (err:unknown)=>{
    if(isAxiosError(err)){
        return message.error(err.response?.data.message || err.message)
    }

    if(err instanceof Error){
        return message.error(err.message)
    }

    return message.error("An unknown error occurred")
}

export default clientCatchError