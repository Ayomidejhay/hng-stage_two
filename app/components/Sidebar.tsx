'use client';

import Image from 'next/image'
import React from 'react'
import { useTheme } from '../hooks/useTheme';

const Sidebar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    // <div className='hidden lg:block h-screen w-[103px] bg-[#373B53] rounded-r-[20px] flex flex-col justify-between'>
    <div className='hidden lg:flex h-[100vh] w-[103px] bg-[#373B53] rounded-r-[20px] flex-col justify-between'>
        <div className='relative flex justify-center items-center'>
            <div className='relative'>
                <Image src='/Rectangle.png' alt='logo-bg' width={103} height={103}/>
            </div>
            <div className='absolute'>
                <Image src='/logos.png' alt='logo' width={40} height={40}/>
            </div>
        </div>
        <div className='flex flex-col gap-[32px] mb-6 bottom-0 items-center'>
            <button onClick={toggleTheme}>
                <Image src='/moon.png' alt='toggle-btn' width={19.9} height={19.9}/>
            </button>
            <div className='w-full border border-[#494E6E]'></div>
            <div >
                <Image src='/user.jpg' alt='user' width={40} height={40} className='rounded-full'/>
            </div>
        </div>
    </div>
  )
}

export default Sidebar