import mongoose,{model, models , Schema} from "mongoose"
import UserModel from "./user.model"
import ProductModel from "./product.model"

const cartSchema = new Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref: UserModel,
        requires:true
    },
    product:{
        type:mongoose.Types.ObjectId,
        ref:ProductModel,
        required:true
    },
    quantity:{
        type:Number,
        default:1,
        required:true
    }
}, {timestamps:true})

const CartModel = models.Cart || model("Cart", cartSchema)
export default CartModel
