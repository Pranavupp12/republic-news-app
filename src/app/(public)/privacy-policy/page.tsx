import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Dash News',
  description: 'Our privacy policy details how we handle your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="container mx-auto py-10 px-10 md:px-4 max-w-4xl">
      <h1 className="text-xl md:text-3xl font-bold font-heading mb-4">Privacy Policy</h1>
      <div className="max-w-none">
        <p className='text-sm mb-2'><span className='font-bold'>Last updated</span> : September 19, 2025</p>
        <p className='text-sm mb-4'>
          Your privacy is important to us. It is Dash News&apos;s policy to respect your privacy
          regarding any information we may collect from you across our website.
        </p>
        <h1 className="text-xl md:text-3xl font-bold mb-4">1. Information We Collect</h1>
        <p className='text-sm'>
          We only ask for personal information when we truly need it to provide a service to you.
          We collect it by fair and lawful means, with your knowledge and consent. We also let
          you know why we are collecting it and how it will be used.
        </p>
        {/* Add more placeholder content as needed */}
      </div>
    </main>
  );
}