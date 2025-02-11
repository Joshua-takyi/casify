export const formattedPrice = (price: number, currency = "GHS") => {
    return new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency,
    }).format(price);
};

export const formatName = (name: string) => {
    if(name.length > 21){
        return name.slice(0, 21) + '...';    }
}