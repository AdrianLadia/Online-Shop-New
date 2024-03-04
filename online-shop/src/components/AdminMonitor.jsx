import React, { useEffect, useState } from 'react';
import AppContext from '../AppContext';
import { ref, listAll, getDownloadURL, list } from 'firebase/storage';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { set } from 'date-fns';

function extractInfo(str) {
  // Split the string based on underscore (_) and dash (-) delimiters
  const parts = str.split(/[_-]/);

  // Extracting the hour, minute, and activity level from the parts
  const hour = parts[0];
  const minute = parts[1];

  let startCount = false;
  let activityLevel = '';
  for (let x = 0; x < str.length; x++) {
    if (str[x] === '-') {
      startCount = true;
      continue;
    }
    if (str[x] === '.') {
      break;
    }
    if (startCount) {
      activityLevel += str[x];
    }
  }

  return { hour, minute, activityLevel };
}
const openFullscreen = (elem) => {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    // IE/Edge
    elem.msRequestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    // Firefox
    elem.mozRequestFullScreen();
  }
};

const closeFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    // Chrome, Safari and Opera
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    // IE/Edge
    document.msExitFullscreen();
  } else if (document.mozCancelFullScreen) {
    // Firefox
    document.mozCancelFullScreen();
  }
};

const handleImageClick = (e) => {
  if (!document.fullscreenElement) {
    openFullscreen(e.target);
  } else {
    closeFullscreen();
  }
};
const AdminMonitor = () => {
  const { storage } = React.useContext(AppContext);

  // Create a storage reference from our storage service
  const computersRef = ref(storage, 'computers');
  const [files, setFiles] = useState([]); // [file1, file2, file3, ...
  const [allDates, setAllDates] = useState([]); // [date1, date2, date3, ...]
  const [dateSelected, setDateSelected] = useState(''); // date1
  const [allComputers, setAllComputers] = useState([]); // [computer1, computer2, computer3, ...
  const [computerSelected, setComputerSelected] = useState(''); // computer1
  const [allTimes, setAllTimes] = useState([]); // [time1, time2, time3, ...]
  const [timeSelected, setTimeSelected] = useState(''); // time1
  const [selectedHour, setSelectedHour] = useState('');
  const [selectedMinute, setSelectedMinute] = useState('');
  const [screenImage, setScreenImage] = useState(''); // [i

  useEffect(() => {
    const fetchComputers = async () => {
      const res = await list(computersRef);
      const folderRefs = res.prefixes;
      const computerNames = folderRefs.map((folderRef) => folderRef.name);
      setAllComputers(computerNames);
    };

    fetchComputers().catch(console.error);
  }, []);

  useEffect(() => {
    if (computerSelected === '') {
      setAllDates([]);
      return;
    }
    const fetchDates = async () => {
      let dates = [];
      const computerSelectedRef = ref(computersRef, computerSelected);
      const res = await listAll(computerSelectedRef);
      const itemRefPromises = res.prefixes.map(async (itemRef) => {
        const date = itemRef.name;
        return date;
      });

      const nestedDates = await Promise.all(itemRefPromises);
      dates = nestedDates;
      setAllDates(dates); // Assuming setFiles is your state setter
    };

    fetchDates().catch(console.error);
  }, [computerSelected]);

  useEffect(() => {
    if (computerSelected === '') {
      return;
    }

    const fetchFiles = async () => {
      if (dateSelected === '') {
        return;
      }

      if (computerSelected === '') {
        return;
      }

      const itemRef = ref(computersRef, computerSelected + '/' + dateSelected);
      const res = await listAll(itemRef);
      const filePromises = res.items.map(async (itemRef) => {
        const { hour, minute, activityLevel } = extractInfo(itemRef.name);
        const url = await getDownloadURL(itemRef);
        return {
          pcName: computerSelected,
          imageUrl: url,
          fileName: itemRef.name,
          hour,
          minute,
          activityLevel,
          date: dateSelected,
        };
      });
      const files = await Promise.all(filePromises);
      setFiles(files);
      return files;
    };

    fetchFiles().catch(console.error);
  }, [computerSelected, dateSelected]);

  useEffect(() => {
    console.log(files);
    const allDates = files.map((file) => file.date);
    const uniqueDates = [...new Set(allDates)];
    setAllDates(uniqueDates);
  }, [files]);

  useEffect(() => {
    console.log('ran date effect');
    const allTimes = files.map((file) => {
      if (file.date === dateSelected) {
        return file.hour + ':' + file.minute + ', ' + file.activityLevel;
      }
    });
    const uniqueTimes = [...new Set(allTimes)];
    console.log(uniqueTimes);
    setAllTimes(uniqueTimes);
  }, [files]);

  useEffect(() => {
    if (dateSelected === '') {
      return;
    }
    if (selectedHour === '') {
      return;
    }
    if (selectedMinute === '') {
      return;
    }
    const data = files.filter((file) => {
      return file.date === dateSelected && file.hour === selectedHour && file.minute === selectedMinute;
    });

    setScreenImage(data[0].imageUrl);
  }, [selectedHour, dateSelected, selectedMinute]);

  return (
    <div className="flex flex-col w-full items-center">
      <div className="w-full gap-5 flex flex-col lg:flex-row justify-center items-center my-10">
        <Box sx={{ width: 250 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Computer</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={computerSelected}
              label="Date"
              onChange={(event) => {
                setFiles([]);
                setAllDates([]);
                setAllTimes([]);
                setDateSelected('');
                setTimeSelected('');
                setComputerSelected(event.target.value);
              }}
            >
              {allComputers.map((computer) => (
                <MenuItem value={computer}>{computer}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ width: 250 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Date</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={dateSelected}
              label="Date"
              onChange={(event) => setDateSelected(event.target.value)}
            >
              {allDates.map((date) => (
                <MenuItem value={date}>{date}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ width: 250 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Time</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={timeSelected}
              label="Time"
              onChange={(event) => {
                function destructureTime(time) {
                  const [hour, minute, activityLevel] = time.split(/[:,]/);
                  return { hour, minute, activityLevel };
                }
                const { hour, minute, activityLevel } = destructureTime(event.target.value);
                setTimeSelected(event.target.value);
                setSelectedHour(hour);
                setSelectedMinute(minute);
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: '200px', // Set the max height here
                  },
                },
              }}
            >
              {allTimes.map((time) => (
                <MenuItem value={time}>{time}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </div>
      {screenImage === '' ? null : (
        <div className="flex justify-center h-screen">
          <img
            src={screenImage}
            alt="screen"
            className="max-w-full h-4/5 object-contain cursor-pointer"
            onClick={handleImageClick}
          />
        </div>
      )}
    </div>
  );
};

export default AdminMonitor;
