import React, { useContext, useEffect, useState } from 'react';
import assests from '../../assets/assets';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AppContext } from '../../context/AppContext';

interface ImageUploadEvent extends React.ChangeEvent<HTMLInputElement> { }

const ProfileUpdate = () => {
  const navigate = useNavigate()

  const {setUserData}  = useContext(AppContext)
  const [image, setImage] = useState<File | boolean>(false);
  const [name, setName] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [uid, setUid] = useState<string>('');
  const [prevImage, setPrevImage] = useState('')

  const imageUpload = (e: ImageUploadEvent) => {
    setImage(e.target.files?.[0] || false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Perform form validation and submission logic here
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get('name') as string;
    const userBio = formData.get('bio') as string;
  
    console.log(username, userBio, image, "0000");
  
    if (!prevImage && !image) {
      toast.error("Please select an image to update profile picture");
      return;
    }
  
    const docRef = doc(db, 'users', uid);
  
    // Only upload image if there is one selected
    if (image) {
      const uploadData = new FormData();
      if (image instanceof File) {
        uploadData.append('file', image);
      }
      uploadData.append('upload_preset', 'Chatbot');
  
      try {
        const response = await fetch(
          'https://api.cloudinary.com/v1_1/duafpzkdx/image/upload',
          { method: 'POST', body: uploadData }
        );
  
        // Check if response is successful
        if (!response.ok) {
          throw new Error('Image upload failed');
        }
  
        const { secure_url } = await response.json();
  
        // Update user's profile picture in Firestore
        await updateDoc(docRef, {
          profilePic: secure_url,
          bio: userBio,
          name: username,
        });
  
        toast.success('Profile picture updated successfully!');
        setImage(false); // Reset the image input field
  
      } catch (error) {
        console.error('Error during image upload:', error);
        toast.error('Failed to update profile picture. Please try again later.');
      }
    } else {
      // No image selected, just update bio and name
      try {
        await updateDoc(docRef, {
          bio: userBio,
          name: username,
        });
        toast.success('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile. Please try again later.');
      }
    }
  
    // Update user data in state and navigate
    try {
      const snap = await getDoc(docRef);
      setUserData(snap.data());
      navigate('/chat');
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to fetch user data. Please try again later.');
    }
  };
  

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) { 
        setUid(user?.uid);
        const docRef = doc(db, 'users', user?.uid); // Fix: user.uid without quotes
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setName(userData?.name || '');
          setBio(userData?.bio || '');
          setPrevImage(userData?.profilePic || '');
        } else {
          setName('');
          setBio('');
          setPrevImage('');
        }
      } else {
        navigate('/'); // Redirect to login page if user is not authenticated.
      }
    });
  }, [navigate]); // Dependency array should include navigate



  console.log(name, "adaasdasd")
  return (
    <>
      <div className="profile">
        <div className="profile-container">
          <form onSubmit={handleSubmit}>
            <h3>Profile Details</h3>
            <label htmlFor="avatar">
              <input
                type="file"
                id="avatar"
                accept=".png, .jpg, .jpeg"
                hidden
                onChange={imageUpload}
              />
              <img
                src={image ? URL.createObjectURL(image) : assests.avatar_icon}
                alt="Profile Avatar"
                className=""
              />
              Upload Profile Picture
            </label>
            <input
              type="text"
              name="name"
              value={name}
              placeholder="Your name"
              required
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              name="bio"
              className='text-black'
              value={bio}
              placeholder="Write profile bio"
              required
              onChange={(e) => setBio(e.target.value)}
            />
            <button type="submit" className="bg-white text-black">Save</button>
          </form>
          <img
            src={image ? URL.createObjectURL(image) : prevImage? prevImage : assests.logo_icon}
            alt="Logo"
            className='w-96 h-96 p-10 rounded-2xl'
          />
        </div>
      </div>
    </>
  );
};

export default ProfileUpdate;
