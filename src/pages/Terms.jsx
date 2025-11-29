import React from "react";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms and Conditions</h1>
          <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Welcome to the Brahmarishi Vishwamitra Research Center (BVSS) website. These Terms and Conditions govern your access to and use of our website, services, and participation in our research programs. By accessing or using our services, you agree to be bound by these terms.
              </p>
              <p className="text-gray-700 leading-relaxed">
                The Brahmarishi Vishwamitra Research Center is a non-profit initiative inspired by the ideals of Akhil Vishwa Gayatri Pariwar, dedicated to bridging ancient wisdom with modern science through research, education, and community engagement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By registering for an account, submitting contributions, or using any of our services, you acknowledge that you have read, understood, and agree to comply with these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. User Accounts and Registration</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To participate in our research programs or access certain features, you may be required to create an account. You agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. Contribution Guidelines</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                When contributing to our research programs, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Contribute authentically and follow the Brahmarishi Vishwamitra Research Center community guidelines</li>
                <li>Provide accurate and truthful information in all submissions</li>
                <li>Respect intellectual property rights and not submit copyrighted material without authorization</li>
                <li>Maintain confidentiality of any sensitive research data as required</li>
                <li>Participate in good faith and in alignment with our mission and values</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of the Brahmarishi Vishwamitra Research Center or its content suppliers and is protected by copyright and other intellectual property laws.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                By submitting contributions, you grant BVSS a non-exclusive, royalty-free, perpetual license to use, modify, and distribute your contributions for research, educational, and promotional purposes, while maintaining appropriate attribution where applicable.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. Prohibited Activities</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Use our services for any unlawful purpose or in violation of any applicable laws</li>
                <li>Submit false, misleading, or fraudulent information</li>
                <li>Interfere with or disrupt the operation of our website or services</li>
                <li>Attempt to gain unauthorized access to any part of our systems</li>
                <li>Use automated systems to access our services without permission</li>
                <li>Harass, abuse, or harm other users or participants</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. Privacy and Data Protection</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your use of our services is also governed by our Privacy Policy. We are committed to protecting your personal information and using it only in accordance with our Privacy Policy and applicable data protection laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that our services will be uninterrupted, secure, or error-free. You use our services at your own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To the maximum extent permitted by law, the Brahmarishi Vishwamitra Research Center shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">10. Termination</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to suspend or terminate your account and access to our services at any time, with or without cause or notice, if you violate these Terms and Conditions or engage in any conduct that we deem harmful to our community or mission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">11. Changes to Terms</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to modify these Terms and Conditions at any time. We will notify users of significant changes by posting the updated terms on our website. Your continued use of our services after such changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">12. Contact Information</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms and Conditions, please contact us at:
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>Email:</strong> bvshodhsansthan@gmail.com<br />
                <strong>Organization:</strong> Brahmarishi Vishwamitra Research Center
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">13. Governing Law</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms and Conditions shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in India.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;

