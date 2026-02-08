import mongoose, {models, model, Schema} from "mongoose"
import UserModel from "./user.model"
import ProductModel from "./product.model"
import shortid from "shortid"

const orderSchema = new Schema({
    orderId:{
        type:String
    },
    user:{
        type: mongoose.Types.ObjectId,
        ref: UserModel,
        required:true
    },
    products:[{
        type:mongoose.Types.ObjectId,
        ref:ProductModel,
        required:true
    }],
    prices:[{
        type:Number,
        required:true
    }],
    discounts:[{
        type:Number,
        required:true
    }],
    quantitys:[{
        type:Number,
        required:true
    }],
    status:{
        type:String,
        default:"Processing",
        enum:["Processing", "Shipped", "Cancelled","Returned","Delivered"]
    }
},{timestamps:true})

orderSchema.pre('save',function(next){
    this.orderId = shortid.generate().toUpperCase()
    next()
})

const OrderModel = models.Order || model("Order", orderSchema)
export default OrderModel