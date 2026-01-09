import React, { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const ResearchDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [slug]);

  // Research data mapping
  const researchData = {
    "mantr-chikitsa": {
      image: "/HeroSection.jpg",
      icon: "🧠",
      title: "Mantr Chikitsa",
      description: "Research on Mantr Chikitsa for mental health, and well-being in Teenagers.",
      pdfPath: "/Gayatri_Mantra_Research.pdf",
      fullDescription: `Mantr Chikitsa represents a groundbreaking research initiative focused on exploring the therapeutic potential of traditional mantras for mental health and well-being, particularly among teenagers. This research combines ancient wisdom with modern scientific methodologies to understand how mantra-based interventions can support emotional regulation, stress reduction, and overall psychological wellness.

Our research team is investigating the physiological and psychological effects of mantra chanting, examining its impact on brain activity, stress hormones, and mental health outcomes. Through carefully designed studies, we aim to provide evidence-based insights into how these traditional practices can be integrated into contemporary mental health interventions.

The research involves collaboration with mental health professionals, neuroscientists, and traditional practitioners to ensure a holistic and rigorous approach. We are particularly interested in understanding how mantra-based practices can help teenagers navigate the challenges of adolescence, including academic stress, social pressures, and emotional development.`,
      keyFindings: [
        "Exploration of mantra-based interventions for adolescent mental health",
        "Integration of traditional practices with modern scientific research",
        "Collaboration with multidisciplinary teams of experts",
        "Focus on evidence-based outcomes and measurable impacts"
      ],
      status: "Ongoing"
    },
    "ayurvedic-research-for-public-health": {
      image: "https://images.unsplash.com/photo-1492552085122-36706c238263?q=80&w=2097&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      icon: "🌾",
      title: "Ayurvedic Research for public health",
      description: "Studies on Ayurvedic remedies for public health.",
      pdfPath: "/Ayurvedic_Research.pdf",
      fullDescription: `Our Ayurvedic Research for Public Health initiative focuses on scientifically validating traditional Ayurvedic remedies and practices for contemporary public health challenges. This comprehensive research program aims to bridge the gap between ancient wisdom and modern healthcare needs.

The research encompasses various aspects of Ayurveda, including herbal medicine, dietary interventions, lifestyle modifications, and preventive healthcare practices. We are conducting rigorous clinical studies and laboratory research to understand the efficacy, safety, and mechanisms of action of various Ayurvedic interventions.

Our team works closely with Ayurvedic practitioners, pharmacologists, and public health experts to ensure that our research adheres to both traditional principles and modern scientific standards. The goal is to contribute to evidence-based healthcare solutions that are accessible, affordable, and culturally appropriate for diverse populations.`,
      keyFindings: [
        "Scientific validation of traditional Ayurvedic practices",
        "Clinical studies on efficacy and safety of herbal remedies",
        "Integration of Ayurvedic principles in public health programs",
        "Development of evidence-based healthcare solutions"
      ],
      status: "Ongoing"
    },
    "waste-management-and-recycling": {
      image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      icon: "📚",
      title: "Waste management and recycling",
      description: "Studies on waste management and recycling.",
      pdfPath: "/Waste_Management_Research.pdf",
      fullDescription: `The Waste Management and Recycling research project addresses one of the most pressing environmental challenges of our time. Our research focuses on developing innovative solutions for effective waste management, recycling processes, and sustainable resource utilization.

We are investigating various aspects of waste management, including waste segregation techniques, recycling technologies, composting methods, and circular economy models. The research aims to identify best practices that can be implemented at both community and industrial levels to reduce environmental impact and promote sustainability.

Our team collaborates with environmental scientists, engineers, urban planners, and community organizations to develop comprehensive waste management strategies. We are particularly interested in understanding behavioral factors that influence waste management practices and developing interventions that can promote more sustainable habits among individuals and communities.`,
      keyFindings: [
        "Development of innovative waste segregation and recycling techniques",
        "Community-based waste management models",
        "Behavioral interventions for sustainable waste practices",
        "Circular economy approaches to resource utilization"
      ],
      status: "Ongoing"
    }
  };

  const research = researchData[slug];

  if (!research) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Research Not Found</h1>
          <p className="text-gray-600 mb-8">The research you're looking for doesn't exist.</p>
          <Link
            to="/research-work"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Research Work
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center h-[50vh] bg-cover bg-center pt-16 overflow-hidden"
        style={{ backgroundImage: `url('${research.image}')` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 text-center text-white px-6">
          <div className="text-6xl mb-4">{research.icon}</div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4">
            {research.title}
          </h1>
          <p className="text-lg sm:text-xl max-w-2xl mx-auto opacity-90">
            {research.description}
          </p>
        </div>
      </section>

      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
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
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Research Work
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Status Badge */}
        <div className="mb-8">
          <span className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
            Status: {research.status}
          </span>
        </div>

        {/* Full Description */}
        <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-12 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About This Research</h2>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {research.fullDescription}
          </div>
        </section>

        {/* Key Findings */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 sm:p-8 md:p-12 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Key Research Areas</h2>
          <ul className="space-y-4">
            {research.keyFindings.map((finding, idx) => (
              <li key={idx} className="flex items-start">
                <svg
                  className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-gray-700 text-lg">{finding}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* PDF Section */}
        {research.pdfPath && (
          <section className="bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-12 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Research Document</h2>
              <a
                href={research.pdfPath}
                download
                className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-md hover:shadow-lg"
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
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download PDF
              </a>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-100">
              <iframe
                src={`${research.pdfPath}#toolbar=0`}
                className="w-full h-[600px] sm:h-[700px] md:h-[800px]"
                title={`${research.title} PDF`}
                style={{ border: 'none' }}
              >
                <p className="p-4 text-gray-600">
                  Your browser does not support PDFs.{" "}
                  <a
                    href={research.pdfPath}
                    download
                    className="text-blue-600 hover:underline"
                  >
                    Download the PDF instead
                  </a>
                  .
                </p>
              </iframe>
            </div>
          </section>
        )}

      
      </div>
    </div>
  );
};

export default ResearchDetail;

