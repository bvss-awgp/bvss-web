import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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

const Profile = () => {
  const { user } = useAuth();

  const profile = useMemo(() => {
    const email = user?.email || "Member@bvss.org";
    const handle = email.split("@")[0];
    const initials = getInitials(email);
    const joinedAt = formatDate(user?.createdAt);

    return {
      email,
      handle,
      initials,
      joinedAt,
    };
  }, [user]);

  const contributionProfile = useMemo(
    () => ({
      personal: [
        { label: "First Name", value: "Add your first name" },
        { label: "Last Name", value: "Add your last name" },
        { label: "Email", value: profile.email },
        { label: "Phone", value: "Add your contact number" },
        { label: "Gender", value: "Select your gender" },
      ],
      spiritual: [
        { label: "Gayatri Pariwar Journey", value: "Share your duration with the mission" },
        { label: "Akhand Jyoti Member", value: "Let us know if you receive the magazine" },
        { label: "Guru Diksha", value: "Share whether you have taken Guru Diksha" },
        { label: "Mission Books Read", value: "Tell us how many mission books you have explored" },
      ],
      research: [
        { label: "Research Category", value: "Choose the area you wish to contribute" },
        { label: "Research Topic", value: "Select a focus topic or propose your own" },
        { label: "Custom Interest", value: "Describe any other topic you want to pursue" },
      ],
      contribution: [
        { label: "Weekly Commitment", value: "Pick the hours you can dedicate each week" },
      ],
    }),
    [profile.email]
  );

  return (
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
                  {profile.handle}
                </h1>
                <p className="text-sm uppercase tracking-[0.35em] text-white/60">
                  Brahmavarchas Shodh Sansthan
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

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/contribute"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:border-white hover:bg-white/10"
              >
                Volunteer Hub
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
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
              <button className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold uppercase tracking-wide text-slate-900 transition hover:bg-slate-100">
                Edit Profile
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
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652l-9.193 9.193a4.5 4.5 0 01-1.897 1.13L6 17l.526-4.111a4.5 4.5 0 011.13-1.897l9.206-9.205z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19.5 7.125L16.862 4.487"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Quick stats */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Contribution Hours",
              value: "0",
              change: "+0 today",
              accent: "from-blue-500/10 via-blue-500/5 to-blue-500/0",
            },
            {
              label: "Community Circles",
              value: "0",
              change: "Coming soon",
              accent: "from-purple-500/10 via-purple-500/5 to-purple-500/0",
            },
            {
              label: "Volunteer Tier",
              value: "Seeker",
              change: "Complete profile to level up",
              accent: "from-emerald-500/10 via-emerald-500/5 to-emerald-500/0",
            },
            {
              label: "Completion",
              value: "35%",
              change: "Add details to reach 100%",
              accent: "from-amber-500/10 via-amber-500/5 to-amber-500/0",
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
              <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
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
              <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
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
              <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
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
              <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50">
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
      </div>
    </div>
  );
};

export default Profile;
