import React from 'react';
import { useUserStore } from '../../../store/store';

const UserInfo = () => { 

  return (
    <>
      <div className=" flex justify-between items-center p-5">
        <div className="user flex items-center gap-5">
          <div className="flex  items-center gap-5">
            <img
              src={ './avatar.png'}
              alt="avatar"
              className="w-12 h-12 rounded-[50%] object-cover"
            />
            <h2 className="">demo  </h2>
          </div>
        </div>
        <div className="icons flex gap-5">
          <img src="./more.png" alt="more" className="w-5 h-5 cursor-pointer " />
          <img src="./video.png" alt="video" className="w-5 h-5 cursor-pointer " />{" "}
          <img src="./edit.png" alt="edit" className="w-5 h-5 cursor-pointer " />
        </div>
      </div>
    </>
  );
};

export default UserInfo;
