import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Dash News',
  description: 'The terms and conditions for using Dash News.',
};

export default function TermsAndConditionsPage() {
  return (
    <main className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className=" text-xl md:text-3xl font-bold font-heading mb-4">Terms & Conditions</h1>
      <div className="max-w-none">
        <p className='text-sm mb-4'>Please read these terms and conditions carefully before using our service.</p>
        <h2 className='text-xl md:text-3xl font-bold mb-2'>1. Agreement to Terms</h2>
        <p className='text-sm mb-2'>
          By accessing or using our website, you agree to be bound by these terms. If you
          disagree with any part of the terms, then you may not access the service.
        </p>
        {/* Add more placeholder content as needed */}
      </div>
    </main>
  );
}