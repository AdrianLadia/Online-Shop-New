import React from "react";
import { Modal } from "@material-ui/core";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import ImageList from "@material-ui/core/ImageList";
import ImageListItem from "@material-ui/core/ImageListItem";
import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";
import { Typography } from "@mui/material";
import UseWindowDimensions from "./UseWindowDimensions";
import { Paper } from "@mui/material";
import ProductCardModalTable from "./ProductCardModalTable";
import AppContext from '../AppContext'
import firestoredb from "./firestoredb";
import { useEffect } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",

    backgroundColor: theme.palette.background.paper,
    marginTop: "20px",
  },
  imageList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
  },
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  height: "90%",
  transform: "translate(-50%, -50%)",
  width: "95%",
  overflowX: "scroll",

  "@media (min-width: 1024px)": {
    width: "60%",
  },

  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};


const ProductCardModal = (props) => {
  const { height, width } = UseWindowDimensions();
  const classes = useStyles();
  const [heart, setHeart] = useState(false);
  const {userdata,firestore,favoriteitems,setFavoriteItems} = React.useContext(AppContext);
  const [onInitialize, setOninitialize] = useState(true);

  function onHeartClick() {
    if (heart) {
      setHeart(!heart);
      setFavoriteItems(favoriteitems.filter(item => item !== props.product.itemId))
      firestore.removeItemFromFavorites(userdata.uid,props.product.itemId)
    }
    else {
      setHeart(!heart);
      setFavoriteItems([...favoriteitems, props.product.itemId])
      firestore.addItemToFavorites(userdata.uid,props.product.itemId)
    }
  }

  useEffect (() => {

    if (favoriteitems.includes(props.product.itemId)) {
      setHeart(true);
    }

  },[favoriteitems])

  

  function responsiveimagemodal() {
    if (width >= 1024) {
      return 2.5;
    } else {
      return 1.1;
    }
  }

    // console.log(props.product);
    const size = props.product.size;
    const color = props.product.color;
    const material = props.product.material;
    const pieces = props.product.pieces;
    const brand = props.product.brand;
    const dimensions = props.product.dimensions;
    const weight = props.product.weight;
    const unit = props.product.unit;

    const specs = {
      size: size,
      color: color,
      material: material,
      pieces: pieces,
      brand: brand,
      dimensions: dimensions,
      weight: weight,
      unit : unit
    };

    Object.keys(specs).map((key) => {
      if (specs[key] === undefined || specs[key] === "") {
        delete specs[key];
      }
    });



  return (
    <Modal open={props.modal} onClose={props.closeModal}>
      <Fade in={props.modal}>
        <Box sx={style} >
          <div className="flex flex-col overflow-y-hidden">
            {/* HEART AND X BUTTON*/}
            <div className="flex flex-row justify-between mb-5">
              {/* HEART */}
              {heart ? (
                <AiFillHeart
                  size={40}
                  onClick={onHeartClick}
                  className=" cursor-pointer text-red-500 "
                />
              ) : (
                <AiOutlineHeart
                  size={40}
                  onClick={onHeartClick}
                  className=" cursor-pointer hover:text-red-500"
                />
              )}
              {/* X BUTTON */}
              <button
                onClick={props.closeModal}
                className="bg-red-500 hover:bg-red-800 cursor-pointer p-2 rounded-full w-10 text-white"
              >
                X
              </button>
            </div>
            <div className="flex flex-col">
              {/* TITLE */}
              <Typography variant="h4" className="mb-5" align="center">
                {props.product.itemName}
              </Typography>
              {/* IMAGE */}
                <ImageList
                  className={classes.imageList}
                  cols={responsiveimagemodal()}
                  rowHeight="auto"
                >
                  { props.product.imageLinks.map((imagelink) => (
                    <ImageListItem key={imagelink}>
                      <Paper elevation={10}>
                        <img src={imagelink} alt={"title"} />
                      </Paper>
                    </ImageListItem>
                  ))}
                </ImageList>
                {/* Description */}
                <Typography variant="h6" align="center" sx={{ mt: 3 }}>
                  {props.product.description}
                </Typography>
                {/* SPECIFICATION TABLE */}
                <ProductCardModalTable specs={specs}/>
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ProductCardModal;
