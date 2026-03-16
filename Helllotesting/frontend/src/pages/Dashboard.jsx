import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search, MessageCircle, Star, CheckCircle, XCircle, Clock, Award,
  Compass, ClipboardList, Plus, Trash2, Pencil, Send, GraduationCap,
  BarChart3, BookOpen, MessagesSquare, ArrowRight
} from 'lucide-react';
import SkillSetupModal from '../components/SkillSetupModal';

const Dashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [chatUsers, setChatUsers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [ratingData, setRatingData] = useState({});
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editSkillValue, setEditSkillValue] = useState('');

  useEffect(() => {
    if (location.state?.isNewUser) {
      setShowSkillModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    fetchUsers();
    fetchRequests();
    fetchChatUsers();
  }, []);

  const config = { headers: { Authorization: `Bearer ${user.token}` } };

  const fetchUsers = async (search = '') => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/users?keyword=${search}`, config);
      setUsers(data);
    } catch (error) { console.error(error); }
  };

  const fetchRequests = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/requests`, config);
      setRequests(data);
    } catch (error) { console.error(error); }
  };

  const fetchChatUsers = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/messages/chats`, config);
      setChatUsers(data);
    } catch (error) { console.error(error); }
  };

  const handleSearch = (e) => { e.preventDefault(); fetchUsers(keyword); };

  const sendRequest = async (receiverId, skill) => {
    try {
      await axios.post(`http://localhost:5000/api/requests`, { receiverId, skill }, config);
      alert('Request sent successfully!');
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send request');
    }
  };

  const updateRequestStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/requests/${id}/status`, { status }, config);
      fetchRequests();
      fetchChatUsers();
    } catch (error) { alert('Failed to update status'); }
  };

  const handleRateUser = async (userId, requestId) => {
    const ratingValue = ratingData[requestId];
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) return alert('Please select a rating between 1 and 5');
    try {
      await axios.post(`http://localhost:5000/api/users/${userId}/rate`, { rating: ratingValue }, config);
      alert('User rated successfully!');
      fetchUsers();
    } catch (error) { alert('Failed to submit rating'); }
  };

  const deleteSkill = async (skill) => {
    if (!window.confirm(`Remove "${skill}" from your skills?`)) return;
    try {
      const { data } = await axios.delete(`http://localhost:5000/api/users/profile/skill`, { ...config, data: { skill } });
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      fetchUsers();
    } catch (error) { alert('Failed to delete skill'); }
  };

  const editSkill = async (oldSkill) => {
    if (!editSkillValue.trim() || editSkillValue.trim() === oldSkill) {
      setEditingSkill(null);
      return;
    }
    try {
      const newSkills = user.skillsToTeach.map(s => s === oldSkill ? editSkillValue.trim() : s);
      const { data } = await axios.put(`http://localhost:5000/api/users/profile`, { ...user, skillsToTeach: newSkills }, config);
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('userInfo', JSON.stringify(updatedUser));
      setEditingSkill(null);
      fetchUsers();
    } catch (error) { alert('Failed to update skill'); }
  };

  const handleSkillModalClose = () => {
    setShowSkillModal(false);
    fetchUsers();
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const acceptedRequests = requests.filter(r => r.status === 'accepted' || r.status === 'completed');

  const statusConfig = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: Clock },
    accepted: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle },
    completed: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Award },
    rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: XCircle },
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'requests', label: 'Requests', icon: ClipboardList, count: pendingRequests.length },
    { id: 'messages', label: 'Messages', icon: MessagesSquare, count: chatUsers.length },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <SkillSetupModal isOpen={showSkillModal} onClose={handleSkillModalClose} />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-1">Welcome back, {user.name}</h1>
          <p className="text-primary-200 text-sm sm:text-base">Manage your skills, requests and conversations</p>

          {/* Tabs */}
          <div className="mt-6 flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-white text-primary-700 shadow-lg shadow-black/10'
                    : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-1 text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-primary-100 text-primary-700' : 'bg-white/20 text-white'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in-up space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center"><Star className="w-5 h-5 text-amber-500 fill-amber-500" /></div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">Rating</span>
                </div>
                <p className="text-2xl font-extrabold text-slate-900">{user.rating ? user.rating.toFixed(1) : '0.0'}</p>
                <p className="text-xs text-slate-400 mt-0.5">{user.reviewsCount || 0} reviews</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center"><GraduationCap className="w-5 h-5 text-emerald-500" /></div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">Skills Listed</span>
                </div>
                <p className="text-2xl font-extrabold text-slate-900">{user.skillsToTeach?.length || 0}</p>
                <p className="text-xs text-slate-400 mt-0.5">teaching skills</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center"><MessagesSquare className="w-5 h-5 text-primary-500" /></div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">Active Chats</span>
                </div>
                <p className="text-2xl font-extrabold text-slate-900">{chatUsers.length}</p>
                <p className="text-xs text-slate-400 mt-0.5">conversations</p>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center"><Clock className="w-5 h-5 text-violet-500" /></div>
                  <span className="text-xs font-semibold text-slate-400 uppercase">Pending</span>
                </div>
                <p className="text-2xl font-extrabold text-slate-900">{pendingRequests.length}</p>
                <p className="text-xs text-slate-400 mt-0.5">requests pending</p>
              </div>
            </div>

            {/* Your Skills */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 pb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-emerald-500" /> Your Skills</h2>
                <button onClick={() => setShowSkillModal(true)} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 transition shadow-sm">
                  <Plus className="w-4 h-4" /> Add Skills
                </button>
              </div>
              <div className="px-6 pb-6">
                {user.skillsToTeach?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.skillsToTeach.map((skill, i) => (
                      <div key={i} className="group relative flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
                        {editingSkill === skill ? (
                          <form onSubmit={(e) => { e.preventDefault(); editSkill(skill); }} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editSkillValue}
                              onChange={(e) => setEditSkillValue(e.target.value)}
                              className="px-2 py-1 text-sm border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-32"
                              autoFocus
                            />
                            <button type="submit" className="text-emerald-600 hover:text-emerald-800"><CheckCircle className="w-4 h-4" /></button>
                            <button type="button" onClick={() => setEditingSkill(null)} className="text-slate-400 hover:text-slate-600"><XCircle className="w-4 h-4" /></button>
                          </form>
                        ) : (
                          <>
                            <span className="text-sm font-semibold text-emerald-700">{skill}</span>
                            <button onClick={() => { setEditingSkill(skill); setEditSkillValue(skill); }} className="text-emerald-400 hover:text-emerald-700 transition" title="Edit">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => deleteSkill(skill)} className="text-emerald-400 hover:text-red-600 transition" title="Delete">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">No skills listed yet</p>
                    <p className="text-slate-400 text-sm">Add skills to appear in the Browse section for other users</p>
                  </div>
                )}
              </div>
            </div>

            {/* Browse Skills */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4"><Compass className="w-5 h-5 text-primary-500" /> Browse Skills</h2>
              <form onSubmit={handleSearch} className="mb-6 flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search skills or users..."
                    className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all text-slate-800 placeholder:text-slate-400 shadow-sm"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <button type="submit" className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 sm:px-8 py-3.5 rounded-xl font-semibold hover:from-primary-500 hover:to-primary-600 transition-all shadow-lg shadow-primary-500/20 whitespace-nowrap">
                  Search
                </button>
              </form>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(u => (
                  <div key={u._id} className="group bg-white rounded-2xl border border-slate-100 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300 overflow-hidden">
                    <div className="p-6 pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`} alt={u.name} className="w-11 h-11 rounded-xl shadow-md shadow-primary-500/20 object-cover bg-primary-100" />
                        <div>
                          <h3 className="font-bold text-slate-900">{u.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-sm font-semibold text-amber-600">{u.rating ? u.rating.toFixed(1) : '0.0'}</span>
                            <span className="text-xs text-slate-400">({u.reviewsCount || 0})</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">{u.bio || 'No bio provided'}</p>
                    </div>

                    {/* Skills with Request buttons */}
                    {u.skillsToTeach?.length > 0 && (
                      <div className="bg-slate-50 border-t border-slate-100 px-6 py-4">
                        <div className="flex flex-col gap-2">
                          {u.skillsToTeach.map((s, i) => (
                            <div key={i} className="flex items-center justify-between gap-3">
                              <span className="bg-primary-50 text-primary-700 text-xs font-medium px-2.5 py-1 rounded-lg border border-primary-100">{s}</span>
                              <button
                                onClick={() => sendRequest(u._id, s)}
                                className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
                              >
                                <Send className="w-3 h-3" /> Request
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {users.length === 0 && (
                  <div className="col-span-full text-center py-16">
                    <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">No users found</p>
                    <p className="text-slate-400 text-sm">Try a different search term</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== REQUESTS TAB ===== */}
        {activeTab === 'requests' && (
          <div className="animate-fade-in-up space-y-4">
            {requests.map(req => {
              const isReceiver = req.receiver._id === user._id;
              const status = statusConfig[req.status] || statusConfig.pending;
              const StatusIcon = status.icon;
              return (
                <div key={req._id} className="bg-white rounded-2xl border border-slate-100 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden">
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-3">
                          <img src={(isReceiver ? req.sender.avatar : req.receiver.avatar) || `https://api.dicebear.com/7.x/avataaars/svg?seed=${isReceiver ? req.sender.name : req.receiver.name}`} alt="" className="w-10 h-10 rounded-xl shrink-0 shadow-md shadow-primary-500/20 object-cover bg-primary-100" />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900">
                              {isReceiver ? `${req.sender.name} wants to learn ` : `You requested to learn `}
                              <span className="text-primary-600">{req.skill}</span>
                              {isReceiver ? '' : ` from ${req.receiver.name}`}
                            </p>
                            <p className="text-sm text-slate-500 mt-0.5 truncate">{req.message}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full font-semibold ${status.bg} ${status.text} border ${status.border}`}>
                          <StatusIcon className="w-3.5 h-3.5" /> {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end shrink-0">
                        {isReceiver && req.status === 'pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => updateRequestStatus(req._id, 'accepted')} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-sm">
                              <CheckCircle className="w-4 h-4" /> Accept
                            </button>
                            <button onClick={() => updateRequestStatus(req._id, 'rejected')} className="flex items-center gap-1.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm font-semibold transition">
                              <XCircle className="w-4 h-4" /> Reject
                            </button>
                          </div>
                        )}
                        {req.status === 'accepted' && (
                          <div className="flex gap-2">
                            <button onClick={() => navigate(`/chat/${isReceiver ? req.sender._id : req.receiver._id}`)} className="flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-sm">
                              <MessageCircle className="w-4 h-4" /> Chat
                            </button>
                            <button onClick={() => updateRequestStatus(req._id, 'completed')} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition shadow-sm">
                              <CheckCircle className="w-4 h-4" /> Complete
                            </button>
                          </div>
                        )}
                        {req.status === 'completed' && !isReceiver && (
                          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                            <Star className="w-4 h-4 text-amber-400" />
                            <select className="border border-slate-200 p-1.5 text-sm rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500" onChange={(e) => setRatingData({...ratingData, [req._id]: e.target.value})}>
                              <option value="">Rate</option>
                              <option value="5">5 ★</option>
                              <option value="4">4 ★</option>
                              <option value="3">3 ★</option>
                              <option value="2">2 ★</option>
                              <option value="1">1 ★</option>
                            </select>
                            <button onClick={() => handleRateUser(req.receiver._id, req._id)} className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 text-sm rounded-lg font-semibold transition shadow-sm">
                              Submit
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {requests.length === 0 && (
              <div className="text-center py-16">
                <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No requests yet</p>
                <p className="text-slate-400 text-sm">Browse skills and send requests to start learning</p>
              </div>
            )}
          </div>
        )}

        {/* ===== MESSAGES TAB ===== */}
        {activeTab === 'messages' && (
          <div className="animate-fade-in-up">
            {chatUsers.length > 0 ? (
              <div className="space-y-3">
                {chatUsers.map(partner => (
                  <button
                    key={partner._id}
                    onClick={() => navigate(`/chat/${partner._id}`)}
                    className="w-full bg-white rounded-2xl border border-slate-100 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300 p-5 flex items-center gap-4 text-left"
                  >
                    <img src={partner.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partner.name}`} alt={partner.name} className="w-12 h-12 rounded-xl shadow-md shadow-primary-500/20 shrink-0 object-cover bg-primary-100" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900">{partner.name}</h3>
                      <p className="text-sm text-slate-500 truncate">Skill: <span className="text-primary-600 font-medium">{partner.skill}</span></p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${partner.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                        {partner.status === 'accepted' ? 'Active' : 'Completed'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <MessagesSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500 font-medium">No conversations yet</p>
                <p className="text-slate-400 text-sm">Chats become available when a skill request is accepted</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;