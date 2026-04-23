import Image from "next/image";
import React from "react";

const Navbar = () => {
  return (
    <div className="lg:hidden h-20 w-full flex justify-between bg-[#373B53]">
      <div className="relative flex justify-center items-center">
        <div className="relative">
          <Image src="/Rectangle.png" alt="logo-bg" width={80} height={80} />
        </div>
        <div className="absolute">
          <Image src="/logos.png" alt="logo" width={31} height={29} />
        </div>
      </div>
      <div className="flex gap-[32px] items-center mr-6">
        <div>
          <Image src="/moon.png" alt="toggle-btn" width={19.9} height={19.9} />
        </div>
        <div className="h-full w-[0.5px] border border-[#494E6E]"></div>
        <div>
          <Image
            src="/user.jpg"
            alt="user"
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
