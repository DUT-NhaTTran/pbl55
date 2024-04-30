import React from 'react'

import { BiLogoAndroid ,BiLogoHtml5,BiBuilding} from 'react-icons/bi'


const course=[
    {
        title: 'Web Development',
        icon:<BiLogoHtml5/>

    },
    {
        title:'App Development',
        duration:'2 Hours',
        icon : <BiLogoAndroid/>
    },
    {
        title:'UX & UI',
        duration: '2 Hours',
        icon: <BiBuilding/>
    },
];
const Card = () => {
  return (
    <div className='card--container'>
        {course.map((item)=>(
            <div className='card'>
                <div className='card--cover'>{item.icon}</div>
                <div className='card--title'>
                    <h2>item.title</h2>

                </div>
            </div>
        ))}
    </div>
  );
};

export default Card
