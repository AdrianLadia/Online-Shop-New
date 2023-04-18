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
import firestoredb from "../firestoredb";
import { useEffect } from "react";
import Divider from '@mui/material/Divider';


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
  p: 6,
  borderRadius:"20px"
};


const ProductCardModal = (props) => {
  const { height, width } = UseWindowDimensions();
  const classes = useStyles();
  const [heart, setHeart] = useState(false);
  const {userdata,firestore,favoriteitems,setFavoriteItems} = React.useContext(AppContext);
  const [onInitialize, setOninitialize] = useState(true);
  const [screenMobile, setScreenSizeMobile] = useState(null);


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

  useEffect(()=>{
    if (width < 1024) {
      return setScreenSizeMobile(true);
     }else {
      return setScreenSizeMobile(false);
     }
  },[width])

    const size = props.product.size;
    const color = props.product.color;
    const material = props.product.material;
    const pieces = props.product.pieces;
    const brand = props.product.brand;
    const dimensions = props.product.dimensions;
    const weight = props.product.weight;
    const unit = props.product.unit;
    const lengthOfImageList = props.product.imageLinks.length;
    const centerImage = lengthOfImageList === 1;

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
        <Box sx={style} className="bg-colorbackground border-color60 overflow-y-auto">
          <div className="flex flex-col">
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
                className=" bg-red-500 hover:bg-red-800 cursor-pointer p-2 rounded-full w-10 text-white"
              >
                X
              </button>
            </div>
            <div className="flex flex-col">
              {/* TITLE */}
              <Typography variant="h3" className="mb-10 text-black" align="center">
                {props.product.itemName}
              </Typography>

              <Divider sx={{border:"1px solid black"}}/>
                {/* Description */}
                <div className="flex flex-col-reverse items-center">
                 {	screenMobile ? (
                  <Typography className="mt-8 ml-1 w-full 2xs:w-11/12 text-sm 2xs:text-lg indent-5 tracking-wide first-letter:text-xl first-letter:font-semibold">
                      {props.product.description}
                  </Typography>):null} 

                {/* IMAGE */}
                  <ImageList
                    className={classes.imageList}
                    cols={responsiveimagemodal()}
                    rowHeight="auto"
                  >
                    {props.product.imageLinks.map((imagelink) => (
                      <ImageListItem key={imagelink} cols={centerImage ? responsiveimagemodal() : 1} className={centerImage ? 'flex justify-center' : ''} >
                        
                        <Paper>  
                          <img src={imagelink} alt={"title"} className=" mt-5"/>
                        </Paper>
                      </ImageListItem>
                    ))}
                  </ImageList>

                  <Divider sx={{border:"1px solid lightgray"}} className="w-full mb-8 "/> 

                  <div className="flex flex-col lg:flex-row-reverse my-10 mx-3 gap-3 items-center lg:items-start w-full">
                    {/* Description */}
                    {	screenMobile === false && props.product.description ?
                      (
                        <>
                          <div className="lg:w-2/4 flex self-start ">
                            <Typography className="w-11/12 ml-2 font-light text-green-800
                                                  text-sm lg:text-md xl:text-lg 2xl:text-xl 3xl:text-2xl 
                                                  indent:2 lg:indent-4 2xl:indent-7 
                                                  tracking-widest xl:tracking-tighter 2xl:tracking-tightest 
                                                  first-letter:text-xl xl:first-letter:text-2xl 2xl:first-letter:text-3xl first-letter:font-semibold">
                              {props.product.description}
                            </Typography>
                          </div>
                          <div className="w-full 2md:w-11/12 lg:w-7/12 ml-0 lg:ml-4 border-2 border-color60 rounded-sm">
                            {/* SPECIFICATION TABLE */}
                            <ProductCardModalTable specs={specs}/>
                          </div>
                        </>
                      )
                      :
                      (
                        <div className="w-full ml-0 lg:ml-4 border-2 border-color60 rounded-sm">
                          {/* SPECIFICATION TABLE */}
                          <ProductCardModalTable specs={specs}/>
                        </div>
                      )
                    }
                  </div>
                </div>
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ProductCardModal;
