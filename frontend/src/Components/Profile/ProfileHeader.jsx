import React from 'react';
import { BiEdit } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

const ProfileHeader = ({ selectedRecord }) => {
  const navigate = useNavigate();

  const handleEditClick = () => {
    if (selectedRecord && selectedRecord.uid) {
        navigate('/home/editprofile', {
            state: {send_uid: selectedRecord.uid },
        });
    } else {
        console.error("selectedRecord is undefined or does not have uid.");
    }
};


  return (
    <div className='profile--header'>
      <h2 className='header-title'>Profile</h2>
      <button className="edit-button" onClick={handleEditClick}>
        <BiEdit size={30} />
      </button>
    </div>
  );
};

export default ProfileHeader;
