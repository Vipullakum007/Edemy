import { clerkClient } from '@clerk/express'
import Course from '../models/Course.js';
import cloudinary from '../configs/cloudinary.js';
import Purchase from '../models/Purchase.js';
import User from '../models/User.js';

export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'educator',
      }
    })

    res.json({ success: true, message: 'You can publish a course now' })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    if (!imageFile) {
      return res.status(400).json({ success: false, message: 'Thumbanail not attached' });
    }
    if (!courseData) {
      return res.status(400).json({ success: false, message: 'Course data is required' });
    }

    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;
    const newCourse = await Course.create(parsedCourseData);

    // upload image to cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`,
      {
        folder: 'course-thumbnails',
        public_id: newCourse._id.toString(),
        resource_type: 'image',
      }
    );
    
    newCourse.courseThumbnail = cloudinaryResponse.secure_url;
    await newCourse.save();

    res.json({ success: true, message: 'Course added successfully', course: newCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Educator course
export const getEducatorCourses = async (req, res) => {
  try {
    const educatorId = req.auth.userId;
    const courses = await Course.find({ educator: educatorId })
    //.populate('educator', 'firstName lastName profileImage');

    if (!courses || courses.length === 0) {
      return res.status(404).json({ success: false, message: 'No courses found for this educator' });
    }

    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get educator dashboard data(total earning, enrolled students, no of courses)
export const getEducatorDashboardData = async (req, res) => {
  try {
    const educatorId = req.auth.userId;
    const courses = await Course.find({ educator: educatorId });
    const totalCourses = courses.length;
    const courseIds = courses.map(course => course._id);

    //calculate total earning from purchases
    const purchases = await Purchase.find({ courseId: { $in: courseIds }, status: 'completed' });
    const totalEarnings = purchases.reduce((acc, purchase) => acc + purchase.amount, 0);

    // collect unique enrolled student ids with their course titles
    const enrolledStudents = [];
    for (const course of courses) {
      const students = await User.find({ _id: { $in: course.enrolledStudents } }, 'name imageUrl');
      students.forEach(student => {
        enrolledStudents.push({
          courseTitle: course.courseTitle,
          student
        });
      });
    }

    res.json({
      success: true, dashboardData: {
        totalEarnings,
        enrolledStudents,
        totalCourses
      }
    })

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// get enrolled student data with purchase data
export const getEnrolledStudents = async (req, res) => {
  try {
    const educatorId = req.auth.userId;
    const courses = await Course.find({ educator: educatorId });
    const courseIds = courses.map(course => course._id);

    const purchases = await Purchase.find({ courseId: { $in: courseIds }, status: 'completed' })
      .populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

    const enrolledStudents = purchases.map(purchase => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt
    }));

    res.json({ success: true, enrolledStudents });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}