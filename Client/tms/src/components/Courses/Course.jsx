import React from 'react'
import image1 from '../../assets/pexels-andrea-piacquadio-3781529.jpg'
import image2 from '../../assets/pexels-antoni-shkraba-5306424.jpg'
import image3 from '../../assets/pexels-kampus-production-7551618.jpg'
import image4 from '../../assets/pexels-mikhail-nilov-6592677.jpg'
import image5 from '../../assets/Daisy.jpg'
import image6 from '../../assets/Background.jpg'
import image7 from '../../assets/GetStarted.jpg'
import image8 from '../../assets/andrea.png'
import image9 from '../../assets/krasnikova.jpg'
import DiscussionForum from '../Discussion/Discussion'
import './Course.scss'


const Course = () => {
    return (
        <div className='course'>
            <h1>Our Esteemed Courses</h1>
            <div className='CoursesDiv'>
                <div className='myCourse'>
                    <img src={image1} alt="" />
                    <h3>Data Science</h3>
                    <button>Enroll</button>
                </div>
                <div className='myCourse'>
                    <img src={image2} alt="" />
                    <h3>UI/UX Design</h3>
                    <button>Enroll</button>
                </div>
                <div className='myCourse'>
                    <img src={image3} alt="" />
                    <h3>Computer Science</h3>
                    <button>Enroll</button>
                </div>
                <div className='myCourse'>
                    <img src={image4} alt="" />
                    <h3>Programming</h3>
                    <button>Enroll</button>
                </div>
                <div className='myCourse'>
                    <img src={image5} alt="" />
                    <h3>Data Structures</h3>
                    <button>Enroll</button>
                </div>
                <div className='myCourse'>
                    <img src={image6} alt="" />
                    <h3>Front end development</h3>
                    <button>Enroll</button>
                </div>
                <div className='myCourse'>
                    <img src={image7} alt="" />
                    <h3>Backend Development</h3>
                    <button>Enroll</button>
                </div>
                <div className='myCourse'>
                    <img src={image8} alt="" />
                    <h3>Algorithms</h3>
                    <button>Enroll</button>
                </div>
                <div className='myCourse'>
                    <img src={image9} alt="" />
                    <h3>Data Analytics</h3>
                    <button>Enroll</button>
                </div>
            </div>
            <DiscussionForum/>
        </div>
    )
}

export default Course