import React from 'react'
import ContentHeader from './ContentHeader'
import './Content.css';
import Card from '../Card/Card';
import StudentList from '../StudentList/StudentList';
const Content = () => {
  return (
    <div className='content'>
      {/* <ContentHeader/> */}
      {<StudentList/>}
    </div>
  )
}

export default Content
