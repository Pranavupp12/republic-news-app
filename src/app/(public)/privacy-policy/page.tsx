import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Our privacy policy details how we handle your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto py-10 px-4 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-4">Last Updated: 24 November 2025</p>

      <div className="max-w-none space-y-8">
        
        <section>
          <p className="text-sm leading-relaxed">
            Republic News, Inc. (together with its affiliates, collectively referred to as “Republic News,” “we,” “our,” or “us”) operates the website https://www.republicnews.us (the “Website”). We are committed to protecting your privacy and ensuring transparency about how we collect, use, and safeguard your information.
          </p>
          <p className="text-sm leading-relaxed mt-4">
            This Privacy Policy explains what information we collect, how we use it, your privacy rights, and how you can contact us with questions or requests. By accessing or using our Website, you agree to the practices described in this Privacy Policy. If you do not agree, please discontinue use of the Website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Information We Collect</h2>
          
          <h3 className="text-lg font-semibold mb-2">1. Personal Information</h3>
          <p className="text-sm leading-relaxed mb-2">
            We collect personal information that you voluntarily provide to us, including:
          </p>
          <ul className="list-disc pl-5 mb-4 text-sm space-y-1">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number (if provided)</li>
            <li>Information submitted through contact forms</li>
            <li>Email address provided for newsletter subscriptions</li>
          </ul>
          <p className="text-sm leading-relaxed mb-4">
            You are not required to provide personal information to browse our Website; however, certain features may not be available without it.
          </p>

          <h3 className="text-lg font-semibold mb-2">2. Non-Personal Information</h3>
          <p className="text-sm leading-relaxed mb-2">
            When you visit Republic News, we may automatically collect certain non-personal information, such as:
          </p>
          <ul className="list-disc pl-5 mb-4 text-sm space-y-1">
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device type</li>
            <li>Pages visited and time spent on pages</li>
            <li>Referring URLs</li>
            <li>Date and time of access</li>
          </ul>
          <p className="text-sm leading-relaxed">
            This information is used for website analytics, security, and performance optimization.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Cookies and Tracking Technologies</h2>
          <p className="text-sm leading-relaxed mb-2">
            Republic News uses cookies and similar tracking technologies to enhance user experience and analyze website traffic. Cookies may be used to:
          </p>
          <ul className="list-disc pl-5 mb-4 text-sm space-y-1">
            <li>Remember user preferences</li>
            <li>Understand how visitors interact with our Website</li>
            <li>Improve content, layout, and performance</li>
          </ul>
          <p className="text-sm leading-relaxed">
            You can choose to disable cookies through your browser settings. Please note that disabling cookies may affect certain features of the Website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">How We Use Your Information</h2>
          <p className="text-sm leading-relaxed mb-2">
            We use the information we collect for the following purposes:
          </p>
          <ul className="list-disc pl-5 mb-4 text-sm space-y-1">
            <li>To operate and maintain the Website</li>
            <li>To deliver news content and updates</li>
            <li>To respond to inquiries and support requests</li>
            <li>To send newsletters and email updates (only if you subscribe)</li>
            <li>To analyze traffic and user behavior</li>
            <li>To improve our services, content quality, and user experience</li>
            <li>To comply with legal obligations</li>
          </ul>
          <p className="text-sm leading-relaxed font-semibold">
            We do not sell your personal information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Third-Party Services</h2>
          <p className="text-sm leading-relaxed mb-2">
            Republic News may use third-party services such as:
          </p>
          <ul className="list-disc pl-5 mb-4 text-sm space-y-1">
            <li>Analytics providers (e.g., Google Analytics)</li>
            <li>Advertising partners</li>
            <li>Email service providers</li>
            <li>Hosting and security services</li>
          </ul>
          <p className="text-sm leading-relaxed">
            These third parties may collect information in accordance with their own privacy policies. Republic News does not control how third parties collect or use data and encourages users to review their respective privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Advertising and Google AdSense</h2>
          <p className="text-sm leading-relaxed">
            Republic News may display advertisements from third-party ad networks, including Google AdSense. These advertisers may use cookies, JavaScript, or web beacons to serve ads based on users’ visits to this and other websites. Users may opt out of personalized advertising by visiting Google’s Ads Settings or through industry opt-out mechanisms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Email Communications and Newsletters</h2>
          <p className="text-sm leading-relaxed">
            If you subscribe to our newsletter, we may send you emails containing news updates, alerts, and relevant information. You may unsubscribe at any time by clicking the “unsubscribe” link included in our emails or by contacting us directly. We do not send unsolicited marketing emails.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Data Retention</h2>
          <p className="text-sm leading-relaxed">
            We retain personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When personal data is no longer needed, it is securely deleted or anonymized.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Data Security</h2>
          <p className="text-sm leading-relaxed">
            We implement reasonable administrative, technical, and physical safeguards to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Your Privacy Rights</h2>
          <p className="text-sm leading-relaxed mb-2">
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul className="list-disc pl-5 mb-4 text-sm space-y-1">
            <li>The right to access the personal data we hold about you</li>
            <li>The right to request correction or deletion of your data</li>
            <li>The right to object to or restrict certain processing activities</li>
          </ul>
          <p className="text-sm leading-relaxed">
            To exercise your rights, please contact us using the details provided below.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">California Privacy Rights (CCPA/CPRA)</h2>
          <p className="text-sm leading-relaxed mb-2">
            If you are a California resident, you have the right to:
          </p>
          <ul className="list-disc pl-5 mb-4 text-sm space-y-1">
            <li>Know what personal information we collect and how it is used</li>
            <li>Request deletion of your personal information</li>
            <li>Opt out of the sale or sharing of personal information (Republic News does not sell personal data)</li>
            <li>Not be discriminated against for exercising your privacy rights</li>
          </ul>
          <p className="text-sm leading-relaxed">
            Requests can be made by contacting us at support@republicnews.us.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Children’s Privacy</h2>
          <p className="text-sm leading-relaxed">
            Republic News does not knowingly collect personal information from children under the age of 13. If we become aware that such information has been collected, we will take steps to delete it promptly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">External Links</h2>
          <p className="text-sm leading-relaxed">
            Our Website may contain links to external websites. Republic News is not responsible for the privacy practices or content of third-party websites. We encourage users to review the privacy policies of any external sites they visit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Changes to This Privacy Policy</h2>
          <p className="text-sm leading-relaxed">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. Continued use of the Website after changes are posted constitutes acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Contact Us</h2>
          <p className="text-sm leading-relaxed">
            If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:
          </p>
          <ul className="list-none mt-2 text-sm space-y-1">
            <li>📧 Email: <a href="mailto:support@republicnews.us" className="text-red-500 hover:underline">support@republicnews.us</a></li>
          </ul>
        </section>

        <p className="text-xs text-muted-foreground pt-4 border-t">
          © 2026 Republic News. All rights reserved.
        </p>

      </div>
    </main>
  );
}