import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import Modal from "../Modal/Modal";
import classes from './Form.module.css';
import Checkbox from '@mui/material/Checkbox';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function CreateContest({ onClose }) {
  const [category, setCategory] = useState('');
  const [startDateTime] = useState(dayjs().add(1, 'day'));
  const [endDateTime, setEndDateTime] = useState(dayjs().add(2, 'day'));
  const [error, setError] = useState('');
  const [hour, setHour] = useState('');
  const [title, setTitle] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);


  const calculatePhaseDurationInDays = () => {
    const start = dayjs(startDateTime);
    const end = dayjs(endDateTime);
    return end.diff(start, 'day');
  };

  const handleHourChange = (event) => {
    const value = event.target.value;
    if (value === '' || (Number(value) >= 1 && Number(value) <= 30)) {
      setHour(value);
    }
  };

  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };

  const handleEndDateTimeChange = (newValue) => {
    const maxEndDate = dayjs(startDateTime).add(30, 'day');

    if (newValue && newValue.isAfter(maxEndDate)) {
      setError('The end date cannot be more than 30 days after the start date.');
      return;
    }

    setError('');
    setEndDateTime(newValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const phaseDurationInDays = calculatePhaseDurationInDays();

    if (phaseDurationInDays < 1 || phaseDurationInDays > 30) {
      setError("Phase duration must be between 1 and 30 days.");
      return;
    }

    if (!title || !category || !hour || !phaseDurationInDays) {
      setError('Please fill all the required fields.');
      return;
    }

    const createContestDTO = {
      title,
      category,
      phaseDurationInDays,
      phaseTwoDurationInHours: Number(hour),
      private: isPrivate,
    };

      try {

      const accessToken = localStorage.getItem('accessToken');

      const response = await fetch(`${BACKEND_BASE_URL}api/contest`, {
        method: 'POST',
       headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
          body: JSON.stringify(createContestDTO),
      });

      if (response.ok) {
        const result = await response.json();
        onClose();
      } else {
        const errorResponse = await response.json();
        setError(errorResponse.message || 'Failed to create contest.');
      }
    } catch (error) {
      setError('Error creating contest. Please try again later.');
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className={classes['form-box']} >
        <form method="post" onSubmit={handleSubmit}>
          <p>Create contest</p>
           <div className={classes['user-box']}>
            <input
              name="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label>Title</label>
          </div>

          <FormControl
           sx={{
            minWidth: '8rem',
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'white',
            },
            '&:hover fieldset': {
              borderColor: 'orange',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'orange',
            },
          },
          '& .MuiFormLabel-root': {
            color: 'white',
            '&.Mui-focused': {
              color: 'orange',
            },
          },
          '& .MuiSelect-icon': {
            color: 'white',
          },
        }}
      >
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={handleChangeCategory}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: 'black',
                    color: 'white',
                  },
                },
              }}
              sx={{
                '& .MuiSelect-select': {
                  color: 'white',
                },
                '& .MuiSelect-icon': {
                  color: 'white',
                },
              }}
            >
              <MenuItem value={"LANDSCAPE"}>Landscape</MenuItem>
              <MenuItem value={"PORTRAIT"}>Portrait</MenuItem>
              <MenuItem value={"STREET"}>Street</MenuItem>
              <MenuItem value={"WILDLIFE"}>Wildlife</MenuItem>
              <MenuItem value={"ABSTRACT"}>Abstract</MenuItem>
            </Select>
          </FormControl>

         <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']} sx={{
              overflow: 'hidden',
              marginTop: '0.8rem',
              '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white'
              },
               '& .css-lxfshk-MuiInputBase-root-MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                   borderColor: 'orange',
              },
              '.css-lxfshk-MuiInputBase-root-MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'orange'
              },
              '& .MuiButtonBase-root': {
                  marginTop: '0px',
              },
              '& .MuiButtonBase-root *': {
                  animation: 'none !important'
              },
             '& .MuiInputBase-root': {
                 color: 'white'
              },
             '& .MuiFormLabel-root': {
                  color: 'white'
              },'& .MuiFormLabel-root.Mui-focused': {
                  color: 'orange'
              }
          }}>
            <DatePicker
              label="Submission phase start date"
              readOnly
              value={startDateTime}
              autoFocus
              />

          </DemoContainer>
         </LocalizationProvider>

         <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']} sx={{
              overflow: 'hidden',
              marginTop: '0.8rem',
              '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white'
              },
               '& .css-lxfshk-MuiInputBase-root-MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                   borderColor: 'orange',
              },
              '.css-lxfshk-MuiInputBase-root-MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'orange'
              },
              '& .MuiButtonBase-root': {
                  marginTop: '0px',
              },
              '& .MuiButtonBase-root *': {
                  animation: 'none !important'
              },
             '& .MuiInputBase-root': {
                 color: 'white'
              },
             '& .MuiFormLabel-root': {
                  color: 'white'
              },'& .MuiFormLabel-root.Mui-focused': {
                  color: 'orange'
              }
          }}>
        <DatePicker
      label="Submission phase end date"
      value={endDateTime}
      onChange={handleEndDateTimeChange}
      minDate={dayjs().add(2, 'day')}
      maxDate={dayjs().add(31, 'day')}
      />
          </DemoContainer>
         </LocalizationProvider>

        <TextField
              label="Review phase duration"
              value={hour}
              onChange={handleHourChange}
              placeholder="1-24"
              slotProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
              sx={{
                  marginTop: '1rem',
                  '& .css-1q964xs-MuiFormLabel-root-MuiInputLabel-root': {
                      color: 'white'
                  },
                  '& .css-1jk99ih-MuiInputBase-input-MuiOutlinedInput-input': {
                      color: 'white'
                  },
                 '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'white'
                  },
                   '.css-18pjc51-MuiFormLabel-root-MuiInputLabel-root.Mui-focused': {
                       color: 'orange',
                  },
                  '.css-18pjc51-MuiFormLabel-root-MuiInputLabel-root': {
                      color: 'white'
                  },
                  '.css-j882ge-MuiInputBase-root-MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'orange'
                  },
                  '.css-j882ge-MuiInputBase-root-MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'orange'
                  },
                  '.css-j882ge-MuiInputBase-root-MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline *': {
                      color: 'orange'
                  }
              }}
            />


          <Box display={"flex"} alignItems={"center"}>
            <Checkbox
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              sx={{
                color: "orange",
                '&.Mui-checked': {
                  color: "orange",
                },
              }}
            />
            <p>is private</p>
          </Box>

          <Box justifyContent={"center"} display={"flex"}>
          <button type="submit" className={classes['animated-button']}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Create
          </button>
          </Box>

        </form>
      </div>
    </Modal>
  );
}

