import React, { useState } from 'react'
import AuthForm from '../AuthForm/AuthForm';

interface AuthModalProps {
    type: "login" | "signup";
    isOpen: boolean;
    onClose?: () => void;
}
const AuthModal: React.FC<AuthModalProps> = ({ type: initialType, isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(initialType === "login");

  
        const toggleType = () => setIsLogin((prev) => !prev);
 

    return (
        <div
        className={`fixed inset-0 flex items-center justify-center transition-opacity 
        ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
    >
        <div className="  rounded-2xl p-6 max-w-5xl w-full relative  "> 
       

            {/* Auth Form (Switches between Login & Signup) */}
            <AuthForm isLogin={isLogin} toggleType={toggleType} />
        </div>
    </div>
    )
}

export default AuthModal