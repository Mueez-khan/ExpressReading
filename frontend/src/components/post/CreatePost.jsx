import { useState } from 'react';

const CreatePost = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [userText, setUserText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 6) {
      setAlert({
        show: true,
        message: 'Maximum 6 images allowed',
        type: 'error'
      });
      return;
    }
    setSelectedFiles(files);
  };

  const handleRemoveImage = (index) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const handleTextChange = (e) => {
    setUserText(e.target.value);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    const formData = new FormData();
    formData.append("description", userText);
    selectedFiles.forEach((file) => {
      formData.append(`postImage`, file);
    });

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:8000/api/v1/post/createPost", {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      setAlert({
        show: true,
        message: 'Post uploaded successfully!',
        type: 'success'
      });
      setSelectedFiles([]);
      setUserText('');
    } catch (error) {
      setAlert({
        show: true,
        message: 'Failed to upload post. Please try again.',
        type: 'error'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Share Your Thoughts 💭
          </h1>
          <p className="text-gray-500 text-center">
            Create a post and share it with your network
          </p>
        </div>

        {alert.show && (
          <div className={`p-4 rounded-lg ${
            alert.type === 'success' ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'
          }`}>
            {alert.message}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-6">
          <div className="space-y-4">
            <textarea
              className="w-full min-h-[120px] p-4 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition duration-200"
              value={userText}
              onChange={handleTextChange}
              placeholder="What's on your mind?"
            />

            <div className="space-y-4">
              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-4">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                    <span className="text-gray-600">Add Photos (Max 6)</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isUploading || (!userText && selectedFiles.length === 0)}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {isUploading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <span>Share Post</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;