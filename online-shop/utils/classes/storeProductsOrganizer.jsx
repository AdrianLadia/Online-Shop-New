class storeProductsOrganizer {
  constructor(productList) {
    this.productList = productList;
    this.productCategory = null;
    this.finalData = [];
    this.orderOfProducts = [];
    this.sortedData = null;
    this.isRetail = null;
  }

  getOrderOfProducts() {

    if (this.productCategory == 'Utensils') {
      this.orderOfProducts = [
        'SPNMWSKZ','FRKMWSKZ','CHOPSSUK','PLASGLOV'
      ]
    }

    if (this.productCategory == 'Roll Bag') {
      this.orderOfProducts = [
        'RB5X9MR','RB8X12TB','RB10X16TB','RB16X24'
      ]
    }

    if (this.productCategory == 'Sando Bag') {
      this.orderOfProducts = [
        'SBAGWS','SBAGWM','SBAGWL','SBAGWXL'
      ]
    }

    if (this.productCategory == 'Bowls') {
      this.orderOfProducts = [
        'PBOWL390FP',
        'LIDPBWL390',
        'PBOWL520GL',
        'LIDPBWL520',
      ];
    }
    if (this.productCategory == 'Paper Bag') {
      this.orderOfProducts = [
        'PPB#1',
        'PPB#2',
        'PPB#3',
        'PPB#4',
        'PPB#5',
        'PPB#6',
        'PPB#8',
        'PPB#10',
        'PPB#12',
        'PPB#16',
        'PPB#20',
        'PPB#25',
        'PPB#45',
      ];
    }
   
    if (this.productCategory == 'Meal Box') {
      this.orderOfProducts = ['SPAG500PPB', 'SPAG600PPB', 'MB750PPB', 'MB880TG', 'MB1300TG', 'MB1500PPB'];
    }

    if (this.productCategory == 'Aluminum Tray') {
      this.orderOfProducts = [
        'ATRE650J','LATRE650J','ATRE2300JK','LATRE2300J','ATRE3100J','LATRE3100J','ATRE4300J','LATRE4300J','ATRO8','LATRO8'
      ];
    }
  }

  runMain() {
    // We need to get the category of all products given
    this.getProductListCategory();
    // We need to check if it is retail so that we can organize it by type
    this.getIfRetail();
    // We need to get the order of products so we can sort it
    this.getOrderOfProducts();
    // Organize Data
    this.organizeData();
    // Check if order of products is available and set final data
    this.checkIfOrderOfProductsIsAvailable();

    return this.finalData;
  }

  checkIfOrderOfProductsIsAvailable() {
    if (this.orderOfProducts.length == 0) {
      this.finalData = this.productList;
    } else {
      this.finalData = this.sortedData;
    }
  }

  getIfRetail() {
    this.productList.forEach((product) => {
      if (product.unit == 'Pack') {
        this.isRetail = true;
      } else {
        this.isRetail = false;
      }
      return;
    });
  }

  getProductListCategory() {
    this.productList.forEach((product) => {
      this.productCategory = product.category;
      return;
    });
  }

  organizeData() {
    const data = this.productList;
    let order = [];

    if (this.isRetail) {
      this.orderOfProducts.forEach((product) => {
        const newItemId = product + '-RET';
        order.push(newItemId);
      });
    } else {
      order = this.orderOfProducts;
    }

    const sortedData = data.sort((a, b) => {
      const indexA = order.indexOf(a.itemId);
      const indexB = order.indexOf(b.itemId);

      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      } else if (indexA !== -1) {
        return -1;
      } else if (indexB !== -1) {
        return 1;
      } else {
        return 0;
      }
    });

    this.sortedData = sortedData;
  }
}

export default storeProductsOrganizer;
