import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import useWindowDimensions from "./UseWindowDimensions";
import AdminAddItemModal from "./AdminAddItemModal";
import firestoredb from "../firestoredb";
import AdminDeleteItemModal from "./AdminDeleteItemModal";
import AdminEditItemModal from "./AdminEditItemModal";
import { useEffect } from "react";

function createData(
  itemID,
  itemName,
  unit,
  stocksAvailable,
  pieces,
  price,
  category,
  color,
  material,
  size,
  brand,
  weight,
  dimensions,
  description,
  images
) {
  return {
    itemID,
    itemName,
    unit,
    stocksAvailable,
    pieces,
    price,
    category,
    color,
    material,
    size,
    brand,
    weight,
    dimensions,
    description,
    images,
  };
}

const AdminInventory = (props) => {
  const { width, height } = useWindowDimensions();
  const [openAddItem, setOpenAddItem] = React.useState(false);
  const handleOpenAddItem = () => setOpenAddItem(true);
  const handleCloseAddItem = () => setOpenAddItem(false);

  const [openDeleteItem, setOpenDeleteItem] = React.useState(false);
  const handleOpenDeleteItem = () => setOpenDeleteItem(true);
  const handleCloseDeleteItem = () => setOpenDeleteItem(false);

  const [openEditItem, setOpenEditItem] = React.useState(false);
  const handleOpenEditItem = () => setOpenEditItem(true);
  const handleCloseEditItem = () => setOpenEditItem(false);
  const rows = [];

  const refresh = props.refresh;
  const setRefresh = props.setRefresh;
  const categories = props.categories;

  let productlist = props.products;
  
  productlist.map((product) => {
    rows.push(
      createData(
        product.itemId,
        product.itemName,
        product.unit,
        product.stocksAvailable,
        product.pieces,
        product.price,
        product.category,
        product.color,
        product.material,
        product.size,
        product.brand,
        product.weight,
        product.dimensions,
        product.description,
        product.imageLinks
      )
    );
  });


  function responsiveimage() {
    if (width < 1024) {
      return 100;
    } else {
      return 200;
    }
  }

  function responsiveimagecolumn() {
    if (width < 1024) {
      return 125;
    } else {
      return 200;
    }
  }

  return (
    <div className="flex flex-col items-center bg-gradient-to-r from-colorbackground via-color2 to-color1">
      {/* TABLE */}
      <div className="flex mt-8 mb-4 w-11/12 md:w-9/12 border-2 border-color60 rounded-lg">
        <TableContainer component={Paper} sx={{ maxHeight: height - 250 }}>
          <Table
            style={{ tableLayout: "auto"}}
            fixedHeader={false}
            aria-label="simple table"
          >
            <TableHead className="bg-color10c border-b-2 border-color60 h-16">
              <TableRow>
                {/* unit,pieces,price,category,brand,weight,dimensions,description,images */}
                <TableCell sx={{ minWidth: 200 }} align="center">
                  Item ID
                </TableCell>
                <TableCell
                  sx={{ minWidth: responsiveimagecolumn() }}
                  align="center"
                >
                  Image
                </TableCell>
                <TableCell sx={{ minWidth: 200 }} align="center">
                  Item Name
                </TableCell>
                <TableCell align="center">Unit</TableCell>
                <TableCell align="center">
                  Stocks Available
                </TableCell>
                <TableCell align="center">Pieces</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">Color</TableCell>
                <TableCell align="center">Material</TableCell>
                <TableCell align="center">Size</TableCell>
                <TableCell align="center">Brand</TableCell>
                <TableCell align="center">Weight</TableCell>
                <TableCell align="center">Dimensions</TableCell>
                <TableCell align="center">Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="bg-gradient-to-l from-colorbackground to-color1">
              {rows.map((row) => (
                <TableRow
                  key={row.itemID}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center" component="th" scope="row">
                    {row.itemID}
                  </TableCell>
                  <TableCell align="center">
                    <img
                      sx={{
                        height: responsiveimage(),
                        width: responsiveimage(),
                      }}
                      src={row.images[0]}
                      alt="sort"
                      // className="w-5 h-5"
                    />
                  </TableCell>
                  <TableCell align="center">{row.itemName}</TableCell>
                  <TableCell align="center">{row.unit}</TableCell>
                  <TableCell align="center">{row.stocksAvailable}</TableCell>
                  <TableCell align="center">{row.pieces}</TableCell>
                  <TableCell align="center">{row.price}</TableCell>
                  <TableCell align="center">{row.category}</TableCell>
                  <TableCell align="center">{row.color}</TableCell>
                  <TableCell align="center">{row.material}</TableCell>
                  <TableCell align="center">{row.size}</TableCell>
                  <TableCell align="center">{row.brand}</TableCell>
                  <TableCell align="center">{row.weight}</TableCell>
                  <TableCell align="center">{row.dimensions}</TableCell>
                  <TableCell align="center" className="h-32 overflow-y-auto">{row.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      {/* BUTTONS */}
      <div className="flex flex-col gap-2 2xs:flex-row w-6/12 md:w-2/4 justify-evenly 2xs:mt-8 m-5 ">
        <button
          onClick={handleOpenDeleteItem}
          className="bg-red-600 hover:bg-red-400 text-white rounded-lg p-3 font-bold"
        >
          Delete Item
        </button>
        <button
          onClick={handleOpenAddItem}
          className="bg-color60 hover:bg-green-400 text-white rounded-lg p-3 font-bold cursor-copy"
        >
          Add Item
        </button>
        <button
          onClick={handleOpenEditItem}
          className="bg-yellow-500 hover:bg-yellow-400 text-white rounded-lg p-3 font-bold"
        >
          Edit Item
        </button>
      </div>
      {/* ADD ITEM MODAL */}
      <AdminAddItemModal
        open={openAddItem}
        handleClose={handleCloseAddItem}
        categories={categories}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      {/* DELETE ITEM MODAL */}
      <AdminDeleteItemModal
        open={openDeleteItem}
        handleClose={handleCloseDeleteItem}
        products={productlist}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      {/* EDIT ITEM MODAL */}
      <AdminEditItemModal
        open={openEditItem}
        handleClose={handleCloseEditItem}
        categories={categories}
        products={productlist}
        refresh={refresh}
        setRefresh={setRefresh}
      />
    </div>
  );
};

export default AdminInventory;
