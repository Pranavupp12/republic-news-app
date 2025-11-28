import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Dash News',
  description: 'The terms and conditions for using Dash News.',
};

export default function TermsAndConditionsPage() {
  return (
    <main className="container mx-auto py-10 px-4 max-w-5xl">
      <h1 className="text-3xl md:text-4xl font-bold font-heading mb-2">Terms & Conditions</h1>
      <p className="text-sm text-muted-foreground mb-8">Last Updated: 24 NOV 2025</p>

      <div className="max-w-none space-y-8">
        
        <section>
          <h2 className="text-xl font-bold mb-3">1. Acceptance of Terms</h2>
          <p className="text-sm leading-relaxed">
            By using our services, YOU AGREE TO BE BOUND BY THE TERMS OF THIS PRIVACY POLICY, INCLUDING
            THE CLASS ACTION WAIVER PROVISIONS BELOW. If you do not agree to this Privacy Policy, you may not
            use the Services. Any unauthorized use of the Services will be subject to this Privacy Policy.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">2. Content Accuracy Notice</h2>
          <p className="text-sm leading-relaxed">
            Our website provides accurate and clear news. While we have Professional duties to keep our
            content accurate and helpful, we cannot guarantee that all information is always complete or
            up to date. We are not legally responsible for any issues, losses, or decisions that result from
            using the information on our site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">3. Reviews & Opinions</h2>
          <p className="text-sm leading-relaxed">
            All reviews, guides, and opinions come from our own experience and research. Your results or
            experiences may not be the same, and that is okay.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">4. Change of terms</h2>
          <p className="text-sm leading-relaxed mb-4">
            We may update this Privacy Policy from time to time. The “Last Updated” date at the top of this
            page indicates when it was last updated. If we make material changes, we will notify you either
            by email to the most recent email address provided to us, through a pop-up window on our
            homepage, or through another method as required. Any changes will become effective on the
            “Last Updated” date indicated above.
          </p>
          <p className="text-sm leading-relaxed">
            Where permitted by applicable law, after we post any changes on this page, your continued use
            of our Services following the posting of changes constitutes your acceptance of such changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">5. Contact Information</h2>
          <p className="text-sm leading-relaxed mb-4">
            If you have any questions about this Privacy Policy, the ways in which we collect and use your
            Personal Information described here, your choices and rights regarding such use, or if you wish
            to exercise your rights, please contact us as provided below.
          </p>
          <p className="text-sm leading-relaxed font-bold">
            PLEASE NOTE: YOU SHOULD ONLY CONTACT US THROUGH OUR PRIVACY SUBMISSION FORM
            FOR PRIVACY-RELATED CONCERNS.
          </p>
        </section>

      </div>
    </main>
  );
}