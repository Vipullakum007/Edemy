import React from 'react'
import { Route, Routes, useMatch } from 'react-router-dom'
import Home from './pages/learner/Home'
import CoursesList from './pages/learner/CoursesList'
import CourseDetails from './pages/learner/CourseDetails'
import MyEnrollments from './pages/learner/MyEnrollments'
import Player from './pages/learner/Player'
import Loading from './components/learner/Loading'
import Educator from './pages/educator/Educator'
import Dashboard from './pages/educator/Dashboard'
import AddCourse from './pages/educator/AddCourse'
import MyCourses from './pages/educator/MyCourses'
import StudentsEnrolled from './pages/educator/StudentsEnrolled'
import Navbar from './components/learner/Navbar'
import 'quill/dist/quill.snow.css'
import { ToastContainer , Bounce } from 'react-toastify';

const App = () => {

  const isEducatorRoute = useMatch('/educator/*');

  return (
    <div className='text-default min-h-screen bg-white'>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      {!isEducatorRoute && <Navbar />
      }
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/course-list' element={<CoursesList />} />
        <Route path='/course-list/:input' element={<CoursesList />} />
        <Route path='/course/:courseId' element={<CourseDetails />} />
        <Route path='/my-enrollments' element={<MyEnrollments />} />
        <Route path='/player/:courseId' element={<Player />} />
        <Route path='/loading/:path' element={<Loading />} />

        <Route path='/educator' element={<Educator />}>

          <Route path='dashboard' element={<Dashboard />} />
          <Route path='add-course' element={<AddCourse />} />
          <Route path='my-courses' element={<MyCourses />} />
          <Route path='students-enrolled' element={<StudentsEnrolled />} />

        </Route>

        <Route path='*' element={<div>404 Not Found</div>} />

      </Routes>
    </div>
  )
}

export default App