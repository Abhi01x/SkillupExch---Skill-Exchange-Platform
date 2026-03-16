import { Link } from 'react-router-dom';
import { BookOpen, Users, Star, ArrowRight, Zap, MessageCircle, Award } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-400 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 sm:pt-28 sm:pb-36">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-primary-200 text-sm font-medium mb-6">
                <Zap className="w-4 h-4 text-accent-400" /> Free Peer-to-Peer Learning Platform
              </span>
            </div>
            <h1 className="animate-fade-in-up text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight">
              Exchange Skills,
              <br />
              <span className="bg-gradient-to-r from-accent-400 to-primary-300 bg-clip-text text-transparent">
                Empower Futures
              </span>
            </h1>
            <p className="animate-fade-in-up-delay text-lg sm:text-xl text-primary-200 max-w-2xl mx-auto mb-10 leading-relaxed">
              Learn coding, design, languages, and more from fellow students. Share what you know, learn what you don't. Zero cost, infinite possibilities.
            </p>
            <div className="animate-fade-in-up-delay-2 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="group bg-white text-primary-700 px-8 py-3.5 rounded-2xl text-lg font-bold hover:bg-primary-50 transition-all duration-300 shadow-xl shadow-black/20 flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="border-2 border-white/30 text-white px-8 py-3.5 rounded-2xl text-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
              >
                Log In
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full"><path d="M0 80V40C240 70 480 10 720 40C960 70 1200 10 1440 40V80H0Z" fill="#f8fafc"/></svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">Three simple steps to start learning and teaching</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Users, title: 'Connect', desc: 'Find students who share your interests and want to exchange knowledge.', color: 'primary', step: '01' },
              { icon: BookOpen, title: 'Learn & Teach', desc: 'Schedule sessions, exchange skills, and grow together without spending money.', color: 'accent', step: '02' },
              { icon: Star, title: 'Build Profile', desc: 'Earn ratings and feedback to build a strong portfolio of your abilities.', color: 'primary', step: '03' },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative bg-white p-8 rounded-2xl border border-slate-100 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300"
              >
                <span className="absolute top-6 right-6 text-5xl font-black text-slate-100 group-hover:text-primary-100 transition-colors">{feature.step}</span>
                <div className={`w-14 h-14 ${feature.color === 'accent' ? 'bg-emerald-100 text-emerald-600' : 'bg-primary-100 text-primary-600'} flex items-center justify-center rounded-2xl mb-5`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
          {[
            { icon: Users, value: '500+', label: 'Active Students' },
            { icon: BookOpen, value: '120+', label: 'Skills Available' },
            { icon: MessageCircle, value: '2K+', label: 'Sessions Done' },
            { icon: Award, value: '4.8', label: 'Avg Rating' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <stat.icon className="w-7 h-7 text-primary-200" />
              <span className="text-3xl sm:text-4xl font-extrabold">{stat.value}</span>
              <span className="text-primary-200 text-sm font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">Ready to Start Learning?</h2>
          <p className="text-lg text-slate-500 mb-8">Join thousands of students already exchanging skills on our platform.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-10 py-4 rounded-2xl text-lg font-bold hover:from-primary-500 hover:to-primary-600 transition-all duration-300 shadow-xl shadow-primary-500/25 hover:shadow-primary-500/40"
          >
            Create Free Account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
        <p>&copy; {new Date().getFullYear()} SkillExchange. Built for students, by students.</p>
      </footer>
    </div>
  );
};

export default Home;
