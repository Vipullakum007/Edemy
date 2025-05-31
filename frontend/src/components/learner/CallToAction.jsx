import React from 'react'
import { assets } from '../../assets/assets'

const CallToAction = () => {
  return (
    <div className="py-20 md:py-12 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Main Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          Learn anything, anytime, anywhere
        </h2>

        {/* Description */}
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          Incididunt sint fugiat pariatur cupidatat consectetur sit cillum anim id veniam
          aliqua proident excepteur commodo do ea.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl">
            Get started
          </button>

          <button className="text-gray-700 hover:text-gray-900 font-medium px-8 py-3 rounded-lg border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 transition-all duration-200 flex items-center gap-2">
            Learn more 
            <img src={assets.arrow_icon} alt="arrow_icon" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CallToAction