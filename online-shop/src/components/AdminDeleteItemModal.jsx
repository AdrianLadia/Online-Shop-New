import React from 'react'
import Modal from '@mui/material/Modal';
import MenuItem from '@mui/material/MenuItem';
import firestoredb from './firestoredb';
import { Box } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';

// Style for Modal
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    height: '25%',
    transform: 'translate(-50%, -50%)',
    width: '95%',

    '@media (min-width: 1024px)': {
    width: '25%',
    height: '20%'
    },

    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

const AdminDeleteItemModal = (props) => {

  const [selectedItemToBeDeleted, setSelectedItemToBeDeleted] = React.useState('');
  const products = props.products;
  const firestore = new firestoredb();


  const handleChange = (event) => {
    setSelectedItemToBeDeleted(event.target.value);
  };

  function deleteButtonClick() {
    firestore.deleteProduct(selectedItemToBeDeleted)
    props.setRefresh(!props.refresh)
  }

  return (
    <div>
      <div>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >     
          <Box sx={style}>
              {/* MODAL CONTENT */}
              <div>
                <Box sx={{ minWidth:50 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Select Item</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={selectedItemToBeDeleted}
                      label="Age"
                      onChange={handleChange}
                      >
                      {products.map((product) => <MenuItem key={product.itemid} value={product.itemid}>{product.itemname}</MenuItem>  )}

                    </Select>
                  </FormControl>
                </Box>
                <div>
                  <button onClick={deleteButtonClick} className='bg-red-300 hover:bg-red-500 rounded-lg p-3 mt-5' >Delete Item</button>
                </div>
              </div>
            {/* MODAL CONTENT */}
         </Box>
        </Modal>
      </div>
    </div>
  )
}

export default AdminDeleteItemModal
