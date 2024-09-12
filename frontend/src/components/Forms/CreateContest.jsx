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
import { Padding } from '@mui/icons-material';

export default function CreateContest({ onClose }) {
  const [category, setCategory] = React.useState('');
  const [startDateTime, setStartDateTime] = React.useState(dayjs());
  const [endDateTime, setEndDateTime] = React.useState(dayjs().add(1, 'hour'));
  const [error, setError] = React.useState('');
  const [hour, setHour] = useState('');

  const handleHourChange = (event) => {
    const value = event.target.value;
    if (value === '' || (Number(value) >= 1 && Number(value) <= 30)) {
      setHour(value);
    }
  };

  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };

  const handleStartDateTimeChange = (newValue) => {
    setStartDateTime(newValue);
  };

  const handleEndDateTimeChange = (newValue) => {
    const today = dayjs();
    const maxDate = today.add(30, 'day');

    if (newValue && newValue.isAfter(maxDate)) {
      setError('The end date cannot be more than 30 days in the future.');
      return;
    }

    setError('');
    setEndDateTime(newValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  };

  return (
    <Modal onClose={onClose}>
      <div className={classes['form-box']} >
        <form method="post" onSubmit={handleSubmit}>
          <p>Create contest</p>
          <div className={classes['user-box']}>
            <input name="title" type="text" required />
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
            <DatePicker label="Phase 1 start date" />
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
        <DatePicker label="Phase 1 end date" />
          </DemoContainer>
         </LocalizationProvider>

        <TextField
              label="Phase 2 duration"
              value={hour}
              onChange={handleHourChange}
              placeholder="1-30"
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
                  '.css-j882ge-MuiInputBase-root-MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'orange'
                  },
                  '.css-j882ge-MuiInputBase-root-MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'orange'
                  }


              }}
            />


          <Box display={"flex"} alignItems={"center"}>
            <Checkbox
              defaultChecked
              sx={{
                color: "orange",
                '&.Mui-checked': {
                  color: "orange",
                },
              }}
            />
            <p>is private</p>
          </Box>

        </form>
      </div>
    </Modal>
  );
}

