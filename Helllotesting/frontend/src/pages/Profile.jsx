import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
import { AuthContext } from '../context/AuthContext';
import { User, FileText, GraduationCap, Lightbulb, Save, CheckCircle, AlertCircle, Star } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    skillsToTeach: '',
    skillsToLearn: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        bio: user.bio || '',
        skillsToTeach: user.skillsToTeach?.join(', ') || '',
        skillsToLearn: user.skillsToLearn?.join(', ') || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const updatedData = {
        name: profile.name,
        bio: profile.bio,
        skillsToTeach: profile.skillsToTeach.split(',').map(s => s.trim()).filter(s => s),
        skillsToLearn: profile.skillsToLearn.split(',').map(s => s.trim()).filter(s => s)
      };

      const { data } = await axios.put(`${API_BASE_URL}/api/users/profile`, updatedData, config);
      setUser({ ...user, ...data });
      localStorage.setItem('userInfo', JSON.stringify({ ...user, ...data }));
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error updating profile');
    }
  };

  const teachSkills = profile.skillsToTeach.split(',').map(s => s.trim()).filter(s => s);
  const learnSkills = profile.skillsToLearn.split(',').map(s => s.trim()).filter(s => s);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} className="w-20 h-20 rounded-2xl border-2 border-white/20 shadow-xl object-cover bg-white/15" />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-extrabold">{user.name}</h1>
              <p className="text-primary-200 text-sm mt-1">{user.email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
                <span className="text-sm font-semibold">{user.rating ? user.rating.toFixed(1) : '0.0'}</span>
                <span className="text-primary-300 text-xs">({user.reviewsCount || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 animate-fade-in-up">
          {message && (
            <div className={`flex items-center gap-3 p-4 mb-6 rounded-xl text-sm font-medium
              ${message.includes('Error')
                ? 'bg-red-50 border border-red-200 text-red-700'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-700'}`}
            >
              {message.includes('Error')
                ? <AlertCircle className="w-5 h-5 shrink-0" />
                : <CheckCircle className="w-5 h-5 shrink-0" />}
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <User className="w-4 h-4 text-primary-500" /> Display Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-800 placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <FileText className="w-4 h-4 text-primary-500" /> Bio
              </label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-800 placeholder:text-slate-400 resize-none"
                rows="3"
                placeholder="Tell others about yourself..."
              ></textarea>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <GraduationCap className="w-4 h-4 text-emerald-500" /> Skills You Can Teach
              </label>
              <input
                type="text"
                value={profile.skillsToTeach}
                onChange={(e) => setProfile({...profile, skillsToTeach: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-800 placeholder:text-slate-400"
                placeholder="e.g. React, Python, Graphic Design"
              />
              {teachSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {teachSkills.map((s, i) => (
                    <span key={i} className="bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-lg border border-emerald-100">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-500" /> Skills You Want To Learn
              </label>
              <input
                type="text"
                value={profile.skillsToLearn}
                onChange={(e) => setProfile({...profile, skillsToLearn: e.target.value})}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-800 placeholder:text-slate-400"
                placeholder="e.g. Spanish, Machine Learning"
              />
              {learnSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {learnSkills.map((s, i) => (
                    <span key={i} className="bg-amber-50 text-amber-700 text-xs font-medium px-2.5 py-1 rounded-lg border border-amber-100">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3.5 rounded-xl font-bold hover:from-primary-500 hover:to-primary-600 transition-all duration-300 shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" /> Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;