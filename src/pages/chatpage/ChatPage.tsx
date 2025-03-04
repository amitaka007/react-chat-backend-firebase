import React, { useContext, useEffect, useState } from 'react'
import LeftSidebar from '../../components/leftsidebar/LeftSidebar'
import ChatBox from '../../components/chatbox/ChatBox'
import RightSide from '../../components/RightSidebar/RightSide'
import { AppContext } from '../../context/AppContext'

const ChatPage = () => {
  const { chatData, userData } = useContext(AppContext)
  const [loading, setLoading] = useState(false)

useEffect(() =>{
  if(chatData && userData){
    setLoading(false)
  }
},[])
  return (
    <>
      <div>
        {loading ? <p>Loading....</p> : <div className='container flex-col md:flex-row'>
          <LeftSidebar />
          <ChatBox />
          <RightSide />
        </div>}
      </div>

    </>
  )
}

export default ChatPage