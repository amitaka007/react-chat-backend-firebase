import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import React, { createContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import { auth, db } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

// Define the shape of the user data
interface UserData {
    profilePic?: string;
    name?: string;
    lastSeen?: number;
    // Add other properties if necessary
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextProps {
    children: ReactNode;
}

interface AppContextType {
    userData: UserData | null;
    setUserData: (data: UserData | null) => void;
    chatData: any;  // Define the type for chatData if necessary
    setChatData: (data: any) => void;  // Define the type for setChatData
    loadUserData: (uid: string) => void;



}

const AppContextProvider = (props: AppContextProps) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [chatData, setChatData] = useState<any>(null);  // Replace `any` with the actual type if possible
    const [messagesId, setMessagesId] = useState(null)
    const [messages, setMessages] = useState([])
    const [chatUser, setChatUser] = useState(null)


    const loadUserData = async (uid: string) => {
        try {
            const userRef = doc(db, "users", uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap?.data() as UserData | null;
            setUserData(userData); 

            if (userData?.profilePic && userData?.name) {
                navigate("/chat");
            } else {
                navigate("/profile");  // Redirect to profile update page if profile pic or username is not available.
            }

            // Update lastSeen field
            await updateDoc(userRef, {
                lastSeen: Date.now(),
            });
 

            // Periodically update the lastSeen field
            setInterval(async () => {
                if (auth.currentUser) {
                    await updateDoc(userRef, {
                        lastSeen: Date.now(),
                    });
                }
            }, 60000);
        } catch (error) {
            console.error("Error loading user data:", error);
        }
    };


    useEffect(() => {

        if (userData) {
            const chatRef = doc(db, 'chats', userData.id);
            const unSub = onSnapshot(chatRef, async (res) => {
                const chatItems = res?.data()?.messages  || []

                // const tempData = []
                // for (const item of chatItems) {
                //     // console.log(item, '@@@@itemitem');

                //     const userRef = doc(db, 'users', item.rId);
                //     const userSnap = await getDoc(userRef);
                //     const userData = userSnap?.data() as UserData | null;
                //     console.log({ ...item, user: userData }, '@@@@userData');    

                //     tempData.push({ ...item, user: userData })
                // }
                // console.log(tempData, 'tempData');

                // setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt))
                console.log(res?.data(), 'chatItems');

                const tempDataPromises = chatItems.map(async (item: any) => {
                    const userRef = doc(db, 'users', item.rId);
                    const userSnap = await getDoc(userRef);
                    const userData = userSnap?.data() as UserData | null;
                    console.log({ ...item, user: userData }, '@@@@userData');

                    return { ...item, user: userData };
                });

                // Wait for all the promises to resolve
                const tempData = await Promise.all(tempDataPromises);
                setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));

                console.log(tempData, 'tempData');
            })
            return () => unSub()  // Clean up the subscription when the component unmounts

        }
    }, [userData])

    const value: AppContextType = {
        userData,
        setUserData,
        chatData,
        setChatData,
        loadUserData,
        messages,
        setMessages,
        messagesId,
        setMessagesId,
        chatUser,
        setChatUser
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
