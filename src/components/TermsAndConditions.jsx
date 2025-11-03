import React from 'react';
import './LegalDocument.css';

const TermsAndConditions = ({ onClose }) => {
  return (
    <div className="legal-overlay">
      <div className="legal-document">
        <div className="legal-header">
          <h2>Terms and Conditions</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="legal-content">
          <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h3>1. Acceptance of Terms</h3>
            <p>By accessing or using the Habal platform, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, you may not use our services.</p>
          </section>

          <section>
            <h3>2. Service Description</h3>
            <p>Habal is a local ride-hailing platform that connects passengers (citizens) with drivers. The platform facilitates transportation services but does not provide transportation services directly.</p>
          </section>

          <section>
            <h3>3. User Eligibility</h3>
            <p>To use Habal, you must:</p>
            <ul>
              <li>Be at least 18 years of age</li>
              <li>Provide accurate and complete registration information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Have legal capacity to enter into binding contracts</li>
            </ul>
          </section>

          <section>
            <h3>4. User Conduct and Responsibilities</h3>
            <p>Users agree to:</p>
            <ul>
              <li>Provide truthful and accurate information</li>
              <li>Use the service only for lawful purposes</li>
              <li>Treat all users with respect and courtesy</li>
              <li>Not create fake bookings or accounts</li>
              <li>Not engage in fraudulent activities</li>
              <li>Comply with all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h3>5. Driver Requirements</h3>
            <p>Drivers must:</p>
            <ul>
              <li>Possess a valid driver's license</li>
              <li>Maintain valid vehicle registration and insurance</li>
              <li>Provide accurate vehicle information</li>
              <li>Comply with all traffic laws and regulations</li>
              <li>Maintain their vehicle in safe operating condition</li>
            </ul>
          </section>

          <section>
            <h3>6. Data Collection and Monitoring</h3>
            <p><strong>Important Notice:</strong> By using Habal, you consent to:</p>
            <ul>
              <li>Real-time collection of your location data</li>
              <li>Collection of device information (browser, OS, device identifiers)</li>
              <li>Monitoring of your activities on the platform</li>
              <li>Recording of ride details and communications</li>
            </ul>
            <p>This information is collected for safety, security, fraud prevention, and service improvement purposes.</p>
          </section>

          <section>
            <h3>7. Safety and Security</h3>
            <p>Habal implements security measures including:</p>
            <ul>
              <li>Device fingerprinting to prevent fake accounts</li>
              <li>Real-time location tracking for safety</li>
              <li>User verification processes</li>
              <li>Incident reporting and investigation</li>
            </ul>
          </section>

          <section>
            <h3>8. Prohibited Activities</h3>
            <p>The following activities are strictly prohibited:</p>
            <ul>
              <li>Creating fake bookings or canceling repeatedly</li>
              <li>Using false or misleading information</li>
              <li>Harassment or threatening behavior</li>
              <li>Attempting to circumvent security measures</li>
              <li>Using the platform for illegal activities</li>
              <li>Discriminatory behavior based on race, religion, gender, or other protected characteristics</li>
            </ul>
          </section>

          <section>
            <h3>9. Consequences of Violation</h3>
            <p><strong>Warning:</strong> Violation of these terms may result in:</p>
            <ul>
              <li><strong>Immediate account suspension or permanent ban</strong></li>
              <li><strong>Legal action and criminal prosecution</strong></li>
              <li><strong>Reporting to law enforcement authorities</strong></li>
              <li><strong>Financial liability for damages caused</strong></li>
              <li><strong>Collection and use of your device and location data as evidence</strong></li>
            </ul>
            <p>We maintain comprehensive logs and reserve the right to cooperate fully with law enforcement investigations.</p>
          </section>

          <section>
            <h3>10. Payment Terms</h3>
            <p>Users agree to pay all fees and charges associated with rides. Fare calculations are based on distance and may be subject to surge pricing during high-demand periods.</p>
          </section>

          <section>
            <h3>11. Liability and Disclaimers</h3>
            <p>Habal is a platform connecting users and is not liable for:</p>
            <ul>
              <li>Acts or omissions of drivers or passengers</li>
              <li>Damage to property or personal injury during rides</li>
              <li>Service interruptions or technical issues</li>
            </ul>
            <p>Use of the service is at your own risk.</p>
          </section>

          <section>
            <h3>12. Dispute Resolution</h3>
            <p>Disputes should first be reported through the app. Unresolved disputes may be subject to arbitration or legal proceedings as per local laws.</p>
          </section>

          <section>
            <h3>13. Account Termination</h3>
            <p>We reserve the right to suspend or terminate accounts at our discretion for violation of these terms or for any reason we deem necessary to protect the platform and its users.</p>
          </section>

          <section>
            <h3>14. Changes to Terms</h3>
            <p>We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.</p>
          </section>

          <section>
            <h3>15. Governing Law</h3>
            <p>These terms are governed by local laws and regulations. By using Habal, you submit to the jurisdiction of local courts.</p>
          </section>

          <section>
            <h3>16. Contact Information</h3>
            <p>For questions about these terms, please contact us through the app or our official support channels.</p>
          </section>
        </div>
        <div className="legal-footer">
          <button className="btn-primary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
