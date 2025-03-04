import React, { useContext, useState } from 'react'
import UserInfo from '../list/userInfo/userInfo'
import ChatList from '../list/chatList/ChatList'
import assests from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { arrayUnion, collection, deleteDoc, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { AppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';


interface User {
  id: string;
  name: string;
  profilePic: string;
  // Add other properties that exist in your user data
}



const LeftSidebar = () => {
  const navigate = useNavigate();
  const { userData, chatData, chatUser, setChatUser, setMessagesId, messagesId }  = useContext(AppContext);
  const [user, setUser] = useState<User | null>(null);  // Allow User type or null 
  const [showSearch, setShowSearch] = useState(false);



  console.log(chatData, 'chatDatachatDatachatData');


  const editHandler = () => {
    navigate('/profile')
  }

  const inputHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {

    try {
      const input = e.target.value
      if (input) {
        setShowSearch(true)
        const userRef = collection(db, 'users')
        const q = query(userRef, where('name', "==", input.toLowerCase()))
        const querySnap = await getDocs(q)
        if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
          let userExist = false
          chatData.map((user: any) => {
            if (user.id === querySnap.docs[0].id) {
              userExist = true
              return
            }
          })
          if (!userExist) {
            setUser(querySnap.docs[0].data() as User)
          }

          // Type the data as User
          const userDataFromQuery = querySnap.docs[0].data() as User;
          setUser(userDataFromQuery);
        } else {
          setUser(null)
        }
      } else {
        setShowSearch(false)
      }
    } catch (error) {
      console.log(error); // Consider logging the error for debugging
    }
  }

  const addChat = async () => {
    if (chatData.length > 0) {
      return
    }
    const messageRef = collection(db, 'messages')
    const chatsRef = collection(db, 'chats')
    try {
      const newMessageRef = doc(messageRef)
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        message: []
      })
      if (user) {
        await updateDoc(doc(chatsRef, user.id), {
          messages: arrayUnion({
            messageId: newMessageRef.id,
            lastMessage: "",
            rId: userData.id,
            updatedAt: Date.now(),
            messageSeen: true

          }),

        })
      }
      await updateDoc(doc(chatsRef, userData.id), {
        messages: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: user?.id || '',
          updatedAt: Date.now(),
          messageSeen: true

        })
      })
    } catch (error: any) {
      toast.error(error.message)
      console.log(error)
    }
  }

  const setChat = async (item: any) => {
    setMessagesId(item.messageId)
    setChatUser(item)
  }

  const deleteMessage = async (chatId: any) => {
    try {
      const messageRef = doc(db, "chats", chatId);
      await deleteDoc(messageRef);
      console.log("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <>
      <div className='ls bg-[#001030] h-[70vh] text-white rounded-2xl' >
        <div className="ls-top p-5 ">
          <div className="ls-nav flex justify-between items-center">
            <img src={assests.logo} alt='logo ' className='max-w-[140px]' />
            <div className="menu relative px-[10px] py-[0px] ">
              <img src={assests.menu_icon} alt='logo' className='max-h-[20px] opacity-[0.6] cursor-pointer ' />
              <div className="sub-menu absolute top-full right-0 w-[130px] p-5 rounded-md bg-white text-black hidden ">
                <p onClick={editHandler}> Edit profile</p>
                <hr className='border-none h-[1px] bg-[#a4a4a4] mx-[8px] my-[0px]' />
                <p onClick={() => auth.signOut()}>Logout</p>
              </div>
            </div>
          </div>
          <div className="ls-serach flex items-center  gap-3 bg-red-500 rounded-md px-[10px] py-[12px] mt-5">
            <img src={assests.search_icon} alt='logo' className='w-[16px]' />
            <input type='text' placeholder='search here' className='bg-transparent border-none outline-none text-white text-xs' onChange={inputHandler} />
          </div>
        </div>
        <div className="ls-list flex flex-col h-[70%] overflow-y-scroll">
          {/* <div className="friends flex items-center gap-3 px-[10px] py-[20px] cursor-pointer text-sm hover:bg-[#077EFF] hover:rounded-lg">
          <img src={assests.profile_img} alt='logo' className='w-[35px] aspect-square rounded-[50%]' />
            <div className='flex flex-col'>
              <p>ricvhard</p>
              <span className='text-[#9f9f9f] text-sm hover:text-white'>Hello, how are you?</span>
            </div>
          </div> */}
          {console.log(chatData, 'chatData')}

          {showSearch && user ? <div className='className="friends flex items-center gap-3 px-[10px] py-[20px] cursor-pointer text-sm hover:bg-[#077EFF] hover:rounded-lg' onClick={addChat} >
            <img src={user?.profilePic} alt='profilepic' className='w-[35px] aspect-square rounded-[50%]' />
            <p> {user?.name}</p>
          </div>
            :
            // Array(12).fill("").map((item, index) => {
            // Fixed version

            chatData !== null && chatData.map((item: any, index: any) => (
              <div
                className="friends flex items-center  gap-3 px-[10px] py-[20px] cursor-pointer text-sm hover:bg-[#077EFF] hover:rounded-lg"
                key={index}
                onClick={() => setChat(item)}
              >

                <img
                  src={item?.user?.profilePic}
                  alt='logo'
                  className='w-[35px] aspect-square rounded-[50%]'
                />


                <div className='flex flex-col'>
                  <p className='text-white'>{item?.user?.name}</p>
                  <span className='text-white text-sm hover:text-white'>
                    {item?.user?.lastMessage}
                  </span>
                </div>

                {/* <button
                  className="text-slate-800 hover:text-blue-600 text-sm bg-white hover:bg-slate-100 border border-slate-200 rounded-lg font-medium px-2 py-1 inline-flex space-x-1 items-center" onClick={() => deleteDoc(item?.id)}>
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                      stroke="currentColor" className="w-6 h-6">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </span>
                </button> */}
              </div>
            ))
            // <div>addsasda</div>
          }

        </div>
      </div >
    </>
  )
}

export default LeftSidebar