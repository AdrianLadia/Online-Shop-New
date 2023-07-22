import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Line } from 'react-chartjs-2';
import Button from '@mui/material/Button';

const LineGraph = () => {
  const data = {
    labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        data: [80, 10, 50, 81, 56, 55, 40],
        tension: 0.1,
        borderColor: "#EB455F",
        pointBackgroundColor: "#6FEDD6",
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHitRadius: 6,
        pointHoverBackgroundColor: "#00FFD1",
      }
    ]
  };

  const options={
      plugins: {
        tooltips: {
          enabled: true,
          mode: 'index',
          intersect: false
      },
      },
      responsive: true,
      scales:{
          x:{
            ticks:{
              display: true,
            },
            grid:{
              display: true
             }
            },
          y:{
            ticks:{
              beginAtZero: true,
              display: true
            },
            grid:{
              display: true
              }
            }
          },
        onClick: (event, elements) => {
            setOpen(true)
            if (elements.length) {
              const pointIndex = elements[0].index;
              setSelectedPoint(pointIndex);
            } 
        },
      
    }

    const [open, setOpen] = useState(false)
    const [selectedPoint, setSelectedPoint] = useState(null);

    const style = {
      position: 'absolute',top: '50%',left: '50%',transform: 'translate(-50%, -50%)',width: "50vh",height: "50vh",overflow: 'auto',bgcolor: 'background.paper',boxShadow: 24, 
      p: 4,borderRadius: '30px',border: '2px solid #256D85',backgroundColor: '#B9FFF8',};

    const mobileStyle = {'@media only screen and (max-width: 950px)': {width: '30vw', height: '30vh', borderRadius: '10px',},};

    const buttonContainerStyle = {display: 'flex',justifyContent: 'right',marginTop: 'auto'};

    const styles = {border: '2px solid #37306B',backgroundColor: '#6FEDD6', borderTopLeftRadius: '10px',borderTopRightRadius: '10px',borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px',margin: '10px',  };

  return (
    <div style={{width: "100%", height: "100%", position: 'relative'}}>

      <Line data={data} options={options}/>


      <Modal 
        open= {open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description">
                <Box sx={{...style, ...mobileStyle}}>

                    <Box sx = {buttonContainerStyle}>
                        <Button variant="outlined" color='error' style={{ margin: '10px' }} onClick={() => setOpen(false)} >X</Button>
                    </Box>
   
                    <Typography sx={styles}  id="modal-modal-title" variant="h4" component="h2" align='left' style={{ margin: '20px' }}>{selectedPoint}</Typography>
                   
                </Box>
        </Modal>
    </div>
  );
};

export default LineGraph;