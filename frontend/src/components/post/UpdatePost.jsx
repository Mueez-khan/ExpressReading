import  { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UpdatePost = () => {
  const { id } = useParams();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [oldFiles, setOldFiles] = useState([]);
  const [userText, setUserText] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const getPostData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/v1/post/getPost/${id}`
      );
      const data = await response.json();
      setUserText(data.data.description);
      setOldFiles(data.data.postImage);
    } catch (error) {
      setAlert({
        show: true,
        message: 'Failed to load post data',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPostData();
  }, [id]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + oldFiles.length > 6) {
      setAlert({
        show: true,
        message: 'Maximum 6 images allowed in total',
        type: 'error'
      });
      return;
    }
    setSelectedFiles(files);
  };

  const handleRemoveNewImage = (index) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const handleRemoveOldImage = (index) => {
    setOldFiles(files => files.filter((_, i) => i !== index));
  };

  const handleTextChange = (e) => {
    setUserText(e.target.value);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("description", userText);
    selectedFiles.forEach((file) => {
      formData.append(`postImage`, file);
    });
    oldFiles.forEach((file) => {
      formData.append(`postImage`, file);
    });

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/post/editPost/${id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Update failed');

      setAlert({
        show: true,
        message: 'Post updated successfully!',
        type: 'success'
      });
    } catch (error) {
      setAlert({
        show: true,
        message: 'Failed to update post. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            Update Your Post ✏️
          </h1>
          <p className="text-gray-500 text-center">
            Make changes to your post and save them
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
              placeholder="Update your post description..."
            />

            <div className="space-y-4">
              {oldFiles.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Current Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {oldFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={file}
                          alt={`Current ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveOldImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedFiles.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">New Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
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
                    <span className="text-gray-600">Add New Photos (Max 6 total)</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || (!userText && oldFiles.length === 0 && selectedFiles.length === 0)}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
          >
            {loading ? (
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <span>Update Post</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePost;