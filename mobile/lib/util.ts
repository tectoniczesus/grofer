export const capitalizeFirstLetter = (text: string)=>{
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export const formateDate = (dateString:string)=>{
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"});
};

export const getStatusColor = (status:string)=>{
    switch(status.toLowerCase()){
        case "delivered":
            return "#03d3fc";
        case "shipped":
            return "#03fc39";
        case "pending":
            return "#cfeb34";
        default:
            return "#666"
    }
}
