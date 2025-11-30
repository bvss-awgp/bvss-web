import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getApiUrl } from "../Config/api";

const Repositories = () => {
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("enter-topic");
  const [formData, setFormData] = useState({
    topicName: "",
    category: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  
  // States for "Show the Topic" section
  const [repositories, setRepositories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoadingRepositories, setIsLoadingRepositories] = useState(false);
  const [repositoriesError, setRepositoriesError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState({});
  const [completingId, setCompletingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState(null);

  const researchCategoryOptions = [
    {
      value: "mental-health",
      label: "Mental Health, Psychology & Community Well-being",
    },
    {
      value: "education",
      label: "Education, Youth & Social Development",
    },
    {
      value: "gender-equality",
      label: "Gender, Equality & Social Justice",
    },
    {
      value: "health-nutrition",
      label: "Health, Nutrition & Traditional Medicine",
    },
    {
      value: "environment",
      label: "Environment, Climate & Sustainability",
    },
    {
      value: "culture-heritage",
      label: "Culture, Heritage & Indigenous Knowledge",
    },
    {
      value: "rural-development",
      label: "Rural Development, Governance & Policy",
    },
    {
      value: "information-technology",
      label: "Impact of Internet, AI  in Todays Life",
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages when user starts typing
    if (successMessage) setSuccessMessage(null);
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.topicName.trim() || !formData.category.trim()) {
      setErrorMessage(t("repository.fillAllFields"));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(getApiUrl("/admin/repositories"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          topicName: formData.topicName.trim(),
          category: formData.category.trim(),
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || t("repository.unableToSave"));
      }

      setSuccessMessage(data?.message || t("repository.topicSavedSuccess"));
      setFormData({
        topicName: "",
        category: "",
      });
      
      // Refresh repositories list if we're on the show-topic tab
      if (activeTab === "show-topic") {
        fetchRepositories();
      }
    } catch (error) {
      console.error("Failed to save topic:", error);
      setErrorMessage(error.message || t("repository.unableToSave"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchRepositories = useCallback(async () => {
    if (!token) return;
    
    setIsLoadingRepositories(true);
    setRepositoriesError(null);

    try {
      const response = await fetch(getApiUrl("/admin/repositories"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || t("repository.unableToFetch"));
      }

      setRepositories(data?.repositories || []);
    } catch (error) {
      console.error("Failed to fetch repositories:", error);
      setRepositoriesError(error.message || t("repository.unableToFetch"));
    } finally {
      setIsLoadingRepositories(false);
    }
  }, [token, t]);

  useEffect(() => {
    if (activeTab === "show-topic") {
      fetchRepositories();
    }
  }, [activeTab, fetchRepositories]);

  const filteredRepositories = selectedCategory
    ? repositories.filter((repo) => repo.category === selectedCategory)
    : repositories;

  const getCategoryLabel = (categoryValue) => {
    const category = researchCategoryOptions.find((opt) => opt.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  const handleStatusToggle = async (repoId, currentStatus) => {
    // Only allow toggling between Complete and Incomplete (not Allotted)
    if (currentStatus === 'Allotted') {
      return; // Don't allow toggling allotted topics
    }
    
    const newStatus = currentStatus === 'Complete' ? 'Incomplete' : 'Complete';
    
    setUpdatingStatus((prev) => ({ ...prev, [repoId]: true }));

    try {
      const response = await fetch(getApiUrl(`/admin/repositories/${repoId}/status`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Unable to update status.");
      }

      // Update the repository in the local state
      setRepositories((prev) =>
        prev.map((repo) =>
          repo._id === repoId ? { ...repo, status: newStatus } : repo
        )
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      alert(error.message || "Unable to update status.");
    } finally {
      setUpdatingStatus((prev) => {
        const updated = { ...prev };
        delete updated[repoId];
        return updated;
      });
    }
  };

  const handleMarkAsComplete = async (repoId) => {
    setCompletingId(repoId);

    try {
      const response = await fetch(getApiUrl(`/admin/repositories/${repoId}/complete`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Unable to mark topic as complete.");
      }

      // Update the repository in the local state
      setRepositories((prev) =>
        prev.map((repo) =>
          repo._id === repoId ? { ...repo, status: 'Complete' } : repo
        )
      );
    } catch (error) {
      console.error("Failed to mark as complete:", error);
      alert(error.message || "Unable to mark topic as complete.");
    } finally {
      setCompletingId(null);
    }
  };

  const handleDelete = async (repoId) => {
    if (!window.confirm(t("repository.confirmDelete") || "Are you sure you want to delete this topic? This action cannot be undone.")) {
      return;
    }

    setDeletingId(repoId);
    setDeleteSuccessMessage(null);
    setRepositoriesError(null);

    try {
      console.log("Deleting topic with ID:", repoId);
      const apiUrl = getApiUrl(`/admin/repositories/${repoId}`);
      console.log("Delete API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Delete response status:", response.status);

      // Read response as text first to handle errors
      let responseText = "";
      try {
        responseText = await response.text();
        console.log("Delete response text:", responseText);
      } catch (readError) {
        console.error("Error reading response:", readError);
        throw new Error("Failed to read server response.");
      }

      // Check if response is HTML (server error page)
      const trimmedText = responseText.trim();
      if (trimmedText.toLowerCase().startsWith("<!doctype") || 
          trimmedText.toLowerCase().startsWith("<html") ||
          trimmedText.startsWith("<")) {
        console.error("HTML response detected:", responseText.substring(0, 500));
        throw new Error("Server error: Received HTML instead of JSON. Please check backend server.");
      }

      // Parse JSON
      let data = null;
      try {
        if (trimmedText.length === 0) {
          throw new Error("Server returned an empty response.");
        }
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("JSON parse error:", parseError);
        console.error("Response was:", responseText.substring(0, 500));
        throw new Error("Server returned invalid JSON. Please check backend server logs.");
      }

      if (!response.ok) {
        throw new Error(data?.message || `Server error (Status: ${response.status}). Unable to delete topic.`);
      }

      // Remove the repository from the local state
      setRepositories((prev) => prev.filter((repo) => repo._id !== repoId));
      
      // Show success message in show-topic tab
      setDeleteSuccessMessage(data?.message || t("repository.topicDeletedSuccess") || "Topic deleted successfully.");
      setTimeout(() => setDeleteSuccessMessage(null), 5000);
    } catch (error) {
      console.error("Failed to delete topic:", error);
      setRepositoriesError(error.message || "Unable to delete topic. Please try again.");
      alert(error.message || "Unable to delete topic. Please check the console for details.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">{t("repository.title")}</h1>
              <p className="text-sm sm:text-base text-gray-600">{t("admin.welcome")}, {user?.email}</p>
            </div>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-md"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              {t("admin.title")}
            </Link>
          </div>
        </div>

        {/* Second Navbar */}
        <div className="bg-white rounded-xl shadow-md mb-4 sm:mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto items-center">
            <button
              onClick={() => setActiveTab("enter-topic")}
              className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === "enter-topic"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t("repository.enterTopic")}
            </button>
            <button
              onClick={() => setActiveTab("show-topic")}
              className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-colors whitespace-nowrap ${
                activeTab === "show-topic"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {t("repository.showTopic")}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {activeTab === "enter-topic" && (
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Header with Icon */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg flex-shrink-0 self-start sm:self-auto">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {t("repository.enterNewTopic")}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1 break-words">{t("repository.addNewTopicDesc")}</p>
                </div>
              </div>
              
              {successMessage && (
                <div className="mb-4 sm:mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-3 sm:p-4 shadow-sm animate-fade-in">
                  <div className="flex items-start sm:items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5 sm:mt-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs sm:text-sm text-green-700 font-medium break-words flex-1">{successMessage}</p>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="mb-4 sm:mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-lg p-3 sm:p-4 shadow-sm animate-fade-in">
                  <div className="flex items-start sm:items-center gap-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5 sm:mt-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs sm:text-sm text-red-700 font-medium break-words flex-1">{errorMessage}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-100">
                  <label htmlFor="topicName" className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <span className="flex-1 min-w-0">{t("repository.topicName")}</span>
                    <span className="text-red-500 whitespace-nowrap">{t("common.required")}</span>
                  </label>
                  <input
                    type="text"
                    id="topicName"
                    name="topicName"
                    value={formData.topicName}
                    onChange={handleChange}
                    placeholder={t("repository.topicNamePlaceholder")}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base text-gray-900 transition-all shadow-sm hover:border-blue-300"
                  />
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-gray-100">
                  <label htmlFor="category" className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="flex-1 min-w-0">{t("repository.category")}</span>
                    <span className="text-red-500 whitespace-nowrap">{t("common.required")}</span>
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 bg-white border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm sm:text-base text-gray-900 transition-all shadow-sm hover:border-indigo-300 cursor-pointer"
                  >
                    <option value="">{t("repository.selectCategory")}</option>
                    {researchCategoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end pt-2 sm:pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-bold hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>{t("repository.saving")}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{t("repository.saveTopic")}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "show-topic" && (
            <div className="p-6 sm:p-8">
              {/* Header with Icon */}
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {t("repository.viewTopicsByCategory")}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{t("repository.browseManageTopics")}</p>
                </div>
              </div>
              
              {/* Filter Section */}
              <div className="mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border border-indigo-100 shadow-sm">
                <label htmlFor="filterCategory" className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  {t("repository.filterByCategory")}
                </label>
                <select
                  id="filterCategory"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-auto px-4 py-3 bg-white border-2 border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-900 shadow-sm hover:border-indigo-300 transition-all cursor-pointer"
                >
                  <option value="">{t("repository.allCategories")}</option>
                  {researchCategoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {deleteSuccessMessage && (
                <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg p-4 shadow-sm animate-fade-in">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-green-700 font-medium">{deleteSuccessMessage}</p>
                  </div>
                </div>
              )}

              {repositoriesError && (
                <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-700 font-medium">{repositoriesError}</p>
                  </div>
                </div>
              )}

              {isLoadingRepositories ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
                  <p className="text-gray-600 font-medium">{t("repository.loadingTopics")}</p>
                </div>
              ) : filteredRepositories.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-600 font-medium">
                    {selectedCategory
                      ? t("repository.noTopicsForCategory")
                      : t("repository.noTopicsFound")}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mb-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg px-4 py-3 border border-blue-100">
                    <p className="text-sm font-semibold text-gray-700">
                      <span className="text-indigo-600">{filteredRepositories.length}</span> {filteredRepositories.length !== 1 ? t("repository.topics") : t("repository.topic")} {t("repository.found")}
                      {selectedCategory && (
                        <span className="text-gray-600"> {t("repository.in")} <span className="text-indigo-600 font-bold">"{getCategoryLabel(selectedCategory)}"</span></span>
                      )}
                    </p>
                  </div>
                  <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-xl border border-gray-200 shadow-lg">
                    <div className="inline-block min-w-full align-middle">
                      <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                            <tr>
                              <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                  </svg>
                                  {t("repository.topicName")}
                                </div>
                              </th>
                              <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                  {t("repository.category")}
                                </div>
                              </th>
                              <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  {t("repository.status")}
                                </div>
                              </th>
                              <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Mark as Complete
                                </div>
                              </th>
                              <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  {t("repository.actions") || "Actions"}
                                </div>
                              </th>
                              <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden sm:table-cell">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V7m0 4v10m-8-10v10M5 7h14M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                                  </svg>
                                  {t("admin.createdAt")}
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRepositories.map((repo, index) => {
                              const status = repo.status || 'Incomplete';
                              const isUpdating = updatingStatus[repo._id] || false;
                              
                              return (
                                <tr key={repo._id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                      <div className="text-sm font-semibold text-gray-900">{repo.topicName}</div>
                                    </div>
                                  </td>
                                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                      {getCategoryLabel(repo.category)}
                                    </span>
                                  </td>
                                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                    {status === 'Allotted' ? (
                                      <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 text-white">
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        Allotted
                                      </span>
                                    ) : (
                                      <button
                                        onClick={() => handleStatusToggle(repo._id, status)}
                                        disabled={isUpdating}
                                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 ${
                                          status === 'Complete'
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                                            : 'bg-gradient-to-r from-red-600 to-rose-700 text-white hover:from-red-700 hover:to-rose-800'
                                        } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                                      >
                                        {isUpdating ? (
                                          <>
                                            <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {t("repository.updating")}
                                          </>
                                        ) : (
                                          <>
                                            {status === 'Complete' ? (
                                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                              </svg>
                                            ) : (
                                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                              </svg>
                                            )}
                                            {status === 'Complete' ? t("repository.complete") : t("repository.incomplete")}
                                          </>
                                        )}
                                      </button>
                                    )}
                                  </td>
                                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                    {status === 'Allotted' ? (
                                      <button
                                        onClick={() => handleMarkAsComplete(repo._id)}
                                        disabled={completingId === repo._id}
                                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        title="Mark as Complete"
                                      >
                                        {completingId === repo._id ? (
                                          <>
                                            <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Marking...</span>
                                          </>
                                        ) : (
                                          <>
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span>Mark as Complete</span>
                                          </>
                                        )}
                                      </button>
                                    ) : (
                                      <span className="text-xs text-gray-400">-</span>
                                    )}
                                  </td>
                                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                    <button
                                      onClick={() => handleDelete(repo._id)}
                                      disabled={deletingId === repo._id}
                                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-700 rounded-lg hover:from-red-700 hover:to-rose-800 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                      title={t("Delete Topic")}
                                    >
                                      {deletingId === repo._id ? (
                                        <>
                                          <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                          </svg>
                                          <span>{t("repository.deleting") || "Deleting..."}</span>
                                        </>
                                      ) : (
                                        <>
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                          <span>{t ("Delete")}</span>
                                        </>
                                      )}
                                    </button>
                                  </td>
                                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V7m0 4v10m-8-10v10M5 7h14M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                                      </svg>
                                      {repo.createdAt
                                        ? new Date(repo.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                          })
                                        : t("admin.notAvailable")}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Repositories;

