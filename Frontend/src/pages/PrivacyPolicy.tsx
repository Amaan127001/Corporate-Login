import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        We respect your privacy. This app uses Google OAuth to authenticate users. We do not store passwords or access your private data without your permission.
      </p>
      <p className="mb-4">
        Your basic profile information (name, email, profile picture) may be temporarily used to personalize your experience.
      </p>
      <p>
        If you have any questions about this Privacy Policy, contact us at: <strong>support@example.com</strong>
      </p>
    </div>
  );
};

export default PrivacyPolicy;
