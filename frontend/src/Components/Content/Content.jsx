import React from 'react'
import './Content.css';
import StudentList from '../StudentList/StudentList';
const Content = () => {
  return (
    <div className='content'>
      {<StudentList/>}
    </div>
  )
}

export default Content
