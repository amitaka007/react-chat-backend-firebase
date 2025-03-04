
import React, { useContext, useEffect, useState } from "react";
import Chat from "./components/chat/Chat";
import Detail from "./components/details/Detail";
import List from "./components/list/List";
import AuthModal from "./components/modal/AuthModal";
import Loader from "./components/loader/Loader";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import ChatPage from "./pages/chatpage/ChatPage";
import ProfileUpdate from "./pages/profileupdate/ProfileUpdate";
import AuthForm from "./pages/loginPage/AuthForm";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { AppContext } from "./context/AppContext";

type AuthFormProps = {
  type: "login" | "signup";
  onClose: () => void;
  isOpen: boolean;
};

const App = () => {
  const [modalType, setModalType] = useState<"login" | "signup">("login");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  const user = true

  const toggleModalType = () => {
    setModalType(prev => prev === "login" ? "signup" : "login");
  };

  const navigate = useNavigate() 
  const {loadUserData}: any= useContext(AppContext)


  useEffect(()=>{
    onAuthStateChanged(auth, async (user) => { 
        if(user){
          navigate('/chat') 
          await loadUserData(user?.uid)
        }else{
          navigate('/') 
        }
    })
    },[])

  return (
    < >
      <div>
          <Routes>
            <Route path="/" element={<AuthForm toggleType={toggleModalType} isLogin={modalType === "login"} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
            />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/profile" element={<ProfileUpdate />} />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
       
      </div>

      <Toaster position="top-right" />
    </ >
  );
};

export default App;