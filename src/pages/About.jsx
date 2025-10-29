import React from "react";

const About = () => {
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative flex items-center justify-center h-[60vh] bg-cover bg-center rounded-b-3xl overflow-hidden"
        style={{ backgroundImage: "url('/Herosection.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl font-extrabold mb-4">About Us</h1>
          <p className="text-lg max-w-xl mx-auto">
            Bridging the gap between science and spiritual awakening through research and education.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
{/* Mission & Vision */}
<section className="py-16 px-6 text-center max-w-5xl mx-auto">
  <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Mission & Vision</h2>
  <div className="grid md:grid-cols-2 gap-12">
    {/* Mission with YouTube Video */}
    <div className="bg-white shadow-lg rounded-xl p-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Mission</h3>
      <p className="text-gray-600 mb-4">
        To explore the mysteries of consciousness and integrate spiritual practices with modern science for holistic growth.
      </p>
      {/* Embedded YouTube Video */}
      <div className="relative" style={{ paddingTop: "56.25%" /* 16:9 Aspect Ratio */ }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src="https://www.youtube.com/embed/gxqQvPuKNUU?si=HwUmLfuozdaH20r8" // replace with your video URL
          title="Mission Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>

    {/* Vision */}
    <div className="bg-white shadow-lg rounded-xl p-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Vision</h3>
      <p className="text-gray-600">
        To create a world where knowledge, logic, and consciousness coexist harmoniously to empower individuals and communities.
      </p>
    </div>
  </div>
</section>


      {/* About AWGp Section */}
      <section className="py-16 px-6 bg-gray-100 text-center max-w-5xl mx-auto rounded-xl mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">About AWGP</h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-6">
          All World Gayatri Pariwar (AWGP) is a global spiritual and social organization dedicated to promoting human values, self-transformation, and scientific spirituality. It combines ancient wisdom with modern understanding to empower individuals and communities.
        </p>
        <img
          src="https://play-lh.googleusercontent.com/KL4RaeG0P-Z29pn3pqhq3ZMfoR0_nkdfLnlpmEsVw42woWTtT_CfT5JA2_musl2e02XJ"
          alt="AWGp"
          className="mx-auto rounded-lg shadow-md w-50 h-full object-cover"
        />
      </section>

      {/* Our Approach */}
      <section className="py-16 px-6 text-center bg-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Approach</h2>
        <p className="max-w-3xl mx-auto text-gray-600 mb-12">
          We combine scientific research, spiritual practices, and community engagement to create meaningful and lasting impact. Our methods are rooted in tradition but guided by modern insights.
        </p>
        <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: "🔬", title: "Scientific Research", desc: "We conduct rigorous studies to explore spiritual phenomena and their impact on human well-being." },
            { icon: "🕉️", title: "Spiritual Practices", desc: "Integrating time-tested practices like Yagya, meditation, and self-refinement for holistic growth." },
            { icon: "🌱", title: "Community Engagement", desc: "Empowering communities with knowledge, workshops, and outreach programs." },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <div className="text-5xl mb-4">{item.icon}</div>
              <h3 className="font-semibold text-gray-800 text-lg mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-12">Meet Our Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            { name: "Mr. Vivek Bhagel", role: "Founder & Research Lead", image: "/About/vivek.jpg" },
            { name: "Mr Suyash Soni", role: "Software Engineer & Manager", image: "/About/suyash.jpg" },
            { name: "Prof. Jagriti Kawde", role: "Research Assistant", image: "/About/jagriti.jpg" },
            { name: "Dr Vaidehi Puri", role: "Research Assistant", image: "/About/vaidehi.jpg" },
            { name: "Mrs Prachi Pawar", role: "Research Assistant / Content and Reach", image: "/About/prachi.jpg" },
          ].map((member, idx) => (
            <div key={idx} className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-65 object-cover"
              />
              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-800">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values / Philosophy */}
      <section className="py-16 px-6 text-center max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Core Values</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { title: "Integrity", desc: "We uphold honesty and transparency in all our research." },
            { title: "Innovation", desc: "Exploring new ideas at the intersection of science and spirituality." },
            { title: "Community", desc: "Building knowledge that empowers and serves humanity." },
            { title: "Excellence", desc: "Striving for the highest quality in research and education." },
          ].map((value, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
              <h3 className="font-semibold text-gray-800 text-lg mb-2">{value.title}</h3>
              <p className="text-gray-600 text-sm">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 text-center bg-blue-600 rounded-t-3xl">
        <h2 className="text-3xl font-bold text-white mb-4">Join Us on This Journey</h2>
        <p className="text-white mb-6">
          Explore our research, attend workshops, and engage with our community to awaken your potential.
        </p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
          Get Involved
        </button>
      </section>
    </div>
  );
};

export default About;
