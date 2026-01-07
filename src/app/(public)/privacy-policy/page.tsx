import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Our privacy policy details how we handle your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto py-10 px-4 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground mb-8">Last Updated: 24 Nov 2025</p>

      <div className="max-w-none space-y-8">
        
        <section>
          <h2 className="text-xl font-bold mb-3">Introduction</h2>
          <p className="text-sm leading-relaxed">
            Republic News, Inc. and our affiliates (collectively, “Republic News”, “we”, “our”, “us”) publish Republic News along with local media brands. Republic News respects your personal data and ensures a safe online experience for you. This privacy statement describes how we collect, use, and protect the data. You acknowledge that you have read and consent to be bound by the practices described in this privacy policy by using it. If you disagree with our policy, we respectfully ask that you stop using our website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Information We Collect</h2>
          <h3 className="text-lg font-semibold mb-2">Personal Information</h3>
          <p className="text-sm leading-relaxed">
            We collect the data that you provide to us. The types of data you mainly provided are your name, email address, phone number, and information provided through the contact form and newsletter sign-up.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">How We Use Your Information</h2>
          <p className="text-sm leading-relaxed">
            We collect and use the information you provide to deliver a personalized and enhanced experience on our website. This may include sending you updates, newsletters, promotional materials, and other communications related to our products, services, or industry news. We may also use your information to inform you about important changes, offers, or events that may be relevant to you. Your information will be handled with care and used solely for the purposes outlined, in accordance with applicable data protection laws. We do not sell or share your personal information with third parties for their marketing purposes without your consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Your Rights</h2>
          <p className="text-sm leading-relaxed">
            Republic News is an informative website. That’s why we collect only some data, which is read to you in our “Information We Collect” section. Because of this, we do not claim any additional rights over your personal information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Email & Newsletter</h2>
          <p className="text-sm leading-relaxed mb-4">
            Stay connected with the latest updates from Republicnews. By subscribing to our email list, you will receive our news updates in your inbox. If you don’t want to miss any important news updates, make sure to subscribe to our blog.
          </p>
          <p className="text-sm leading-relaxed">
            We share the latest stories, quick updates, and important information straight to your inbox. Click Subscribe and stay informed every day!
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Children’s Privacy</h2>
          <p className="text-sm leading-relaxed">
            We do not knowingly collect data from individuals under 13 years of age. If we discover that such information were collected, we would delete it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Overview</h2>
          <p className="text-sm leading-relaxed">
            This Privacy Policy explains what Personal Information we are collecting and processing, how and why we are processing it, and how you may request deletion of your Personal Information and exercise other rights you may have.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Changes to This Privacy Policy</h2>
          <p className="text-sm leading-relaxed">
            We reserve the right to update this privacy policy at any time. By continuing to use our services, you accept the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Contact Us</h2>
          <p className="text-sm leading-relaxed">
            If you have questions, contact us at:
          </p>
          <ul className="list-none mt-2 text-sm space-y-1">
            <li>📧 Email:support@republicnews.us</li>
          </ul>
        </section>

      </div>
    </main>
  );
}