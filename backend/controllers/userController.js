import Stripe from 'stripe';
import Course from '../models/Course.js';
import Purchase from '../models/Purchase.js';
import User from '../models/User.js'

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
        purchaseId: newPurchase._id.toString(), userId, courseId
      }
    })

    res.json({ success: true, session_url: session.url, })
  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}