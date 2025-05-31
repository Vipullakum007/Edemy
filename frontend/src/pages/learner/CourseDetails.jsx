import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import YouTube from 'react-youtube'
import Loading from '../../components/learner/Loading'

const CourseDetails = () => {
  const { courseId } = useParams();
  const { allCourses, currency, calculateRating, calculateTotalDuration, calculateChapterTime, getTotalLectures, formatDuration } = useContext(AppContext);
  const [course, setCourse] = useState(null);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  useEffect(() => {
    if (courseId && allCourses.length > 0) {
      const foundCourse = allCourses.find(c => c._id === courseId);
      setCourse(foundCourse);
    }
  }, [courseId, allCourses]);

  const toggleChapter = (chapterId) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterId]: !prev[chapterId]
    }));
  };

  if (!course) {
    return (
      <Loading />
    );
  }

  const rating = calculateRating(course);
  const originalPrice = course.coursePrice;
  const discountedPrice = originalPrice - (course.discount * originalPrice / 100);
  const totalDuration = calculateTotalDuration(course);
  const totallectures = getTotalLectures(course);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{course.courseTitle}</h1>
              <p
                dangerouslySetInnerHTML={{ __html: course.courseDescription }}
                className="text-gray-600 mb-4 line-clamp-3"
              ></p>

              {/* Rating and Stats */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500 font-semibold">{rating.toFixed(1)}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, index) => (
                      <img
                        key={index}
                        src={index < Math.floor(rating) ? assets.star : assets.star_blank}
                        alt="star"
                        className='h-4 w-4'
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">({course.courseRatings.length} ratings)</span>
                </div>
                <span className="text-gray-600">{course.enrolledStudents.length} students</span>
              </div>

              <p className="text-gray-600">Course by <span className="text-blue-600 font-medium underline">Richard James</span></p>
            </div>

            {/* Course Structure */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Course Structure</h2>
              <div className="text-gray-600 mb-6">
                {course.courseContent.length} sections • {totallectures} lectures • {totalDuration} total duration
              </div>

              <div className="space-y-4">
                {course.courseContent.map((chapter) => (
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
                        {chapter.chapterContent.map((lecture) => (
                          <div key={lecture.lectureId} className="flex items-center justify-between p-4 pl-12 hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <img src={assets.play_icon} alt="play_icon" className="w-5 h-5" />
                              <span className="text-gray-700">{lecture.lectureTitle}</span>
                              {lecture.isPreviewFree && (
                                <span
                                  onClick={() => { setPlayerData({ videoId: lecture.lectureUrl.split('/').pop() }) }}
                                  className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded cursor-pointer">Preview</span>
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
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Course Description</h2>
              <div
                className="prose max-w-none text-gray-700 rich-text"
                dangerouslySetInnerHTML={{ __html: course.courseDescription }}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">

                {playerData ?
                  <YouTube videoId={playerData.videoId} opts={{ playerVars: { autoplay: 1 } }} iframeClassName='w-full aspect-video' />
                  :
                  <img
                    src={course.courseThumbnail}
                    alt={course.courseTitle}
                    className="w-full h-48 object-cover"
                  />
                }

                <div className="p-6">

                  {/* Course Stats */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-gray-700">
                      <img src={assets.time_clock_icon} alt="" />
                      <span className="text-sm">{totalDuration}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-700">
                      <img src={assets.lesson_icon} alt="" />
                      <span className="text-sm">{totallectures} lessons</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-bold text-gray-800">
                        {currency}{discountedPrice.toFixed(2)}
                      </span>
                      <span className="text-xl text-gray-500 line-through">
                        {currency}{originalPrice.toFixed(2)}
                      </span>
                      <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded">
                        {course.discount}% off
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <img src={assets.time_left_clock_icon} alt="time_left_icons" />
                      <span><span className='font-bold'>5 days</span> left at this price!</span>
                    </div>
                  </div>

                  {/* Enroll Button */}
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4">
                    {isAlreadyEnrolled ? 'Already Enrolled' : 'Enroll Now'}
                  </button>

                  {/* What's in the course */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3">What's in the course?</h3>
                    <ul className="space-y-2 text-sm text-gray-700 list-disc">
                      <li>
                        Lifetime access and updates
                      </li>
                      <li>
                        Step-by-step, hands-on-project guidance
                      </li>
                      <li>
                        Downloadable resources and source code
                      </li>
                      <li>
                        Access to test your knowledge
                      </li>
                      <li>
                        Certificate of completion
                      </li>
                      <li>
                        Access to test your knowledge
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetails