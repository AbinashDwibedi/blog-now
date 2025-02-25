import React, { useState } from 'react';
import { Axios } from '../utils/axios';
import { toast } from 'react-toastify';
import loaderGif from '../assets/Loader.gif';
import { useNavigate } from 'react-router-dom';

function ChangeImage({ type, userId, setIsChangeImageOpen, setUserData }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null);
  }

  async function handleUpload() {
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    const formData = new FormData();
    const imageName = type === 'avatar' ? 'avatarImage' : 'backgroundImage';
    formData.append(imageName, file);

    try {
      setIsLoading(true); 
      const endpoint =
        type === 'avatar' ? '/user/changeAvatarImage' : '/user/changeBackgroundImage';
      const { data } = await Axios.put(endpoint, formData);
      setUserData((prev) => ({ ...prev, [`${type}Image`]: data.updatedImage }));
      toast.success(`${type === 'avatar' ? 'Avatar' : 'Background'} image updated successfully`);
      setIsChangeImageOpen(false);
      location.reload();
    } catch (error) {
      toast.error('Failed to update image');
    } finally {
      setIsLoading(false); 
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-[#1d1b1b80] flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg w-96">
        <h2 className="text-xl font-semibold text-primary-dark mb-4">
          Update {type === 'avatar' ? 'Avatar' : 'Background'} Image
        </h2>

        <div className="relative mb-4 w-full h-40 border-2 border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
          {preview ? (
            <div className="relative w-full h-full">
              <img
                src={preview}
                alt="Selected"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[#00000080] flex items-center justify-center">
                <p className="text-white font-semibold text-lg">Upload Image</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No image selected</p>
          )}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full mb-4"
        />

       
        <div className="flex justify-between">
          <button
            onClick={() => setIsChangeImageOpen(false)}
            className="bg-danger-light text-white py-2 px-4 rounded-md"
            disabled={isLoading} 
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="bg-primary-dark text-white py-2 px-4 rounded-md"
            disabled={isLoading} 
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        {isLoading && (
          <div className="absolute top-0 left-0 w-full h-full bg-[#00000080] flex items-center justify-center rounded-lg">
            <img src={loaderGif} alt="Loading..." className="w-12 h-12" />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChangeImage;
