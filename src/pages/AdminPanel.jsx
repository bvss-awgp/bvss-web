import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { getApiUrl } from "../Config/api";

const AdminPanel = () => {
  const { user, token } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("contributions");
  const [contributions, setContributions] = useState([]);
  const [contributionDetails, setContributionDetails] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token, activeTab]);

  // Reset search when switching tabs
  useEffect(() => {
    setSearchQuery("");
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      let endpoint = "";
      if (activeTab === "contributions") {
        endpoint = "/admin/contributions";
      } else if (activeTab === "contribution-details") {
        endpoint = "/admin/contribution-details";
      } else if (activeTab === "contact-messages") {
        endpoint = "/admin/contact-messages";
      }

      const response = await fetch(getApiUrl(endpoint), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Unable to fetch data.");
      }

      const data = await response.json();

      if (activeTab === "contributions") {
        setContributions(data.contributions || []);
      } else if (activeTab === "contribution-details") {
        setContributionDetails(data.contributionDetails || []);
      } else if (activeTab === "contact-messages") {
        setContactMessages(data.contactMessages || []);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError(err.message || "Unable to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return t("admin.notAvailable");
    try {
      return new Date(dateString).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  // Filter contributions by search query
  const filterContributions = (data) => {
    if (!searchQuery.trim()) return data;
    
    const query = searchQuery.toLowerCase().trim();
    return data.filter((cont) => {
      const fullName = `${cont.firstName || ""} ${cont.lastName || ""}`.toLowerCase();
      const email = (cont.email || "").toLowerCase();
      const phone = (cont.phone || "").toLowerCase();
      
      return (
        fullName.includes(query) ||
        email.includes(query) ||
        phone.includes(query)
      );
    });
  };

  // Filter contribution details by search query
  const filterContributionDetails = (data) => {
    if (!searchQuery.trim()) return data;
    
    const query = searchQuery.toLowerCase().trim();
    return data.filter((detail) => {
      const fullName = `${detail.firstName || ""} ${detail.lastName || ""}`.toLowerCase();
      const email = (detail.email || "").toLowerCase();
      const phone = (detail.phone || "").toLowerCase();
      const assignedTopic = (detail.assignedTopic || "").toLowerCase();
      
      return (
        fullName.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        assignedTopic.includes(query)
      );
    });
  };

  // Filter contact messages by search query
  const filterContactMessages = (data) => {
    if (!searchQuery.trim()) return data;
    
    const query = searchQuery.toLowerCase().trim();
    return data.filter((msg) => {
      const name = (msg.name || "").toLowerCase();
      const email = (msg.email || "").toLowerCase();
      const inquiryType = (msg.inquiryType || "").toLowerCase();
      const message = (msg.message || "").toLowerCase();
      
      return (
        name.includes(query) ||
        email.includes(query) ||
        inquiryType.includes(query) ||
        message.includes(query)
      );
    });
  };

  const filteredContributions = filterContributions(contributions);
  const filteredContributionDetails = filterContributionDetails(contributionDetails);
  const filteredContactMessages = filterContactMessages(contactMessages);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                  {t("admin.title")}
                </h1>
                <p className="text-sm sm:text-base text-gray-600">{t("admin.welcome")}, {user?.email}</p>
              </div>
            </div>
            <Link
              to="/repositories"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              {t("admin.repositories")}
            </Link>
          </div>
        </div>

        {/* Second Navbar */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-4 sm:mb-6 overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto items-center">
            <button
              onClick={() => setActiveTab("contributions")}
              className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
                activeTab === "contributions"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {t("admin.userContribution")}
            </button>
            <button
              onClick={() => setActiveTab("contribution-details")}
              className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
                activeTab === "contribution-details"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {t("admin.contributionDetails")}
            </button>
            <button
              onClick={() => setActiveTab("contact-messages")}
              className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
                activeTab === "contact-messages"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {t("admin.contactMessages")}
            </button>
            <div className="ml-auto px-4 sm:px-6">
              <button
                onClick={fetchData}
                disabled={loading}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:scale-105 disabled:transform-none"
                title="Refresh data"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="hidden sm:inline">{t("admin.refreshing")}</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span className="hidden sm:inline">{t("admin.refresh")}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
                <p className="text-gray-600 font-medium">{t("common.loading")}</p>
              </div>
            )}

            {error && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-lg p-4 mb-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

          {!loading && !error && (
            <>
              {/* User Contribution Table */}
              {activeTab === "contributions" && (
                <>
                  {/* Search Bar */}
                  <div className="mb-4 sm:mb-6">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder={t("admin.searchPlaceholder") || "Search by name, email, or phone..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base text-gray-900 bg-white shadow-sm transition-all hover:border-gray-300"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {searchQuery && (
                      <p className="mt-2 text-xs sm:text-sm text-gray-600">
                        {filteredContributions.length === 1 
                          ? t("admin.searchResultSingle") || "1 result found"
                          : `${filteredContributions.length} ${t("admin.searchResults") || "results found"}`}
                      </p>
                    )}
                  </div>

                  {contributions.length === 0 ? (
                    <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <p className="text-gray-600 font-medium">{t("admin.noContributionsFound")}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-xl border border-gray-200 shadow-lg">
                      <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
                              <tr>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {t("admin.email")}
                                  </div>
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {t("admin.name")}
                                  </div>
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden sm:table-cell">
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {t("admin.phone")}
                                  </div>
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden md:table-cell">
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    {t("admin.researchCategories")}
                                  </div>
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
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
                              {filteredContributions.length === 0 ? (
                                <tr>
                                  <td colSpan="5" className="px-4 sm:px-6 py-8 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                      </svg>
                                      <p className="text-sm text-gray-500 font-medium">{t("admin.noSearchResults") || "No results found"}</p>
                                      <p className="text-xs text-gray-400">{t("admin.tryDifferentSearch") || "Try a different search term"}</p>
                                    </div>
                                  </td>
                                </tr>
                              ) : (
                                filteredContributions.map((cont) => (
                                <tr key={cont._id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 break-words">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                      <div className="max-w-xs truncate sm:max-w-none sm:truncate-none font-medium">{cont.email}</div>
                                    </div>
                                  </td>
                                  <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">
                                    {cont.firstName} {cont.lastName}
                                  </td>
                                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
                                    <div className="flex items-center gap-2">
                                      {cont.phone ? (
                                        <>
                                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                          </svg>
                                          {cont.phone}
                                        </>
                                      ) : (
                                        <span className="text-gray-400">{t("admin.notAvailable")}</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                                    <div className="max-w-xs">
                                      {Array.isArray(cont.researchCategories) && cont.researchCategories.length > 0 ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                          {cont.researchCategories.join(", ")}
                                        </span>
                                      ) : (
                                        <span className="text-gray-400">{t("admin.notAvailable")}</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V7m0 4v10m-8-10v10M5 7h14M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                                      </svg>
                                      {formatDate(cont.createdAt)}
                                    </div>
                                  </td>
                                </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Contribution Details Table */}
              {activeTab === "contribution-details" && (
                <>
                  {/* Search Bar */}
                  <div className="mb-4 sm:mb-6">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder={t("admin.searchPlaceholder") || "Search by name, email, or phone..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm sm:text-base text-gray-900 bg-white shadow-sm transition-all hover:border-gray-300"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {searchQuery && (
                      <p className="mt-2 text-xs sm:text-sm text-gray-600">
                        {filteredContributionDetails.length === 1 
                          ? t("admin.searchResultSingle") || "1 result found"
                          : `${filteredContributionDetails.length} ${t("admin.searchResults") || "results found"}`}
                      </p>
                    )}
                  </div>

                  {contributionDetails.length === 0 ? (
                    <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl border-2 border-dashed border-gray-300">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-600 font-medium">{t("admin.noContributionDetailsFound")}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-xl border border-gray-200 shadow-lg">
                      <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600">
                              <tr>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {t("admin.email")}
                                  </div>
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {t("admin.name")}
                                  </div>
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden md:table-cell">
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                    {t("admin.researchCategories")}
                                  </div>
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden lg:table-cell">
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                    {t("admin.topicAssigned")}
                                  </div>
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
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
                              {filteredContributionDetails.length === 0 ? (
                                <tr>
                                  <td colSpan="5" className="px-4 sm:px-6 py-8 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                      </svg>
                                      <p className="text-sm text-gray-500 font-medium">{t("admin.noSearchResults") || "No results found"}</p>
                                      <p className="text-xs text-gray-400">{t("admin.tryDifferentSearch") || "Try a different search term"}</p>
                                    </div>
                                  </td>
                                </tr>
                              ) : (
                                filteredContributionDetails.map((detail) => (
                                <tr key={detail._id} className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200">
                                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 break-words">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                      <div className="max-w-xs truncate sm:max-w-none sm:truncate-none font-medium">{detail.email}</div>
                                    </div>
                                  </td>
                                  <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">
                                    {detail.firstName} {detail.lastName}
                                  </td>
                                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                                    <div className="max-w-xs">
                                      {Array.isArray(detail.researchCategories) && detail.researchCategories.length > 0 ? (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                          {detail.researchCategories.join(", ")}
                                        </span>
                                      ) : (
                                        <span className="text-gray-400">{t("admin.notAvailable")}</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                                    <div className="max-w-xs">
                                      {detail.assignedTopic ? (
                                        <div className="flex flex-col gap-1">
                                          <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200">
                                            {detail.assignedTopic}
                                          </span>
                                          {detail.assignedTopicCode && (
                                            <span className="text-xs text-gray-500">Code: {detail.assignedTopicCode}</span>
                                          )}
                                        </div>
                                      ) : (
                                        <span className="text-gray-400">{t("admin.notAvailable")}</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V7m0 4v10m-8-10v10M5 7h14M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                                      </svg>
                                      {formatDate(detail.createdAt)}
                                    </div>
                                  </td>
                                </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Contact Messages Table */}
              {activeTab === "contact-messages" && (
                <>
                  {/* Search Bar */}
                  <div className="mb-4 sm:mb-6">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder={t("admin.searchContactPlaceholder") || "Search by name, email, inquiry type, or message..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none text-sm sm:text-base text-gray-900 bg-white shadow-sm transition-all hover:border-gray-300"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {searchQuery && (
                      <p className="mt-2 text-xs sm:text-sm text-gray-600">
                        {filteredContactMessages.length === 1 
                          ? t("admin.searchResultSingle") || "1 result found"
                          : `${filteredContactMessages.length} ${t("admin.searchResults") || "results found"}`}
                      </p>
                    )}
                  </div>

                  {contactMessages.length === 0 ? (
                    <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl border-2 border-dashed border-gray-300">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-600 font-medium">{t("admin.noContactMessagesFound")}</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto -mx-4 sm:mx-0 rounded-xl border border-gray-200 shadow-lg">
                      <div className="inline-block min-w-full align-middle">
                        <div className="overflow-hidden">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-purple-600 to-pink-600">
                              <tr>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {t("admin.name")}
                                  </div>
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    {t("admin.email")}
                                  </div>
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider hidden md:table-cell">
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {t("admin.inquiryType")}
                                  </div>
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                  <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                    {t("admin.message")}
                                  </div>
                                </th>
                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
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
                              {filteredContactMessages.length === 0 ? (
                                <tr>
                                  <td colSpan="5" className="px-4 sm:px-6 py-8 text-center">
                                    <div className="flex flex-col items-center gap-2">
                                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                      </svg>
                                      <p className="text-sm text-gray-500 font-medium">{t("admin.noSearchResults") || "No results found"}</p>
                                      <p className="text-xs text-gray-400">{t("admin.tryDifferentSearch") || "Try a different search term"}</p>
                                    </div>
                                  </td>
                                </tr>
                              ) : (
                                filteredContactMessages.map((msg) => (
                                <tr key={msg._id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200">
                                  <td className="px-4 sm:px-6 py-4 text-sm font-semibold text-gray-900">
                                    {msg.name}
                                  </td>
                                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 break-words">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                      <div className="max-w-xs truncate sm:max-w-none sm:truncate-none font-medium">{msg.email}</div>
                                    </div>
                                  </td>
                                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                                      {msg.inquiryType}
                                    </span>
                                  </td>
                                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-500">
                                    <div className="max-w-2xl">
                                      <p className="break-words whitespace-pre-wrap">{msg.message}</p>
                                    </div>
                                  </td>
                                  <td className="px-4 sm:px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V7m0 4v10m-8-10v10M5 7h14M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                                      </svg>
                                      {formatDate(msg.createdAt)}
                                    </div>
                                  </td>
                                </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

