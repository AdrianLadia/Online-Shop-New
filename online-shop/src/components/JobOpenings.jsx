import React from 'react';
import { useState } from 'react';
import {
  Card,
  CardActionArea,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import theme from '../colorPalette/MaterialUITheme';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import ImageUploadButton from './ImageComponents/ImageUploadButton';
import AppContext from '../AppContext';
import { useContext } from 'react';
import DatePicker from 'react-datepicker';
import Joi from 'joi';
import schemas from '../schemas/schemas';
import { ThemeProvider } from '@mui/material/styles';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  maxHeight: '80vh',
  boxShadow: 24,
  overflow: 'scroll',
  p: 4,
};

function JobCard({ imageUrl, title, jobDescription, setShowCard, setOpenModal }) {
  function onJoinNowClick() {
    setShowCard(false);
    setOpenModal(true);
  }
  return (
    <div className="flex w-full justify-center items-center h-screen">
      <Card className="w-9/10 md:w-3/4 max-h-8/10 overflow-x-scroll lg:w-1/2 xl:w-400px bg-opacity-90 backdrop-filter backdrop-blur-lg overflow-visible shadow-lg">
        <CardActionArea>
          <div className="flex justify-center">
            <CardMedia component="img" alt={title} className="h-72 object-cover" image={imageUrl} title={title} />
          </div>
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {title}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p" paragraph>
              {jobDescription}
            </Typography>
            <Box mt={2}>
              <Typography variant="subtitle1" gutterBottom>
                Key Responsibilities:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Delivery Coordination: Use platforms like Lalamove, Maxim, and Grab to schedule and oversee customer order deliveries." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Order Preparation: Carefully prepare and package orders." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Inventory Management: Monitor stock levels and organize stock." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Customer Service: Solve issues with a friendly and professional approach." />
                </ListItem>
              </List>
            </Box>
            <Box mt={2}>
              <Typography variant="subtitle1" gutterBottom>
                Qualifications:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="Educational Background: Must have a Bachelor’s degree." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Computer Skills: Comfortable using inventory software and Microsoft Office." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Communication Skills: Excellent verbal and written communication skills." />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Attention to Detail: Must be very careful and precise." />
                </ListItem>
              </List>
            </Box>
            <Box mt={2}>
              <Typography variant="subtitle1" gutterBottom>
                Compensation:
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Offers a competitive salary at minimum wage, plus a 1% commission on all sales.
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <div className="flex w-full justify-center">
            <Button onClick={onJoinNowClick} className={'bg-color10a p-2 text-white'} size="small">
              Join Our Team Now
            </Button>
          </div>
        </CardActions>
      </Card>
    </div>
  );
}

function JobOpeningModal({ openModal, setOpenModal, setShowCard }) {
  const { alertSnackbar, storage, cloudfirestore } = useContext(AppContext);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [CVorResume, setCvUrl] = useState('');
  const [birthday, setBirthday] = useState(new Date());
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [submittedCv, setSubmittedCv] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Here you would handle the submission of the form data, for example:
    console.log({ fullName, email, phoneNumber, gender, CVorResume });

    const data = {
      fullName,
      email,
      phoneNumber,
      gender,
      CVorResume,
      age,
      address,
    };

    const schema = schemas.employeeApplicationSchema();
    console.log('Schema:', schema);
    const { error } = schema.validate(data);

    if (error) {
      console.log(error);
      alertSnackbar('error', error.toString());
      return;
    }

    try {
      await cloudfirestore.createDocument(data, data.fullName, 'EmployeeApplications');
      await cloudfirestore.sendEmail({
        to: data.email,
        subject: 'Application Received',
        text: `Dear ${data.fullName},\n\nWe have received your application. We will review it and get back to you soon.\n\nBest Regards,\nHR Department`,
      });
      await cloudfirestore.sendEmail({
        to: 'ladia.adrian@gmail.com',
        subject: 'Application Received',
        text: `Dear HR,\n\nA new application has been received from ${data.fullName}.\n\nBest Regards,\nHR Department`,
      });
      alertSnackbar('success', 'Application submitted successfully');
      setOpenModal(false);
      setShowCard(true);
    } catch (error) {
      console.error('Error adding document:', error);
      alertSnackbar('error', 'Error submitting application');
    }

    // After submission, you might want to close the modal and show the card or navigate away
  };

  function onUploadImage(url) {
    console.log('CV URL:', url);
    setCvUrl(url);
    setSubmittedCv(true);
  }

  return (
    <ThemeProvider theme={theme}>
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setShowCard(true);
        }}
        aria-labelledby="employee-registration-modal-title"
        aria-describedby="employee-registration-modal-description"
      >
        <Box
          sx={style}
          className=" flex flex-col gap-5 w-9/10 lg:w-400px"
          component="form"
          onSubmit={handleSubmit}
          noValidate
        >
          <Typography id="employee-registration-modal-title" variant="h6" component="h2">
            Application Form
          </Typography>
          <TextField
            required
            fullWidth
            id="fullName"
            label="Full Name"
            name="fullName"
            autoComplete="name"
            autoFocus
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextField
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            required
            fullWidth
            id="phoneNumber"
            label="Phone Number"
            name="phoneNumber"
            autoComplete="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <TextField
            required
            fullWidth
            id="address"
            label="Address"
            name="address"
            autoComplete="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <TextField
            required
            type="number"
            fullWidth
            id="Age"
            label="Age"
            name="Age"
            autoComplete="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          <FormControl component="fieldset">
            <FormLabel component="legend">Gender</FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              row
            >
              <FormControlLabel value="female" control={<Radio />} label="Female" />
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
          </FormControl>

          {/* <Typography className="-mb-4" id="employee-registration-modal-title" variant="h6" component="h2">
          Birthday
        </Typography>
        <DatePicker
          className="h-14 w-44 sm:w-56 rounded-md outline-color10b border-2 border-color10a indent-5 hover:border-color10b bg-white 
                      placeholder:text-lg placeholder:text-color10b"
          placeholderText="Date"
          selected={birthday}
          onChange={(date) => setBirthday(date)}
        /> */}

          <ImageUploadButton
            folderName={'JobApplications'}
            buttonTitle={'Upload Resume / CV'}
            storage={storage}
            onUploadFunction={onUploadImage}
          />

          <Button type="submit" className="bg-color10a text-white" fullWidth variant="contained" sx={{ mt: 20, mb: 5 }}>
            Apply
          </Button>
        </Box>
      </Modal>
    </ThemeProvider>
  );
}

function JobOpenings() {
  const [showCard, setShowCard] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const { alertSnackbar, storage } = useContext(AppContext);
  return (
    <div
      className="flex w-full justify-center items-center h-screen relative"
      style={{
        backgroundImage:
          'url("https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/homePage%2Fpaper%20products.jpg?alt=media&token=65a433cd-ba8c-40f6-ad3f-00f5348e217d")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay with semi-transparent background for dimming effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>

      {/* Content Container */}
      {showCard ? (
        <div className="z-10">
          <JobCard
            setShowCard={setShowCard}
            setOpenModal={setOpenModal}
            imageUrl="https://firebasestorage.googleapis.com/v0/b/online-store-paperboy.appspot.com/o/images%2Fd50fb8bc-4304-48dc-b3ca-4fdc29fbd204.webp?alt=media&token=a1268f7b-5e63-4d51-943f-fef843943366"
            title="Logistics and Inventory Coordinator"
            jobDescription="We are looking for a software developer to join our team. The ideal candidate should have a strong understanding of the software development life cycle and experience in web and mobile application development."
          />
        </div>
      ) : null}
      <JobOpeningModal openModal={openModal} setOpenModal={setOpenModal} setShowCard={setShowCard} />
    </div>
  );
}

export default JobOpenings;
