import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from '@clerk/clerk-react'

export const AppContext = createContext()

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY || '$';
  const [allCourses, setAllCourses] = useState([]);
  const navigate = useNavigate();
  const [isEducator, setIsEducator] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([])

  const { getToken } = useAuth();
  const { user } = useUser();

  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses);
    console.log("All courses fetched successfully:", allCourses);
  }

  const calculateRating = (course) => {
    if (!course || !course.courseRatings || course.courseRatings.length == 0) {
      return 0;
    }
    let totalrating = 0;
    course.courseRatings.forEach(rating => {
      totalrating += rating.rating
    })
    return totalrating / course.courseRatings.length;
  }

  const calculateTotalDuration = (course) => {
    if (!course || !course.courseContent) {
      return "0m";
    }
    let time = 0;
    course.courseContent.map((chapter) => {
      chapter.chapterContent.map(lecture => {
        time += lecture.lectureDuration;
      });
    });
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
  };

  const calculateChapterTime = (chapter) => {
    if (!chapter || !chapter.chapterContent) {
      return "0m";
    }
    let time = 0;
    chapter.chapterContent.map(lecture => {
      time += lecture.lectureDuration;
    });
    return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
  }

  const getTotalLectures = (course) => {
    if (!course?.courseContent) return 0;
    return course.courseContent.reduce((total, chapter) => {
      return total + chapter.chapterContent.length;
    }, 0);
  };

  const fetchEnrolledCourses = async () => {
    setEnrolledCourses(dummyCourses);
  }

  const formatDuration = (minutes) => {
    if (!minutes) return "0m";
    return humanizeDuration(minutes * 60 * 1000, { units: ['h', 'm'] })
  };

  useEffect(() => {
    fetchAllCourses();
    fetchEnrolledCourses();
  }, [])

  const logToken = async () =>{
    console.log(await getToken() )
  } 
  useEffect(()=>{
    if(user){
      logToken()
    }
  },[user])

  const value = {
    currency, allCourses, navigate, calculateRating, isEducator, setIsEducator, enrolledCourses, fetchEnrolledCourses, calculateTotalDuration, calculateChapterTime, getTotalLectures, formatDuration
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}