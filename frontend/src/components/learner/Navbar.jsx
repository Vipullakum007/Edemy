import React, { useContext } from 'react';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { useClerk, useUser, UserButton } from '@clerk/clerk-react';
import { AppContext } from '../../context/AppContext';

const Navbar = () => {
  const isCourseListPage = window.location.pathname.includes('course-list');
  const { openSignUp } = useClerk();
  const { user } = useUser();
  const { navigate, isEducator } = useContext(AppContext);
  return (
    <div className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 border-b border-gray-500 py-4 ${isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'}`}>
      <Link to="/">
        <img onClick={() => navigate('/')} src={assets.logo} alt="Logo" className='w-28 lg:w-32 cursor-pointer' />
      </Link>

      <div className='hidden md:flex items-center gap-5 text-gray-500 font-medium'>
        {user
          ?
          <>
            <div className='flex items-center gap-5'>
              <button onClick={()=> navigate('/educator/dashboard')} className='hover:text-blue-600'>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
              <span>|</span>
              <Link to='/my-enrollments' className='hover:text-blue-600'>My Enrollments</Link>
            </div>
            <UserButton />
          </>
          :
          <button
            onClick={() => openSignUp()}
            className='bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition'>Create Account</button>
        }
      </div>

      {/* Phone screen */}
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
        {user
          ?
          <>
            <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
            <button onClick={()=> navigate('/educator')} className='hover:text-blue-600'>{isEducator ? 'Educator Dashboard' : 'Become Educator'}</button>
              <span>|</span>
              <Link to='/my-enrollments' className='hover:text-blue-600'>My Enrollments</Link>
            </div>
            <UserButton />
          </>
          :
          <button onClick={() => openSignUp()}><img src={assets.user_icon} alt="user" /></button>
        }
      </div>
    </div>
  );
};

export default Navbar;