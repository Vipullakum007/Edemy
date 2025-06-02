import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import YouTube from 'react-youtube';
import Footer from '../../components/learner/Footer';
import Rating from '../../components/learner/Rating';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loading from '../../components/learner/Loading';

const Player = () => {

  const { enrolledCourses, calculateChapterTime, calculateTotalDuration, getTotalLectures, formatDuration, BACKEND_URL, getToken, userData, fetchEnrolledCourses } = useContext(AppContext);
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [playerData, setPlayerData] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  const getCourseData = async () => {
    enrolledCourses.map((course) => {
      if (course._id == courseId) {
        setCourseData(course);
        course.courseRatings.map((item) => {
          if (item.userId === userData._id) {
            setInitialRating(item.rating);
          }
        })
      }
    })
  }

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseData();
    }
  }, [courseId, enrolledCourses]);

  const markLectureAsCompleted = async (lectureId) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(`${BACKEND_URL}/api/user/update-course-progress`,
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(data.message || 'Mark as completed successfully')
        getCourseProgress()
      } else {
        toast.error(data.message || 'not mark as completed try again later')
      }
    } catch (error) {
      toast.error(error.message || 'not mark as completed try again later')
    }
  }

  const getCourseProgress = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.post(`${BACKEND_URL}/api/user/get-course-progress`,
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        setProgressData(data.progressData)
      }
      else {
        toast.error(data.message || 'Failed to fetch course progress data , try again later')
      }
    } catch (error) {
      toast.error(error.message || 'Failed to fetch course progress data , try again later')
    }
  }

  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  const handleRate = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(`${BACKEND_URL}/api/user/add-rating`,
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (data.success) {
        toast.success(data.message)
        fetchEnrolledCourses()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getCourseProgress()
  }, [])

  // Calculate these values only when courseData is available
  const totalDuration = courseData ? calculateTotalDuration(courseData) : "0m";
  const totallectures = courseData ? getTotalLectures(courseData) : 0;

  return courseData ? (
    <>
      <div className='p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10 md:px-36'>

        {/* left column */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Course Structure</h2>
          <div className="text-gray-600 mb-6">
            {courseData && courseData.courseContent.length} sections • {totallectures} lectures • {totalDuration} total duration
          </div>

          <div className="space-y-4">
            {courseData && courseData.courseContent.map((chapter, index) => (
              <div key={chapter.chapterId} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => toggleChapter(chapter.chapterId)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-sm font-medium">
                      {expandedChapters[chapter.chapterId] ? '−' : '+'}
                    </div>
                    <span className="font-medium text-gray-800">{chapter.chapterTitle}</span>
                  </div>
                  <span className="text-gray-500 text-sm">
                    {chapter.chapterContent.length} lectures • {calculateChapterTime(chapter)}
                  </span>
                </button>

                {expandedChapters[chapter.chapterId] && (
                  <div className="border-t border-gray-200">
                    {chapter.chapterContent.map((lecture, i) => (
                      <div key={lecture.lectureId} className="flex items-center justify-between p-4 pl-12 hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <img src={progressData && progressData.lectureCompleted.includes(lecture.lectureId) ? assets.blue_tick_icon : assets.play_icon} alt="play_icon" className="w-5 h-5" />
                          <span className="text-gray-700">{lecture.lectureTitle}</span>
                          {lecture.lectureUrl && (
                            <span
                              onClick={() => setPlayerData({ ...lecture, chapter: index + 1, lecture: i + 1 })}
                              className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded cursor-pointer">Watch</span>
                          )}
                        </div>
                        <span className="text-gray-500 text-sm">{formatDuration(lecture.lectureDuration)} </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* rate this course */}
          <div className='flex items-center gap-2 py-3 mt-10'>
            <h1 className='text-xl font-bold'>Rate this course</h1>
            <Rating initialRating={initialRating} onRate={handleRate} />
          </div>

        </div>

        {/* right column */}

        <div>
          {
            playerData
              ?
              (<div>
                <YouTube videoId={playerData.lectureUrl.split('/').pop()} iframeClassName='w-full aspect-video' />
                <div className='flex justify-between  items-center mt-1'>
                  <p>{playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}</p>
                  <button onClick={() => markLectureAsCompleted(playerData.lectureId)} className='text-blue-600'>{progressData && progressData.lectureCompleted.includes(playerData.lectureId) ? 'Completed' : 'Mark as Complete'}</button>
                </div>
              </div>)
              :
              <img src={courseData ? courseData.courseThumbnail : ''} alt="" />
          }
        </div>
      </div>
      <Footer />
    </>
  ) :
    <Loading />
}

export default Player