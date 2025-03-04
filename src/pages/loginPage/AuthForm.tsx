
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { auth, db, googleProvider } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

// Define common properties for form components
interface AuthFormProps {
    type?: "login" | "signup";
    toggleType: () => void;
    isLogin: boolean;
    isOpen: boolean;
    onClose: () => void;
}

// Reusable Form Component (Handles both Login & Signup)
const AuthForm: React.FC<AuthFormProps> = ({ isLogin, toggleType }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null); // State for avatar preview

    // Handle file input change to show preview
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true)

        // Perform form validation and submission logic here

        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        const avatarFile = formData.get("avatar") as File | null;

        // console.log(formData)

        // console.log("Raw FormData:", Array.from(formData.entries())); // Log all form data entries
        // console.log("Form Data:", { email, password, name, avatarFile }); // Add this

        try {

            if (isLogin) {
                // Login flow
                if (!email || !password) throw new Error("Email and password are required for login");
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                toast.success("Logged in successfully!");
            } else if (!isLogin) {
                // Signup flow
                if (!email || !password || !name || !avatarFile || avatarFile.size === 0) throw new Error("Required fields missing for signup");
                const res = await createUserWithEmailAndPassword(auth, email, password);
                console.log(res, "createUserWithEmailAndPassword")
                let imageUrl = "";

                // Upload avatar to Cloudinary if an image is selected
                if (avatarFile && avatarFile.size > 0) {
                    const uploadData = new FormData();
                    uploadData.append("file", avatarFile);
                    uploadData.append("upload_preset", "Chatbot");

                    const response = await fetch(
                        `https://api.cloudinary.com/v1_1/duafpzkdx/image/upload`,
                        { method: "POST", body: uploadData }

                    );
                    if (!response.ok) throw new Error("Failed to upload avatar to Cloudinary");

                    const data = await response.json();
                    imageUrl = data.secure_url;
                }

                // Save user data to Firestore
                await setDoc(doc(db, "users", res.user.uid), {
                    name,
                    email,
                    id: res.user.uid,
                    profilePic: imageUrl || "./default_profilepic.jpg",
                    bio: 'Hey there i am using chat app',
                    lastSeen: Date.now()
                }, { merge: true });

                // Save user chats to Firestore
                await setDoc(doc(db, "chats", res.user.uid), {
                    chatsData: [],
                });
                toast.success("Account created successfully You can login now !");
            } else {
                throw new Error("Invalid submission: Provide email and password for login, or all fields for signup");
            }

        } catch (error) {
            console.error(error);
            toast.error((error as any).message || "Something went wrong");
        }
        finally {
            setLoading(false)
        }
    }



     // Google SignIn Function
     const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // You can customize this further by storing user data in Firestore if necessary
            await setDoc(doc(db, "users", user.uid), {
                name: user.displayName,
                email: user.email,
                id: user.uid,
                profilePic: user.photoURL || "./default_profilepic.jpg",
                bio: 'Hey there, I am using chat app',
                lastSeen: Date.now()
            }, { merge: true });

            toast.success("Logged in with Google!");
        } catch (error) {
            console.error(error);
            toast.error((error as any).message || "Google sign-in failed");
        }
    };




    return (
        <section className="flex justify-center items-center p-6">
            <div className="bg-[#111928bf] rounded-2xl flex max-w-3xl p-5 items-center w-full">
                <div className="md:w-1/2 px-8">
                    <h2 className="font-bold text-3xl text-white">
                        {isLogin ? "Login" : "Sign Up"}
                    </h2>
                    <p className="text-sm mt-4 text-white">
                        {isLogin ? "If you're a member, log in now." : "Create an account to get started!"}
                    </p>

                    <form className="flex flex-col gap-4 mt-6" onSubmit={handleSubmit}>
                        {!isLogin && <input className="p-2 rounded-xl border text-black" type="text" placeholder="name" name="name" />}
                        <input className="p-2 rounded-xl border text-black" type="email" placeholder="Email" name="email" />
                        <input className="p-2 rounded-xl border text-black w-full" type="password" placeholder="Password" name="password" />
                        {!isLogin && (
                            <div className="  relative border-2 border-gray-300 border-dashed rounded-lg p-6" id="dropzone">
                                <input type="file" id="file" name="avatar" className="absolute inset-0 w-full h-full opacity-0 z-50" onChange={handleFileChange} />
                                <div className="text-center">
                                    <img className="mx-auto h-12 w-12" src="./upload.svg" alt="" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        <label htmlFor="file-upload" className="relative cursor-pointer">
                                            <span className="text-white">Drag and drop</span>
                                            <span className="text-indigo-600"> or browse</span>
                                            <span className="text-white">to upload</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                        </label>
                                    </h3>
                                    <p className="mt-1 text-xs text-white">
                                        PNG, JPG, GIF up to 10MB
                                    </p>
                                </div>

                                <img src="" className="mt-4 mx-auto max-h-40 hidden" id="preview" />
                            </div>

                        )}


                        <button className={`bg-[#002D74] text-white py-2 rounded-xl hover:scale-105 duration-300 disabled:cursor-not-allowed disabled:opacity-50`} disabled={loading}>
                            {isLogin ? "Login" : "Sign Up"}
                        </button>
                    </form>

                    <p className="text-sm text-center mt-4">
                        <button
                        onClick={handleGoogleSignIn}
                            className= "mb-2 w-full flex items-center justify-center gap-2 border py-2 rounded-full hover:text-black hover:bg-gray-50">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG5FqrS9OkN5XrA5_GXcN7OV-SoLIl0KPwoQ&s" alt="Google" className="h-5" />
                            Continue with Google
                        </button>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button className={`text-blue-600 ml-1 hover:underline disabled:cursor-not-allowed disabled:opacity-50 `} onClick={toggleType} disabled={loading}>
                            {isLogin ? "Sign Up" : "Login"}
                        </button>

                    </p>
                </div>
                <div className="md:block hidden w-1/2">
                    {!isLogin && (
                        <img src={avatarPreview || './default_profilepic.jpg'} alt="profileImage" className="h-[500px] w-full" />
                    ) || (<img className="rounded-2xl w-full h-[500px] object-cover" src="./profile_pic.jpg" alt="login form image" />)}
                </div>

            </div>
        </section>
    );
};



export default AuthForm;

