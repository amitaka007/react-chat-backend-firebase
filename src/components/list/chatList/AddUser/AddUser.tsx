import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import React, { useState } from 'react'
import { db } from '../../../../lib/firebase'
import { useUserStore } from '../../../../store/store'

const AddUser = () => {
  const [user, setUser] = useState<{ [key: string]: any } | null>(null)
 

  const { currentUser } = useUserStore()

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)
    const username = formData.get('username')?.toString().trim()

    try { 
      const userRef = collection(db, 'users')
       const q = query(userRef, where('username', '==', username))
      const querySnapshot = await getDocs(q)
      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data())
      }
    } catch (err) {
      console.log(err)
    }
  }
  console.log(user, "1222")

  const handleAdd = async () => {
    const chatRef = collection(db, 'chats')
    const userChatsRef = collection(db, 'userchats')

    try {
      if (user) {
        const newChatRef = doc(chatRef)
        await setDoc(newChatRef, {
          createdAt: serverTimestamp(),
          messages: [],
        })

        await updateDoc(doc(userChatsRef, user.id),   {
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: '',
            receiverId: currentUser.id,
            updatedAt: Date.now()
          })
        })

        await updateDoc(doc(userChatsRef, currentUser.id), {
          chats: arrayUnion({
            chatId: newChatRef.id,
            lastMessage: '',
            receiverId: user.id,
            updatedAt: Date.now()
          })
        })
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='AddUser w-max h-max p-7 rounded-[10px] absolute top-0 bottom-0  left-0 right-0  m-auto bg-[#11192880]'>
      <form className='flex gap-5' onSubmit={handleSearch}>
        <input type='text' placeholder='username' name='username' className='p-5  rounded-[10px] border-none outline-none text-md py-1 px-2 bg-[#11192880] dark:bg-gray-900 text-white   dark:text-gray-100  font-semibold  AddUser' />
        <button className='p-5  rounded-[10px] bg-[#1a73a8] text-white '>search</button>
      </form>
      {user !== null &&
        <div className='user mt-[50px] flex items-center justify-between'>
          <div className='detail flex justify-center gap-5'>
            <img src={user.avatar || './avatar.png'} alt='' className='w-[50px] h-[50px] rounded-[50%] object-cover' />
            <span>{user.username}</span>
          </div>
          <button className='p-3  rounded-[10px] bg-[#1a73a8] text-white' onClick={handleAdd}>Add User</button>
        </div>
      }
    </div>
  )
}

export default AddUser