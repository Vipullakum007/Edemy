import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets';


const TestimonialsSection = () => {

  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Testimonials</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Hear from our learners as they share their journeys of transformation, success, and how our
            platform has made a difference in their lives.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 text-left">
          {dummyTestimonial.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              {/* Profile Section */}
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, index) => (
                  <img key={index} src={index < Math.floor(testimonial.rating) ? assets.star : assets.star_blank} alt="star" className='h-5' />
                ))}
              </div>

              <p className="text-gray-700 mb-4 leading-relaxed">
                {testimonial.feedback}
              </p>

              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors underline">
                Read more
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TestimonialsSection