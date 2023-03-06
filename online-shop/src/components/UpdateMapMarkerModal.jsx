import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function UpdateMapMarkerModal(props) {
  const handleOpen = props.handleOpen;
  const open = props.open;
  const handleClose = props.handleClose;

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="flex justify-center">
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Map Delivery Marker Changed
            </Typography>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default UpdateMapMarkerModal;
