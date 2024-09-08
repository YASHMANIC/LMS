export const FormatPrice = (price:number) => {
    return new Intl.NumberFormat("en-in",{
        style:"currency",
        currency:"INR"
    }).format(price)
}