import * as React from "react";
import Paper from "@mui/material/Paper";
import { Button, Typography } from "@mui/material";
import { Snackbar } from "@material-ui/core";
import { useState, useContext} from "react";
import UseWindowDimensions from "./UseWindowDimensions";
import TextField from "@mui/material/TextField";
import ProductCardModal from "./ProductCardModal";
import businessCalculations from "../../utils/businessCalculations"
import AppContext from "../AppContext";


const ProductCard = (props) => {
  const [quantity, setQuantity] = useState('');
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const { height, width } = UseWindowDimensions();
  const product = props.product;
  const [outofstock, setOutOfStock] = useState(false);
  const [lowstock, setLowStock] = useState(false);
  // const safetyStock = Math.round(product.averageSalesPerDay) * 2;
  const calculations = new businessCalculations();
  const safetyStock = calculations.getSafetyStock(product.averageSalesPerDay);
  const  {cart} = useContext(AppContext);

  function ClearForm() {
    document.getElementById("inputquantity" + props.product.itemname).value =
      "";
  }

  const customStyles = {
    content: {
      height: "50%",
      width: "80%",
    },
  };

  const handleClose = () => {
    setOpen(false);
  };

  function AddToCart() {

    const cartCount = calculations.getCartCount(cart);
    const cartQuantity = cartCount[props.product.itemid];
    const totalOrder = cartQuantity + parseInt(quantity);
    console.log("Total Order: " + totalOrder);
  
    if (totalOrder > calculations.getStocksAvailableLessSafetyStock(props.product.stocksAvailable, props.product.averageSalesPerDay)) {
      setQuantity('');
      alert("Not enough stocks available");
      return
    }

    if (quantity > 0) {
      
      // opens snackbar
      setOpen(true);
      // adds to cart
      props.addtocart(props.product.itemid, quantity);
      //back to 0
      setQuantity('');
    }
  }



  function DisplayItem() {
    return props.product.itemname + " added to cart";
  }

  function responsiveStyle() {
    if (width > 1024) {
      return "h6";
    } else {
      return "h5";
    }
  }

  function closeModal() {
    setModal(false);
  }

  React.useEffect(() => {
    if (quantity < 0) {
      setQuantity(0);
    }
  },[quantity])

  React.useEffect(() => {
    console.log(
      "Real Stock of " + product.itemname + " is " + product.stocksAvailable
    );
    console.log("Safety Stock of " + product.itemname + " is " + safetyStock);
    console.log(
      "Low Stock of " + product.itemname + " is " + (50 + safetyStock)
    );
    console.log(
      "Adjusted Inventory of " +
        product.itemname +
        " is " +
        (product.stocksAvailable - safetyStock)
    );

    if (product.stocksAvailable <= safetyStock) {
      setOutOfStock(true);
    }
    if (product.stocksAvailable <= 50 + safetyStock && product.unit != "pack") {
      setLowStock(true);
    }
  }, [product.stocksAvailable]);

  return (
    <div className="flex justify-center">
      <Paper
        elevation={10}
        className="flex flex-row w-11/12  justify-center my-5 h-56"
      >
        {/* IMAGE */}
        <div className="w-3/5">
          <img
            src={props.product.imagelinks[0]}
            alt={props.product.itemname}
            className="h-full w-full object-cover rounded-lg"
            onClick={() => setModal(true)}
          ></img>
        </div>
        {/* IMAGE */}
        {/* DETAILS */}
        <div className="flex flex-col ml-5 w-2/5">
          {outofstock === true ? (
            <div className="flex flex-row">
              <Typography variant="h7" color="red">
                Out of Stock
              </Typography>
              <span className="flex h-3 w-3 mt-1 ml-2"></span>
            </div>
          ) : (
            <>
              {lowstock === true && product.unit != "Pack" ? (
                <div className="flex flex-row">
                  <Typography variant="h7" color="red">
                    Stocks left
                  </Typography>
                  <span className="flex h-3 w-3 mt-1 ml-2">
                    <span className="inline-flex items-center justify-center px-2 py-2 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                      {props.product.stocksAvailable - safetyStock}
                    </span>
                  </span>
                </div>
              ) : null}
            </>
          )}
          <div className="h-2/5" onClick={() => setModal(true)}>
            <Typography variant={responsiveStyle()} sx={{ mr: 2 }}>
              {props.product.itemname}
            </Typography>
          </div>
          <div className="h-1/5" onClick={() => setModal(true)}>
            <Typography variant={responsiveStyle()} sx={{ mt: 3 }}>
              {" "}
              {"₱ " + props.product.price}
            </Typography>
          </div>

          <div className="flex flex-row h-2/5">
            <button
              id="addtocartbutton"
              className=" mt-10 h-10 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
              type="button"
              onClick={AddToCart}
            >
              Add
            </button>
            <TextField
              id="entryquantity"
              label="Qty"
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
              value={quantity}
              onChange={ (event) => {setQuantity(event.target.value)}}
              sx={{ width: "100px", mr: 2, ml: 2, mt: 3 }}
            />
          </div>
        </div>
      </Paper>
      <div>
        <ProductCardModal
          modal={modal}
          closeModal={closeModal}
          product={product}
        />
      </div>
      <div>
        <Snackbar
          className="mb-5 lg:-mb-5"
          variant="success"
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={open}
          onClose={handleClose}
          message={DisplayItem()}
          action={
            <Button color="success" size="small" onClick={handleClose}>
              {" "}
              Close{" "}
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default ProductCard;
