import React, { useContext, useEffect, useState } from 'react'
import Chat from '../chat/Chat'
import assests from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { arrayUnion, doc, getDoc, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

const ChatBox = () => {
  const { userData, messagesId, chatUser, messages, setMessages } = useContext(AppContext)

  const [input, setInput] = useState("")

  const sendMessage = async (e) => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData?.id,
            text: input,
            createdAt: new Date()
          })
        })
        const userIDs = [chatUser.rId, userData.id];
        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, 'chats', id)
          const userChatsSnapshot = await getDoc(userChatsRef)

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data()
            console.log(userChatData, "!! userChatData")
            const chatIndex = userChatData.messages.findIndex((c) => c.messageId === messagesId)
            console.log(userChatData)

            userChatData.messages[chatIndex].lastMessage = input.slice(0, 30)
            userChatData.messages[chatIndex].updatedAt = Date.now()
            if (userChatData.messages[chatIndex].rId === userData.id) {
              userChatData.messages[chatIndex].messageSeen = false
            }
            await updateDoc(userChatsRef, {
              chatsData: userChatData.messages,
            })
          }
        })
      }
    } catch (err) {
      console.error("Error sending message:", err)
      toast.error("Error sending message")
    }
    setInput("")
  }

  const convertTimeStamp = (timestamp: any) => {
    let date = timestamp.toDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    if (hour > 12) {
      return hour - 12 + ':' + minute + "PM"
    } else {
      return hour + ':' + minute + "AM"

    }
  }

  const sendImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", "Chatbot");

      const response = await fetch("https://api.cloudinary.com/v1_1/duafpzkdx/image/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload avatar to Cloudinary");
      }

      const data = await response.json();
      toast.success("Uploaded avatar")
      if (!input && messagesId) {
        await updateDoc(doc(db, 'messages', messagesId), {
          messages: arrayUnion({
            sId: userData?.id,
            image: data?.secure_url,
            createdAt: new Date()
          })
        })

        console.log("Image URL:", data?.secure_url);


        const userIDs = [chatUser.rId, userData.id];
        userIDs.forEach(async (id) => {
          const userChatsRef = doc(db, 'chats', id)
          const userChatsSnapshot = await getDoc(userChatsRef)

          if (userChatsSnapshot.exists()) {
            const userChatData = userChatsSnapshot.data()
            console.log(userChatData, "!! userChatData")
            const chatIndex = userChatData.messages.findIndex((c) => c.messageId === messagesId)
            console.log(userChatData)

            userChatData.messages[chatIndex].lastMessage = "Image"
            userChatData.messages[chatIndex].updatedAt = Date.now()
            if (userChatData.messages[chatIndex].rId === userData.id) {
              userChatData.messages[chatIndex].messageSeen = false
            }
            await updateDoc(userChatsRef, {
              chatsData: userChatData.messages,
            })
          }
        })
      }

      // return data.secure_url; // Return the image URL from Cloudinary 

    } catch (err) {
      console.error("Error sending image:", err)
      toast.error("Error sending image")
    }
  }


  useEffect(() => {
    if (messagesId) {
      const unSub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
        console.log(res, "adqewqw")
        setMessages(res?.data()?.messages.reverse())
        console.log(res?.data()?.messages.reverse())
      })

      return () => {
        unSub()
      }
    }
  }, [messagesId])

  console.log(chatUser, "messagesmessagesmessages");



  return chatUser ? (
    <>


      <div className='chat-box h-[70vh]   relative bg-[#f1f5ff] chat'>
        <div className="chat-user px-[10px] py-[15px] flex items-center gap-3 border border-b-[#c6c6c6]">
          <img src={chatUser?.user?.profilePic} alt='' className='w-[25px] h-[25px] rounded-[50%]  ' />
          <p className='flex-1 font-medium text-[20px] text-[#393939] flex items-center gap-1'> {chatUser?.user?.name} <img src={assests.green_dot} alt='green-dot' className='w-[15px] ' />  </p>
          <img src={assests.help_icon} alt='green-dot' className='help w-[38px] aspect-square' />
        </div>


        <div className='chat-msg'>

          {messages.map((msg: any, index: any) => (
            <div className={msg.sId === userData.id ? 's-msg' : "r-msg"} key={index}>
              {msg['image'] ? <img src={msg?.image} alt='' className='w-48 rounded-lg' /> : <p className="msg text-black">{msg?.text}</p>}
              <div>
                <img src={msg.sId === userData.id ? userData.profilePic : chatUser.user.profilePic} alt="profileimaage" />
                <p className='text-black'> {convertTimeStamp(msg?.createdAt)}</p>
              </div>
            </div>
          ))}

          {/* <div className="s-msg">
            <img src={assests.pic1} className='msg-img' alt="profileimaage" />
            <div>
              <img src={assests.profile_img} alt="profileimaage" />
              <p className='text-black'>2.30pm</p>
            </div>
          </div>

          <div className="r-msg">
            <p className="msg text-black">Lorem ipsum dolar sit......</p>
            <div>
              <img src={assests.profile_img} alt="profileimaage" />
              <p className='text-black'>2.30pm</p>
            </div>
          </div> */}

        </div>


        <div className="chat-input flex items-center gap-3 px-[10px] py-[15px] bg-white absolute bottom-0 left-0 right-0">
          <input type='text' placeholder='Send a message' className='flex-1 border-none outline-none text-black' value={input} onChange={(e) => setInput(e.target.value)} />
          <input type='file' id='image' accept='image/png, image/jpeg' hidden placeholder='Send a message' onChange={sendImage} />
          <label htmlFor="image" className='flex'>
            <img src={assests.gallery_icon} alt='attachment' className='w-[22px] cursor-pointer' />
          </label>
          <img src={assests.send_button} alt='attachment' className='w-[22px] cursor-pointer' onClick={sendMessage} />
        </div>
      </div>
    </>
  ) : <div className='w-full flex flex-col items-center justify-center gap-1 '>
    <img src={assests.logo_icon} alt='' className='w-[60px]' />
    <p className='text-xl font-medium text-white'>Chat anytime ,anywhere </p>
  </div>
}

export default ChatBox