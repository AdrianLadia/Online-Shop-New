import React from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { GiHamburgerMenu } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import AdminInventory from "./AdminInventory";
import { useEffect, useState } from "react";
import firestoredb from "./firestoredb";
import { Divider } from "@material-ui/core";
import AdminCreatePayment from "./AdminCreatePayment";
import AdminDelivery from "./AdminDelivery";
import AdminOrders from "./AdminOrders";

const AdminMenu = () => {
  const [refresh, setRefresh] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigateTo = useNavigate();
  const [selectedMenu, setSelectedMenu] = React.useState("Dashboard");
  let [products, setProducts] = useState([]);
  let [categories, setCategories] = useState([]);
  let [users, setUsers] = useState([]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickInventory = () => {
    setAnchorEl(null);
    setSelectedMenu("Inventory");
  };

  const handleClickCreatePayment = () => {
    setAnchorEl(null);
    setSelectedMenu("Create Payment");
  };

  const handleClickCustomerOrders = () => {
    setAnchorEl(null);
    setSelectedMenu("Customer Orders");
  }

  const handleBack = () => {
    navigateTo("/");
  };

  useEffect(() => {
    const firestore = new firestoredb();
    firestore.readAllProducts().then((products) => {
      setProducts(products);
    });
    firestore.readAllCategories().then((c) => {
      setCategories(c);
    });
    firestore.readAllUsers().then((user) => {
      console.log(users);
      setUsers(user);
    });
  }, [refresh]);

  useEffect(() => {}, []);

  return (
    // NAV BAR
    <div className="flex flex-col">
      <div className="flex flex-row w-full justify-between bg-green-300 py-3">
        {/* Back Button */}
        <IoArrowBackSharp
          size={30}
          className="mt-1 ml-2 cursor-pointer"
          onClick={handleBack}
        />
        <div>
          {/* Menu Button */}
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{ color: "white" }}
          >
            <GiHamburgerMenu size={25} />
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleClickInventory}>Inventory</MenuItem>
            {/* <Divider>Cust</Divider> */}
            <MenuItem onClick={handleClickCreatePayment}>
              Create Payment
            </MenuItem>
            <MenuItem onClick={handleClickCustomerOrders}>
              Customer Orders
            </MenuItem>
          </Menu>
        </div>
      </div>
      {/* HERO */}
      <div>
        {selectedMenu === "Dashboard" && <AdminOrders users={users} />}
        {selectedMenu === "Inventory" && (
          <AdminInventory
            products={products}
            categories={categories}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        )}
        {selectedMenu === "Create Payment" && (
          <AdminCreatePayment users={users} setUsers={setUsers} />
        )}
        {selectedMenu === "Customer Orders" && <AdminOrders users={users} />}
      </div>
    </div>
  );
};

export default AdminMenu;
