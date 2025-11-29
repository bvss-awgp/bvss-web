import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getApiUrl } from "../Config/api";

const getInitials = (value) => {
  if (!value) return "BV";
  const parts = value.split("@")[0]?.split(/[.\s_-]+/).filter(Boolean);
  if (!parts || parts.length === 0) {
    return value.slice(0, 2).toUpperCase();
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const formatDate = (isoString) => {
  if (!isoString) return "Just joined";
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch (error) {
    return "Member";
  }
};

const HOURS_PER_WEEK_LABELS = {
  "1-5": "1-5 hours / week",
  "5-10": "5-10 hours / week",
  "10-15": "10-15 hours / week",
  "15-20": "15-20 hours / week",
  "20+": "20+ hours / week",
};

const toFriendlyText = (value) => {
  if (!value || typeof value !== "string") {
    return value || "";
  }

  if (/^\d+\+$/.test(value)) {
    return value;
  }

  return value
    .split(/[_-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const formatHoursPerWeek = (value) => {
  if (!value) {
    return "";
  }
  return HOURS_PER_WEEK_LABELS[value] || toFriendlyText(value);
};

const formatResearchCategories = (categories) => {
  if (!Array.isArray(categories) || categories.length === 0) {
    return "";
  }
  return categories.map((category) => toFriendlyText(category)).join(", ");
};

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
  {
    value: "social-media",
    label: "Social Media",
  },
  {
    value: "spirituality",
    label: "Spirituality",
  },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, logout } = useAuth();
  const [contribution, setContribution] = useState(null);
  const [loadingContribution, setLoadingContribution] = useState(false);
  const [contributionError, setContributionError] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    if (!token) {
      setContribution(null);
      return;
    }

    let isActive = true;

    const fetchContribution = async () => {
      try {
        setLoadingContribution(true);
        setContributionError(null);

        const response = await fetch(getApiUrl("/contributions/me"), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Unable to load contribution details.");
        }

        const payload = await response.json().catch(() => null);
        if (!isActive) {
          return;
        }

        setContribution(payload?.contribution || null);
      } catch (error) {
        console.error("Failed to fetch contribution details:", error);
        if (isActive) {
          setContributionError(error.message || "Unable to load contribution details.");
        }
      } finally {
        if (isActive) {
          setLoadingContribution(false);
        }
      }
    };

    fetchContribution();

    return () => {
      isActive = false;
    };
  }, [token]);

  const profile = useMemo(() => {
    const email = user?.email || "Member@bvss.org";
    const name = user?.name || "";
    // Use name if available, otherwise fall back to email handle
    const displayName = name || email.split("@")[0];
    // Generate initials from name if available, otherwise from email
    const initials = name ? getInitials(name) : getInitials(email);
    const joinedAt = formatDate(user?.createdAt);

    return {
      email,
      name,
      displayName,
      initials,
      joinedAt,
    };
  }, [user]);

  const contributionProfile = useMemo(() => {
    const withFallback = (value, fallback, formatter) => {
      if (value === undefined || value === null) {
        return fallback;
      }

      if (Array.isArray(value)) {
        if (value.length === 0) {
          return fallback;
        }
        return formatter ? formatter(value) : value.join(", ");
      }

      if (value === "") {
        return fallback;
      }

      return formatter ? formatter(value) : value;
    };

    // Helper to get firstName/lastName from contribution or user.name
    const getFirstName = () => {
      if (contribution?.firstName) return contribution.firstName;
      if (user?.name) {
        const parts = user.name.trim().split(/\s+/).filter(Boolean);
        return parts[0] || "";
      }
      return "";
    };
    
    const getLastName = () => {
      if (contribution?.lastName) return contribution.lastName;
      if (user?.name) {
        const parts = user.name.trim().split(/\s+/).filter(Boolean);
        return parts.length > 1 ? parts.slice(1).join(" ") : "";
      }
      return "";
    };

    const personal = [
      { label: "First Name", value: withFallback(getFirstName(), "Add your first name") },
      { label: "Last Name", value: withFallback(getLastName(), "Add your last name") },
      {
        label: "Email",
        value: withFallback(contribution?.email, profile.email),
      },
      { label: "Phone", value: withFallback(contribution?.phone, "Add your contact number") },
      {
        label: "Gender",
        value: withFallback(contribution?.gender, "Select your gender", toFriendlyText),
      },
    ];

    const spiritual = [
      {
        label: "Gayatri Pariwar Journey",
        value: withFallback(
          contribution?.gayatriPariwarDuration,
          "Share your duration with the mission",
          toFriendlyText
        ),
      },
      {
        label: "Akhand Jyoti Member",
        value: withFallback(
          contribution?.akhandJyotiMember,
          "Let us know if you receive the magazine",
          toFriendlyText
        ),
      },
      {
        label: "Guru Diksha",
        value: withFallback(contribution?.guruDiksha, "Share whether you have taken Guru Diksha", toFriendlyText),
      },
      {
        label: "Mission Books Read",
        value: withFallback(
          contribution?.missionBooksRead,
          "Tell us how many mission books you have explored"
        ),
      },
    ];

    const research = [
      {
        label: "Research Categories",
        value: withFallback(
          contribution?.researchCategories,
          "Select the categories you wish to support",
          formatResearchCategories
        ),
      },
    ];

    const contributionSection = [
      {
        label: "Weekly Commitment",
        value: withFallback(
          contribution?.hoursPerWeek,
          "Pick the hours you can dedicate each week",
          formatHoursPerWeek
        ),
      },
    ];

    return {
      personal,
      spiritual,
      research,
      contribution: contributionSection,
    };
  }, [contribution, profile.email, user?.name]);

  // Helper function to split name into firstName and lastName
  const splitName = (fullName) => {
    if (!fullName || typeof fullName !== 'string') {
      return { firstName: "", lastName: "" };
    }
    const trimmed = fullName.trim();
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return { firstName: "", lastName: "" };
    }
    if (parts.length === 1) {
      return { firstName: parts[0], lastName: "" };
    }
    // Take first part as firstName, rest as lastName
    const firstName = parts[0];
    const lastName = parts.slice(1).join(" ");
    return { firstName, lastName };
  };

  const handleEditPersonal = () => {
    // Get firstName/lastName from contribution or fallback to user.name
    let firstName = "";
    let lastName = "";
    
    // First try to get from contribution
    if (contribution?.firstName) {
      firstName = contribution.firstName;
    }
    if (contribution?.lastName) {
      lastName = contribution.lastName;
    }
    
    // If still empty, try to get from user.name
    if ((!firstName || !lastName) && user?.name && user.name.trim()) {
      const nameParts = splitName(user.name);
      if (!firstName) firstName = nameParts.firstName || "";
      if (!lastName) lastName = nameParts.lastName || "";
    }
    
    setEditFormData({
      firstName: firstName || "",
      lastName: lastName || "",
      email: contribution?.email || user?.email || "",
      phone: contribution?.phone || "",
      gender: contribution?.gender || "",
    });
    setEditingSection("personal");
    setSaveError(null);
  };

  const handleEditSpiritual = () => {
    if (!contribution) {
      setSaveError("Please submit a contribution form first.");
      return;
    }
    setEditFormData({
      gayatriPariwarDuration: contribution.gayatriPariwarDuration || "",
      akhandJyotiMember: contribution.akhandJyotiMember || "",
      guruDiksha: contribution.guruDiksha || "",
      missionBooksRead: contribution.missionBooksRead || "",
    });
    setEditingSection("spiritual");
    setSaveError(null);
  };

  const handleEditResearch = () => {
    if (!contribution) {
      setSaveError("Please submit a contribution form first.");
      return;
    }
    setEditFormData({
      researchCategories: contribution.researchCategories || [],
    });
    setEditingSection("research");
    setSaveError(null);
  };

  const handleEditContribution = () => {
    if (!contribution) {
      setSaveError("Please submit a contribution form first.");
      return;
    }
    setEditFormData({
      hoursPerWeek: contribution.hoursPerWeek || "",
    });
    setEditingSection("contribution");
    setSaveError(null);
  };

  const handleSaveEdit = async () => {
    if (!token || !contribution) {
      return;
    }

    // Validate research categories if editing research section
    if (editingSection === "research") {
      if (!Array.isArray(editFormData.researchCategories) || editFormData.researchCategories.length < 3) {
        setSaveError("Please select at least three research categories.");
        return;
      }
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch(getApiUrl("/contributions/me"), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Unable to update profile.");
      }

      setContribution(data?.contribution || null);
      setEditingSection(null);
      setEditFormData({});
    } catch (error) {
      console.error("Failed to update profile:", error);
      setSaveError(error.message || "Unable to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleResearchCategory = (category) => {
    setEditFormData((prev) => {
      const isSelected = (prev.researchCategories || []).includes(category);
      const nextCategories = isSelected
        ? (prev.researchCategories || []).filter((c) => c !== category)
        : [...(prev.researchCategories || []), category];

      return {
        ...prev,
        researchCategories: nextCategories,
      };
    });
  };

  const handleDeleteAccount = async () => {
    if (!token) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(getApiUrl("/auth/account"), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Unable to delete account.");
      }

      // Logout and redirect to home
      logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to delete account:", error);
      setDeleteError(error.message || "Unable to delete account.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Edit Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setEditingSection(null);
              setEditFormData({});
              setSaveError(null);
            }}
          ></div>
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">
                {editingSection === "personal"
                  ? "Edit Personal Information"
                  : editingSection === "spiritual"
                  ? "Edit Spiritual Connection"
                  : editingSection === "research"
                  ? "Edit Research Interests"
                  : "Edit Contribution Commitment"}
              </h3>
              <button
                onClick={() => {
                  setEditingSection(null);
                  setEditFormData({});
                  setSaveError(null);
                }}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {saveError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {saveError}
                </div>
              )}

              {editingSection === "personal" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={editFormData.firstName || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={editFormData.lastName || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editFormData.phone || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={editFormData.gender || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>
              )}

              {editingSection === "spiritual" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Gayatri Pariwar Journey</label>
                    <select
                      name="gayatriPariwarDuration"
                      value={editFormData.gayatriPariwarDuration || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="">Select Duration</option>
                      <option value="less-than-1">Less than 1 year</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="more-than-10">More than 10 years</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Akhand Jyoti Member</label>
                    <select
                      name="akhandJyotiMember"
                      value={editFormData.akhandJyotiMember || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="">Select Option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Guru Diksha</label>
                    <select
                      name="guruDiksha"
                      value={editFormData.guruDiksha || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="">Select Option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Mission Books Read</label>
                    <select
                      name="missionBooksRead"
                      value={editFormData.missionBooksRead || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="">Select Option</option>
                      {[...Array(10)].map((_, idx) => (
                        <option key={idx} value={`${idx + 1}`}>
                          {idx + 1}
                        </option>
                      ))}
                      <option value="10+">10+</option>
                    </select>
                  </div>
                </div>
              )}

              {editingSection === "research" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Research Categories <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      Select at least three categories that reflect your interests and experience.
                    </p>
                    <div className="grid md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                      {researchCategoryOptions.map((category) => (
                        <label
                          key={category.value}
                          className="flex items-start gap-3 bg-slate-50 border-2 border-slate-200 rounded-lg px-4 py-3 cursor-pointer hover:bg-slate-100 transition"
                        >
                          <input
                            type="checkbox"
                            checked={(editFormData.researchCategories || []).includes(category.value)}
                            onChange={() => toggleResearchCategory(category.value)}
                            className="mt-1 w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-700">{category.label}</span>
                        </label>
                      ))}
                    </div>
                    {(editFormData.researchCategories || []).length < 3 && (
                      <p className="text-xs text-red-600 mt-2">
                        Please select at least 3 research categories.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {editingSection === "contribution" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Weekly Commitment <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="hoursPerWeek"
                      value={editFormData.hoursPerWeek || ""}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                    >
                      <option value="">Select Hours</option>
                      <option value="1-5">1-5 hours / week</option>
                      <option value="5-10">5-10 hours / week</option>
                      <option value="10-15">10-15 hours / week</option>
                      <option value="15-20">15-20 hours / week</option>
                      <option value="20+">20+ hours / week</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingSection(null);
                    setEditFormData({});
                    setSaveError(null);
                  }}
                  className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 py-12 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
        {/* Profile hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 text-white shadow-2xl">
          <div className="absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_top,_#ffffff0d,_#00000080)]" />
          <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            <div className="flex items-start gap-6">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 via-indigo-400 to-purple-500 text-3xl font-semibold shadow-2xl ring-4 ring-white/20">
                  {profile.initials}
                </div>
                <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white backdrop-blur-sm">
                  Core Member
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  {profile.displayName}
                </h1>
                <p className="text-sm uppercase tracking-[0.35em] text-white/60">
                  Brahmarishi Vishwamitra Research Center
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/80">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
                      />
                    </svg>
                    {profile.email}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    Member since {profile.joinedAt}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
          {[
            {
              label: "Number of Research Contribution",
              value: "0",
              change: "+0 today",
              accent: "from-blue-500/10 via-blue-500/5 to-blue-500/0",
            },
            {
              label: "Volunteer Tier",
              value: "Volunteer",
              change: "Complete profile to level up",
              accent: "from-emerald-500/10 via-emerald-500/5 to-emerald-500/0",
            },
          ].map((card) => (
            <div
              key={card.label}
              className={`relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.accent}`} />
              <div className="relative flex flex-col gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  {card.label}
                </p>
                <p className="text-3xl font-semibold text-slate-900">{card.value}</p>
                <p className="text-xs font-medium text-slate-500">{card.change}</p>
              </div>
            </div>
          ))}
        </section>

        {contributionError && (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
            {contributionError}
          </div>
        )}

        {loadingContribution && isAuthenticated && !contribution && (
          <div className="rounded-3xl border border-blue-200 bg-blue-50 px-6 py-4 text-sm text-blue-700">
            Loading your contribution profile...
          </div>
        )}

        {/* Profile information */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Personal Information</h2>
                <p className="text-sm text-slate-500">
                  Mirror your contribution form so the team knows exactly who you are.
                </p>
              </div>
              <button
                onClick={handleEditPersonal}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Update
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652l-9.193 9.193a4.5 4.5 0 01-1.897 1.13L6 17l.526-4.111a4.5 4.5 0 011.13-1.897l9.206-9.205z"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {contributionProfile.personal.map((field) => (
                <div key={field.label}>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    {field.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-700">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Spiritual Connection</h2>
                <p className="text-sm text-slate-500">
                  Share your journey with Gayatri Pariwar to personalise seva guidance.
                </p>
              </div>
              <button
                onClick={handleEditSpiritual}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Update
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652l-9.193 9.193a4.5 4.5 0 01-1.897 1.13L6 17l.526-4.111a4.5 4.5 0 011.13-1.897l9.206-9.205z"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {contributionProfile.spiritual.map((field) => (
                <div key={field.label}>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    {field.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-700">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Research Interests</h2>
                <p className="text-sm text-slate-500">
                  Align your expertise with the research tracks on the contribution form.
                </p>
              </div>
              <button
                onClick={handleEditResearch}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Update
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652l-9.193 9.193a4.5 4.5 0 01-1.897 1.13L6 17l.526-4.111a4.5 4.5 0 011.13-1.897l9.206-9.205z"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {contributionProfile.research.map((field) => (
                <div key={field.label} className="sm:col-span-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    {field.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-700">{field.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Contribution Commitment</h2>
                <p className="text-sm text-slate-500">
                  Let coordinators know how many hours you’re ready to dedicate each week.
                </p>
              </div>
              <button
                onClick={handleEditContribution}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Update
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652l-9.193 9.193a4.5 4.5 0 01-1.897 1.13L6 17l.526-4.111a4.5 4.5 0 011.13-1.897l9.206-9.205z"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6">
              {contributionProfile.contribution.map((field) => (
                <div key={field.label}>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    {field.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-700">{field.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Delete Account Button */}
        <div className="flex justify-center py-8">
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => {
              setShowDeleteConfirm(false);
              setDeleteError(null);
            }}
          ></div>
          <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 text-center mb-2">
                Delete Account?
              </h3>
              <p className="text-sm text-slate-600 text-center mb-6">
                Are you sure you want to delete your account? This action cannot be undone and will
                permanently delete your account credentials. Your contribution data will be preserved.
              </p>
              <ul className="text-sm text-slate-600 mb-6 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="text-red-600">•</span>
                  Your account credentials will be deleted
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">•</span>
                  Your contribution profile will be preserved
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">•</span>
                  Your contribution history will be preserved
                </li>
              </ul>

              {deleteError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {deleteError}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteError(null);
                  }}
                  className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
