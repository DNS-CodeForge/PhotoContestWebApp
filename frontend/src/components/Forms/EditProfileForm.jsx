import React, { useState } from 'react';
import Modal from "../Modal/Modal";
import classes from './Form.module.css';
import { Button } from '@mui/material';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function EditProfileForm({ firstName, lastName, handleClose, handleUpdateUserData}) {
    const [formValues, setFormValues] = useState({
        firstName: firstName || '',
        lastName: lastName || '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormValues(prevValues => ({
            ...prevValues,
            [name]: value
        }));
    };

    const handleSave = async (event) => {
        event.preventDefault(); 

        const SaveDTO = {
            firstName: formValues.firstName,
            lastName: formValues.lastName,
        };

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${BACKEND_BASE_URL}api/user`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(SaveDTO),
            });
        if (!response.ok) {
            console.log('Failed to save profile');
        } else {
            handleUpdateUserData(SaveDTO);
            console.log('Profile saved successfully');
            handleClose();  
        }

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal onClose={handleClose}>
            <div className={classes['form-box']}>
                <form onSubmit={handleSave}>
                    <p>Edit Profile</p>
                    <div className={classes['user-box']}>
                        <input
                            name="firstName"
                            value={formValues.firstName}
                            type="text"
                            onChange={handleChange}
                            required
                        />
                        <label>First name</label>
                    </div>
                    <div className={classes['user-box']}>
                        <input
                            name="lastName"
                            value={formValues.lastName}
                            type="text"
                            onChange={handleChange}
                            required
                        />
                        <label>Last name</label>
                    </div>
                   <Button type="submit" variant="contained" color="primary" sx={{ marginTop: '1rem',marginRight: '1rem'}}>
                        Save
                    </Button>
                    <Button onClick={handleClose} variant="contained" color="secondary" sx={{ marginTop: '1rem' }}>
                        Cancel
                    </Button>
                </form>
            </div>
        </Modal>
    );
}

