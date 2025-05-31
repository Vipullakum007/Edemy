import React from 'react'
import Hero from '../../components/learner/Hero'
import Companies from '../../components/learner/Companies'
import CoursesSection from '../../components/learner/CoursesSection'
import TestinomialsSection from '../../components/learner/TestinomialsSection'
import CallToAction from '../../components/learner/CallToAction'
import Footer from '../../components/learner/Footer'

const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center '>
      <Hero />
      <Companies />
      <CoursesSection />
      <TestinomialsSection />
      <CallToAction />
      <Footer />
    </div>
  )
}

export default Home