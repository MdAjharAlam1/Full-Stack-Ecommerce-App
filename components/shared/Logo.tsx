import Image from 'next/image'
import React from 'react'

const Logo = () => {
  return (
    <div>
      <Image
        src="/images/logo.png"
        alt="logo"
        width={70}
        height={0}
        priority
        style={{width:"auto", height:"auto"}}
      />
    </div>
  )
}

export default Logo
