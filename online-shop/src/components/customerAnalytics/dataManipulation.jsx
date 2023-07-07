class dataManipulation {
    constructor(){
    }

    getAllCustomers( data ){
        const customers = []
        Object.keys(data).map((customer)=>{
            customers.push(customer)
        })
        return customers
    }

    getDataOfChosenCustomer( data, chosenCustomer ){
        const toReturn = []
        Object.keys(data).map((customer, index)=>{
            if( customer == chosenCustomer ){
                Object.keys(data[customer]).map((itemID, index)=>{
                    const productID = itemID
                    const salesPerMonth = []
                    let totalSales = 0
                    Object.keys(data[customer][itemID]).map((date, index)=>{
                        const dateString = date.slice(5,7)
                        const yearString = date.slice(0,4)
                        salesPerMonth.push({
                            'Year': yearString,
                            'Month': dateString,
                            'Quantity': data[customer][itemID][date],
                            'id': index
                        })
                        totalSales += data[customer][itemID][date]
                    })
                    const customerData = {}
                    customerData['name'] = productID
                    customerData['sales'] = salesPerMonth
                    customerData['totalSales'] = totalSales
                    customerData['id'] = index
                    toReturn.push(customerData)
                })
            }
        })
        return toReturn
    }

    filterDataForGraph( data ){
        const toReturn = [];
        Object.keys(data).map((key) => {
        if (key == 'sales') {
            data[key].map((info) => {
                let year = info.Year;
                let month = info.Month;
                let quantity = info.Quantity;
                toReturn.push([year, month, quantity])
            });
        }});
        return toReturn;
    }

    appRemovePacksFromProducts(products) {
        return products.filter((product) => product.unit !== "Pack");
    }

}

export default dataManipulation