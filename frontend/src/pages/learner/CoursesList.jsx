import React, { useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../../context/AppContext'
import SearchBar from '../../components/learner/SearchBar'
import CourseCard from '../../components/learner/CourseCard'

const CoursesList = () => {
  const { input } = useParams();
  const { allCourses, navigate } = useContext(AppContext);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [displayCount, setDisplayCount] = useState(12);

  useEffect(() => {
    if (input && allCourses.length > 0) {
      const filtered = allCourses.filter(course =>
        course.courseTitle.toLowerCase().includes(input.toLowerCase()) ||
        course.courseDescription.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(allCourses);
    }
  }, [input, allCourses]);

  const handleLoadMore = () => {
    setDisplayCount(prevCount => prevCount + 8);
  };

  const coursesToDisplay = filteredCourses.slice(0, displayCount);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Course List</h1>
              <div className="flex items-center text-sm text-gray-600">
                <span className="text-blue-600 hover:underline cursor-pointer" onClick={() => navigate('/')}>Home</span>
                <span className="mx-2">/</span>
                <span>Course List</span>
              </div>
            </div>

            <div className="lg:max-w-md w-full">
              <SearchBar data={input} />
            </div>
          </div>
        </div>
        {input && (
          <div className="mb-6">
            <p className="text-gray-600">
              Search results for "<span className="font-semibold text-gray-800">{input}</span>"
              <span className="ml-2">({filteredCourses.length} courses found)</span>
            </p>
          </div>
        )}

        {coursesToDisplay.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {coursesToDisplay.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>

            {displayCount < filteredCourses.length && (
              <div className="flex justify-center">
                <button
                  onClick={handleLoadMore}
                  className="bg-white hover:bg-gray-50 text-gray-700 font-medium px-8 py-3 rounded-lg border border-gray-300 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Load more
                </button>
              </div>
            )}
          </>
        ) : (
          
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.462-.743-6.24-2M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No courses found</h3>
              <p className="text-gray-600">
                {input
                  ? `No courses match your search for "${input}". Try different keywords.`
                  : "No courses available at the moment."
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursesList