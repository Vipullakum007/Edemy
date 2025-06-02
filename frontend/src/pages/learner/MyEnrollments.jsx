import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { Line } from 'rc-progress'
import Footer from '../../components/learner/Footer';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/learner/Loading';

const MyEnrollments = () => {
  const { enrolledCourses, calculateTotalDuration, navigate, userData, BACKEND_URL, fetchEnrolledCourses, getToken, getTotalLectures } = useContext(AppContext);
  const [progressArray, setProgressArray] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCourseProgress = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const tempProgressArray = await Promise.all(enrolledCourses.map(async (course) => {
        const { data } = await axios.post(`${BACKEND_URL}/api/user/get-course-progress`,
          {
            courseId: course._id
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        
        const totalLectures = getTotalLectures(course);
        const lectureCompleted = data?.progressData?.lectureCompleted?.length || 0;
        return { totalLectures, lectureCompleted }
      }))

      setProgressArray(tempProgressArray);
    } catch (error) {
      toast.error(error.message || 'Failed fetch Progress , try again later')
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (userData) {
      fetchEnrolledCourses()
    }
  }, [userData])

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress()
    } else {
      setLoading(false);
    }
  }, [enrolledCourses]) // Changed dependency to enrolledCourses

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <div className='md:px-36 px-8 pt-10'>
        <h1 className='text-2xl font-semibold'>My Enrollments</h1>
        {enrolledCourses.length === 0 ? (
          <div className="mt-10 text-center">
            <p>You haven't enrolled in any courses yet.</p>
          </div>
        ) : (
          <table className='md:table-auto table-fixed w-full overflow-hidden border mt-10'>
            <thead className='text-gray-900 border-b  border-gray-500/20 text-sm text-left max-sm:hidden'>
              <tr>
                <th className='px-4 py-3 font-semibold truncate'>Course</th>
                <th className='px-4 py-3 font-semibold truncate'>Duration</th>
                <th className='px-4 py-3 font-semibold truncate'>Completed</th>
                <th className='px-4 py-3 font-semibold truncate'>Status</th>
              </tr>
            </thead>

            <tbody className='text-gray-700'>
              {enrolledCourses.map((course, index) => {
                const progress = progressArray[index] || { totalLectures: 0, lectureCompleted: 0 };
                const completionPercent = progress.totalLectures > 0 
                  ? (progress.lectureCompleted * 100) / progress.totalLectures 
                  : 0;
                const isCompleted = progress.lectureCompleted === progress.totalLectures;

                return (
                  <tr key={index} className='border-b border-gray-500/20'>
                    <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3'>
                      <img src={course.courseThumbnail} alt="" className='w-14 sm:w-24 md:w-28' />
                      <div className='flex-1'>
                        <p className='mb-1 max-sm:text-sm'>{course.courseTitle}</p>
                        <Line 
                          strokeWidth={2} 
                          percent={completionPercent} 
                          strokeColor='#4ade80' 
                          trailWidth={2} 
                          trailColor='#e5e7eb'
                          className='bg-gray-300 rounded-full' 
                        />
                      </div>
                    </td>
                    <td className='px-4 py-3 max-sm:hidden'>
                      {calculateTotalDuration(course)}
                    </td>
                    <td className='px-4 py-3 max-sm:hidden'>
                      {progress.lectureCompleted} / {progress.totalLectures} lectures
                    </td>
                    <td className='px-4 py-3 max-sm:text-right'>
                      <button 
                        className={`px-3 sm:px-5 py-1.5 sm:py-2 max-sm:textxs text-white rounded-sm ${
                          isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                        }`}
                        onClick={() => navigate('/player/' + course._id)}
                      >
                        {isCompleted ? 'Completed' : 'In Progress'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  )
}

export default MyEnrollments