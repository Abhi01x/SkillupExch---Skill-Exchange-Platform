import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { GraduationCap, Lightbulb, X, ArrowRight, Sparkles, Plus } from 'lucide-react';

const SkillSetupModal = ({ isOpen, onClose }) => {
  const { user, setUser } = useContext(AuthContext);
  const [skillsToTeach, setSkillsToTeach] = useState('');
  const [skillsToLearn, setSkillsToLearn] = useState('');
  const [teachTags, setTeachTags] = useState([]);
  const [learnTags, setLearnTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      setTeachTags(user.skillsToTeach || []);
      setLearnTags(user.skillsToLearn || []);
      setSkillsToTeach('');
      setSkillsToLearn('');
      setError('');
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const addTeachTag = () => {
    const trimmed = skillsToTeach.trim();
    if (trimmed && !teachTags.includes(trimmed)) {
      setTeachTags([...teachTags, trimmed]);
      setSkillsToTeach('');
    }
  };

  const addLearnTag = () => {
    const trimmed = skillsToLearn.trim();
    if (trimmed && !learnTags.includes(trimmed)) {
      setLearnTags([...learnTags, trimmed]);
      setSkillsToLearn('');
    }
  };

  const removeTeachTag = (tag) => setTeachTags(teachTags.filter(t => t !== tag));
  const removeLearnTag = (tag) => setLearnTags(learnTags.filter(t => t !== tag));

  const handleKeyDown = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      type === 'teach' ? addTeachTag() : addLearnTag();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const updatedData = {
        name: user.name,
        skillsToTeach: teachTags,
        skillsToLearn: learnTags,
      };

      const { data } = await axios.put('http://localhost:5000/api/users/profile', updatedData, config);
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      onClose();
    } catch (err) {
      setError('Failed to save skills. Please try again.');
    }
    setLoading(false);
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleSkip} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-fade-in-up overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold">Set Up Your Skills</h2>
                <p className="text-primary-200 text-sm">Tell us what you can teach & want to learn</p>
              </div>
            </div>
            <button onClick={handleSkip} className="p-1.5 rounded-lg hover:bg-white/10 transition">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl text-center">
              {error}
            </div>
          )}

          {/* Info box */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <strong>Note:</strong> If you add skills to teach, other students will be able to find and request sessions with you on the Discover page.
          </div>

          {/* Skills to Teach */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <GraduationCap className="w-4 h-4 text-emerald-500" /> Skills You Can Teach
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillsToTeach}
                onChange={(e) => setSkillsToTeach(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'teach')}
                placeholder="e.g. React, Python..."
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-800 placeholder:text-slate-400 text-sm"
              />
              <button
                type="button"
                onClick={addTeachTag}
                className="px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition flex items-center gap-1 text-sm font-semibold"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {teachTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {teachTags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-lg border border-emerald-100">
                    {tag}
                    <button onClick={() => removeTeachTag(tag)} className="hover:text-emerald-900 transition">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Skills to Learn */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-500" /> Skills You Want To Learn
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillsToLearn}
                onChange={(e) => setSkillsToLearn(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, 'learn')}
                placeholder="e.g. Spanish, Machine Learning..."
                className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-800 placeholder:text-slate-400 text-sm"
              />
              <button
                type="button"
                onClick={addLearnTag}
                className="px-3 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl transition flex items-center gap-1 text-sm font-semibold"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            {learnTags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {learnTags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-lg border border-amber-100">
                    {tag}
                    <button onClick={() => removeLearnTag(tag)} className="hover:text-amber-900 transition">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3 sm:justify-between">
          <button
            onClick={handleSkip}
            className="px-5 py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
          >
            Skip for now
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:from-primary-500 hover:to-primary-600 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Saving...
              </span>
            ) : (
              <>Save Skills <ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillSetupModal;
