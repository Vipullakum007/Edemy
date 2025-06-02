import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from '@clerk/clerk-react'
import { toast } from 'react-toastify';
import axios from 'axios'

export const AppContext = createContext()

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY || '$';
  const [allCourses, setAllCourses] = useState([]);
  const navigate = useNavigate();
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [userData, setUserData] = useState(null);

  const { getToken } = useAuth();
  const { user } = useUser();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const fetchAllCourses = async () => {
    try {
      const { data } = await axios(`${BACKEND_URL}/api/course/all`);

      if (data.success) {
        setAllCourses(data.courses);
      }
      else {
        toast.error(data.message || "Failed to fetch courses");
      }

    } catch (error) {
      toast.error(error.message || "Failed to fetch courses");
    }
    console.log("All courses fetched successfully:", allCourses);
  }

  //const fetch user data
  const fetchUserData = async () => {
    if (user.publicMetadata.role == 'educator') {
      setIsEducator(true);
    }
    try {
      const token = await getToken();
      const { data } = await axios.get(`${BACKEND_URL}/api/user/data`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message || "Failed to fetch user data");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch user data");
    }
  }

  const calculateRating = (course) => {
    if (!course || !course.courseRatings || course.courseRatings.length == 0) {
      return 0;
    }
    let totalrating = 0;
    course.courseRatings.forEach(rating => {
      totalrating += rating.rating
    })
    return Math.floor(totalrating / course.courseRatings.length);
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
    try {
      const token = await getToken();
      const { data } = await axios.get(`${BACKEND_URL}/api/user/enrolled-courses`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (data.success) {
        setEnrolledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message || "Failed to fetch enrolled courses");
      }
    } catch (error) {
      toast.error(error.message || "Failed to fetch enrolled courses");
    }
  }

  const formatDuration = (minutes) => {
    if (!minutes) return "0m";
    return humanizeDuration(minutes * 60 * 1000, { units: ['h', 'm'] })
  };

  useEffect(() => {
    fetchAllCourses();
  }, [])

  const logToken = async () => {
    console.log(await getToken())
  }

  useEffect(() => {
    if (user) {
      logToken()
      fetchUserData();
      fetchEnrolledCourses();
    }
  }, [user])

  const value = {
    currency, allCourses, navigate, calculateRating, isEducator, setIsEducator, enrolledCourses, fetchEnrolledCourses, calculateTotalDuration, calculateChapterTime, getTotalLectures, formatDuration,
    BACKEND_URL, userData, setUserData, getToken, fetchAllCourses
  }

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}