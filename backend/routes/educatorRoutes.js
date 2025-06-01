import express from 'express'
import { addCourse, getEducatorCourses, getEducatorDashboardData, getEnrolledStudents, updateRoleToEducator } from '../controllers/educatorController.js'
import upload from '../configs/multer.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const educatorRouter = express.Router()

educatorRouter.get('/update-role', updateRoleToEducator)
educatorRouter.post('/add-course', upload.single('image'), authMiddleware, addCourse)
educatorRouter.get('/courses', authMiddleware, getEducatorCourses)
educatorRouter.get('/dashboard', authMiddleware, getEducatorDashboardData)
educatorRouter.get('/enrolled-students', authMiddleware, getEnrolledStudents)

export default educatorRouter