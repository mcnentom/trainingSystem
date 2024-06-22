import {useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.scss'
import GetStarted from '../../assets/GetStarted.jpg'
import Daisy from '../../assets/Daisy.jpg'
import kras from '../../assets/krasnikova.jpg'
import andrea from '../../assets/andrea.png'
import {Typed} from 'react-typed';

const Home = () => {
    const navigate = useNavigate();
    const navigateTo = () => {
        navigate('/login')
    }
    useEffect(() => {
        const multiple = new Typed('.courses', {
          strings: ['FrontEnd Developer', 'Telecommunication Engineer', 'Data Analyst','Backend Developer','Graphic Designer'],
          typeSpeed: 150,
          backSpeed: 100,
          backDelay: 1000,
          loop: true
        });
    
        return () => {
          multiple.destroy();
        };
      }, []);
    
    return (
        <div className='main'>
            <nav>
                <h1>Cozina</h1>
                <button onClick={navigateTo} className='btn'>Login</button>
            </nav>
            <h1>Learn how to become an Efficient: <span className='courses'></span></h1>
            
            <div className='description'>
                <div className='content'>
                    <h2>Learn without Limits</h2>
                    <p>Start, switch, or advance your career with
                        more than 6,900 courses, Professional
                        Certificates, and degrees from world-class
                        universities and companies.</p>

                    <div>
                        <button onClick={navigateTo} className='btn2'>Get Started</button>
                    </div>
                </div>
                <div className='image1'>
                    <img src={GetStarted} alt="image of a man with a laptop" width="90%" height="100%" />
                </div>
            </div>
            <br />
            <div className='testimonials'>
                <h1>Join thousands of learners and achieve your goals</h1>
                <div className='card'>
                    <span>
                        <img src={Daisy} alt="Diasy" />
                        <p>
                            Ullamco nulla magna proident reprehenderit tempor mollit ullamco ea veniam.Non ut dolor cillum
                            minim incididunt veniam nostrud qui enim. Aute id magna labore ipsum do cupidatat esse amet dolor
                            nisi occaecat commodo occaecat deserunt. Esse aute elit veniam tempor aliquip occaecat magna.
                            Do elit commodo in mollit consequat irure eu labore.
                        </p>
                        <br />
                        <p>Diasy p.</p>
                    </span>
                    <span>
                        <img src={andrea} alt="andrea" />
                        <p>
                            Reprehenderit excepteur nisi Lorem eiusmod qui esse tempor cupidatat officia occaecat officia. Ex ut ex
                            consectetur voluptate. Adipisicing Lorem quis aliquip cupidatat sit occaecat enim sunt amet ullamco.
                        </p>
                        <br />
                        <p>Andrea C.</p>
                    </span>
                    <span>
                        <img src={kras} alt="kreas" />
                        <p>
                            Veniam do non qui reprehenderit anim nostrud cupidatat anim exercitation commodo voluptate excepteur do.
                            Duis ipsum occaecat est nulla aliquip qui anim incididunt reprehenderit. Consectetur consequat occaecat non
                            incididunt culpa officia adipisicing qui.
                        </p>
                        <br />
                        <p>Krais T.</p>
                    </span>
                </div>
            </div>
            <div className='plan'>
                <h1>Choose the plan that fits your Goals</h1>
               <div className='availablePlans'>
                <div className='plans'>
                    <h3>Single learning Program</h3>
                    <p>Learn a single topic and earn a credential</p>
                    <button className='btn4'>Free Plan</button>
                    <h6>Visit an individual course or specialization page</h6>

                    <ul>
                        <li>Access all courses within the learning program</li>

                        <li>Earn a certificate on completion</li>
                    </ul>
                </div>
                <div className='plans'>
                    <h3>Cozina special package</h3>
                    <p>Complete multiple courses and earn credentials in the short term</p>
                    <p className='myplan'>$50</p>
                    <button className='btn4'>Start your trial</button>
                    <h6>Cancel anytime</h6>

                    <ul>
                        <li>Access 7,000+ courses and Specializations from 170+ leading companies and universities</li>
                        <li>Earn unlimited certificates</li>
                        <li>Learn job-relevant skills and tools with 1,000+ applied projects and hands-on labs from industry experts</li>
                        <li>Choose from more than 15 Professional Certificate programs from industry leaders like Google, Facebook, and more</li>
                    </ul>
                </div>
                <div className='plans'>
                    <h3>Cozina annual package</h3>
                    <p>Combine flexibility and savings with long-term learning goals</p>
                    <p className='myplan'>$500</p>
                    <button className='btn4'>Try annual package</button>
                    <h6>14-day money-back guarantee</h6>
                     <p>Everything included in the special plan, plus:</p>
                    <ul>
                        <li>Save when you pay up front for the year</li>

                        <li>Enjoy maximum flexibility to achieve work/life balance and learn at your own pace</li>
                    </ul>
                </div>
                </div>
            </div>
        </div>
    )
}

export default Home