class dataManipulation {
  constructor() {}

  appRemovePacksFromProducts(products) {
    return products.filter((product) => product.unit !== "Pack");
  }

  filterData(selectedOption, customize, tableData) {
    if (selectedOption && customize === "") {
        return (tableData
          .filter((data) => data.category === selectedOption)
          .filter((data) => data.isCustomized === false))
    }
    else {
        if (customize) {
            return (tableData.filter((data) => data.isCustomized === true))
        } 
        else {
            return tableData
        }
    }
  }

  readUsersFavoriteItems(userId) {
    const favoriteItems = []
    userId.map((s)=>{
      if(s.favoriteItems){
        s.favoriteItems.map((a)=>{
          favoriteItems.push(a)
        })
      }
    })
    return favoriteItems
  }
  
}

export default dataManipulation;
