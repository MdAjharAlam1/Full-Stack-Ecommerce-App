const priceCalculate = (price:number, discount:number) =>{
    const discountAmount = (price*discount)/100
    return price - discountAmount
}

export default priceCalculate