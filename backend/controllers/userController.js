import Stripe from 'stripe';
import Course from '../models/Course.js';
import Purchase from '../models/Purchase.js';
import User from '../models/User.js'
import CourseProgress from '../models/CourseProgress.js';

// get user data
export const getUserData = async (req, res) => {
  try {
    const userId = req.auth.userId;
    console.log('userid : ', userId);
    const user = await User.findById(userId)
    if (!user) {
      return res.json({ success: false, message: 'User not found ' })
    }
    res.json({ success: true, user })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// user enrolled courses with lecture links
export const getUserEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const userData = await User.findById(userId).populate('enrolledCourses');
    res.json({ success: true, enrolledCourses: userData.enrolledCourses })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// purchase course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth.userId;
    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      res.json({ success: false, message: 'Data not found' })
    }

    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: (courseData.coursePrice - courseData.discount * courseData.coursePrice / 100).toFixed(2)
    }

    const newPurchase = await Purchase.create(purchaseData);

    // stripe gateway initialize
    const stripe_api_key = process.env.STRIPE_API_KEY
    const stripe_secret_key = process.env.STRIPE_API_SECRET
    const currency = process.env.CURRENCY.toLowerCase()

    const stripeInstance = new Stripe(stripe_secret_key)
    //creating line items fro stipe
    const line_items = [{
      price_data: {
        currency,
        product_data: {
          name: courseData.courseTitle
        },
        unit_amount: Math.floor(newPurchase.amount) * 100,
      },
      quantity: 1
    }]

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items: line_items,
      mode: 'payment',
      metadata: {
        purchaseId: newPurchase._id.toString()
      }
    })

    res.json({ success: true, session_url: session.url })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// update user course progress
export const updateUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId, lectureId } = req.body;

    const progressData = await CourseProgress.findOne({ userId, courseId });
    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res.json({ success: false, message: 'Lecture already completed' })
      }
      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    }
    else {
      await CourseProgress.create({
        userId,
        courseId,
        lectureCompleted: [lectureId]
      })
    }
    res.json({ success: true, message: 'Progress updated successfully' })

  } catch (error) {
    res.json({ success: false, message: error.message })

  }
}

// get user course progress
export const getUserCourseProgress = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId } = req.body;

    const progressData = await CourseProgress.findOne({ userId, courseId });

    res.json({ success: true, progressData });
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}

// add user rating to course
export const addUserRatingToCourse = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId, rating } = req.body;

    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
      return res.json({ success: false, message: 'Invalid details' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.json({ success: false, message: 'Course not found' });
    }
    const user = await User.findById(userId);
    if (!user || !user.enrolledCourses.includes(courseId)) {
      return res.json({ success: false, message: 'User hae not purchased this course.' });
    }

    // Check if user has already rated the course
    const existingRating = course.courseRatings.findIndex(r => r.userId.toString() === userId);

    if (existingRating > -1) {
      // Update existing rating
      course.courseRatings[existingRating].rating = rating;
    } else {
      // Add new rating
      course.courseRatings.push({ userId, rating });
    }
    
    await course.save();

    res.json({ success: true, message: 'Rating added successfully', course });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
} 