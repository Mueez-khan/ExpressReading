import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Search, SortDesc } from "lucide-react";
import BookReviewCard from "./BookReviewCard";

const BookReview = () => {
  const navigate = useNavigate();
  const [postData, setPostData] = useState({ data: [] });
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  // console.log("postdata" , postData)

  const getBookReviewData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8000/api/v1/book/getAllReviewsOfBook`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch reviews');
      
      const data = await response.json();
      setPostData(data);
      setFilteredData(data.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to load reviews. Please try again later.');
      console.error("Error while fetching book review data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters and sorting whenever search query or sort option changes
  useEffect(() => {
    const applyFiltersAndSort = () => {
      try {
        let filtered = [...(postData.data || [])];

        // Apply search filter if query exists
        if (searchQuery.trim()) {
          filtered = filtered.filter(review => {
            const title = (review.heading|| '').toLowerCase();
            const description = (review.commentAboutBook || '').toLowerCase();
            const searchLower = searchQuery.toLowerCase();
            return title.includes(searchLower) || description.includes(searchLower);
          });
        }

        // Apply sorting
        filtered.sort((a, b) => {
          switch (sortOption) {
            case "newest":
              return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            case "oldest":
              return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
            
            default:
              return 0;
          }
        });

        setFilteredData(filtered);
      } catch (err) {
        console.error("Error applying filters:", err);
        setFilteredData(postData.data || []);
      }
    };

    applyFiltersAndSort();
  }, [searchQuery, sortOption, postData.data]);

  useEffect(() => {
    getBookReviewData();
  }, []);

  const handleReviewDetail = (post) => {
    navigate(`/book/books-reviews/detail/${post._id}`);
  };

  const handleCreateReview = () => {
    navigate(`/book/create-review`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-700 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <svg
              className="w-12 h-12 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Readers' Reviews
            </h1>
          </div>

          {/* Search and Sort Controls */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <div className="relative flex-1 w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <SortDesc className="text-gray-400 h-5 w-5" />
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="border border-gray-300 rounded-lg py-2 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              aria-label="searchButton"
              onClick={handleCreateReview}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Post Review
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-50 rounded-lg text-red-600">
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
          </div>
        )}

        {/* Reviews Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {filteredData.map((post) => (
              <div
                key={post._id}
                className="transform transition-all duration-300 hover:-translate-y-1"
              >
                <BookReviewCard
                  props={post}
                  onClick={() => handleReviewDetail(post)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
       
      </div>
    </div>
  );
};

export default BookReview;