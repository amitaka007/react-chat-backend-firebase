import React, { useEffect, useState } from "react";
import AddUser from "./AddUser/AddUser";
 

interface Chat {
  chatId: string;
  receiverId: string;
  user: any;
  updateAt: number;
  images: string;
  name: string;
  message: string;
}

const ChatList = () => {
  const [addMode, setAddMode] = useState<boolean>(false);
  const [chats, setChats] = useState<Chat[]>([]);

 


  const handleSelect = async (chat: Chat) => { 
  };

  return (
    <>
      <div className="chatList ">
        <div className="search">
          <div className="flex justify-center sm:justify-start">
            <input
              className="  text-md py-1 px-2 bg-[#11192880] dark:bg-gray-900 text-white rounded-lg dark:text-gray-100  font-semibold  "
              type="search"
              name="q"
              placeholder="Search"
            />
          </div>
          <img
            src={addMode ? "./minus.png" : "./plus.png"}
            alt="add"
            className="add"
            onClick={() => setAddMode((prev) => !prev)}
          />
        </div>




        {chats.map((chat, index) => (
          <div
            key={`${chat.chatId}-${chat.receiverId}-${index}`} // Unique key
            className="item flex items-center  gap-5 p-5 cursor-pointer border-b-[1px] border-[#dddddd35]"
            onClick={() => handleSelect(chat)}
          >
            <img
              src={chat.user?.profilePic || './default-avatar.png'}
              className="avatar w-[50px] h-[50px]  rounded-[50%] object-cover"
            />
            <div className="texts flex flex-col gap-[10px]">
              <span className="font-medium">{chat?.user?.username}</span>
              <p className="text-sm font-light">{chat?.user?.lastMessage}</p>
            </div>
          </div>
        ))}
        {addMode && (
          <AddUser />
        )}

      </div>
    </>
  );
};

export default ChatList;
