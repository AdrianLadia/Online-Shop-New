import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import {FaCalendarCheck} from 'react-icons/fa' 

const RecentOrdersButton = (props) => {

    const name = props.name
    const info = props.data
    const completed = info.stocksOnHoldCompleted
    const [open, setOpen] = useState(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "90vh",
        height: "80vh",
        overflow: 'auto',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: '30px',
        border: '2px solid #A7727D',
        backgroundColor: '#F8EAD8',
      };

      const mobileStyle = {
        '@media only screen and (max-width: 950px)': {
          width: '90vw',
          height: '80vh',
          borderRadius: '10px',
        },
      };
      
    const buttonContainerStyle = {
        display: 'flex',
        justifyContent: 'right',
        marginTop: 'auto'
        };

    const styles = {
        border: '2px solid #975C8D',
        backgroundColor: '#FFBFA9 ',
        borderTopLeftRadius: '10px',
        borderTopRightRadius: '10px',
        borderBottomLeftRadius: '10px',
        borderBottomRightRadius: '10px',
        margin: '10px',
        };

  return (
    <div>
        <Button sx={styles} variant="outlined" color='secondary' onClick={() => setOpen(true)} >
        CLICK HERE!
        </Button>
        <Modal 
        open= {open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description">
                <Box sx={{...style, ...mobileStyle}}>

                    <Box sx = {buttonContainerStyle}>
                        <Button variant="outlined" color='error' style={{  margin: '20px' }} onClick={() => setOpen(false)} >X</Button>
                    </Box>

                        <Typography sx={styles} id="modal-modal-title" variant="h3" component="h2" align='center'><br/>{name}<br/><br/></Typography>
                      
                        <Typography id="modal-modal-title" variant="h4" component="h2" align='left' style={{ margin: '40px' }}><FaCalendarCheck/> Recent Orders:</Typography>

                        {info && info.stocksOnHoldCompleted.slice().reverse().map((completed) => {
                            return(
                                <Typography id="modal-modal-description" variant="h6" component="h2" align='left' key={name}>Date : {completed.date}<br/>Name : {completed.userid}<br/>Quantity : {completed.quantity}<br/>Reference : {completed.reference}<br/><br/></Typography>               
                             )
                        })}
                </Box>
        </Modal>
    </div>
  )
}

export default RecentOrdersButton