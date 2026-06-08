import Link from "next/link";
import { Leaf, Target, RefreshCw, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-canvas text-body font-sans selection:bg-brand-pink selection:text-white flex flex-col">
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24 w-full mt-16">
        <header className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-7/12 text-center md:text-left">
            <h1 className="text-[56px] md:text-[80px] font-medium text-ink tracking-[-2.5px] leading-none mb-6">
              Track your life&apos;s footprint
              <br />
              in 5 seconds.
            </h1>
            <p className="text-[18px] md:text-[20px] text-muted max-w-xl leading-relaxed mb-10 font-medium mx-auto md:mx-0">
              A playful, lightning-fast tracker for individuals who care about
              the planet. Type what you did naturally, let our AI instantly
              calculate your CO₂ impact, and discover effortless lifestyle
              swaps.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-on-primary font-bold text-[18px] hover:opacity-90 transition-opacity"
              >
                Start Tracking Now &rarr;
              </Link>
            </div>
          </div>
          <div className="md:w-5/12 flex justify-center md:flex relative">
            <div className="w-[400px] h-[400px] bg-brand-pink rounded-[48px] transform rotate-3 flex items-center justify-center shadow-xl border border-ink/5">
              <Leaf className="w-40 h-40 text-ink opacity-90" aria-hidden="true" />
            </div>
          </div>
        </header>
      </section>

      <section className="w-full bg-brand-pink/20 py-32 px-6 border-y border-hairline">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-[40px] md:text-[56px] font-medium text-ink tracking-[-1.5px] leading-tight mb-4">
              How it actually works.
            </h2>
            <p className="text-[18px] text-muted max-w-2xl mx-auto font-medium">
              We replaced boring forms and dropdowns with magic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-canvas border border-hairline p-8 rounded-[24px] shadow-sm text-center">
              <div className="w-16 h-16 bg-brand-lavender text-ink flex items-center justify-center rounded-2xl mx-auto mb-6">
                <Target className="w-8 h-8" aria-hidden="true" />
              </div>
              <h3 className="text-[20px] font-semibold text-ink mb-3">
                1. Tell us what you did
              </h3>
              <p className="text-muted font-medium text-[15px] leading-relaxed">
                Just type &quot;I ate a beef burger&quot; or &quot;I drove
                20km&quot;. No forms, no complex menus.
              </p>
            </div>

            <div className="bg-canvas border border-hairline p-8 rounded-[24px] shadow-sm text-center">
              <div className="w-16 h-16 bg-brand-teal text-white flex items-center justify-center rounded-2xl mx-auto mb-6">
                <Zap className="w-8 h-8" aria-hidden="true" />
              </div>
              <h3 className="text-[20px] font-semibold text-ink mb-3">
                2. AI Calculates the impact
              </h3>
              <p className="text-muted font-medium text-[15px] leading-relaxed">
                Gemini processes the natural language instantly, matching it to
                deterministic scientific emission factors.
              </p>
            </div>

            <div className="bg-canvas border border-hairline p-8 rounded-[24px] shadow-sm text-center">
              <div className="w-16 h-16 bg-brand-peach text-ink flex items-center justify-center rounded-2xl mx-auto mb-6">
                <RefreshCw className="w-8 h-8" aria-hidden="true" />
              </div>
              <h3 className="text-[20px] font-semibold text-ink mb-3">
                3. Discover effortless swaps
              </h3>
              <p className="text-muted font-medium text-[15px] leading-relaxed">
                Based on your actual habits, the AI recommends highly
                personalized, easy lifestyle changes to lower your impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-canvas py-32 px-6">
        <div className="max-w-4xl mx-auto bg-ink rounded-[32px] p-12 md:p-20 text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <h2 className="text-[40px] md:text-[56px] font-medium text-white tracking-[-1.5px] leading-tight mb-6">
              Ready to take action?
            </h2>
            <p className="text-[18px] text-white/80 max-w-xl mx-auto font-medium mb-10">
              Join a movement of conscious individuals building a greener
              future, one simple choice at a time.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-10 py-5 rounded-2xl bg-brand-teal text-white font-bold text-[18px] hover:opacity-90 transition-opacity shadow-sm"
            >
              Go to Dashboard
            </Link>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-mint/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
      </section>

      <footer className="w-full border-t border-hairline py-8 px-6 text-center">
        <p className="text-sm text-muted font-medium">
          © 2026 MYCELIUM. Built for individuals, not corporations.
        </p>
      </footer>
    </main>
  );
}
