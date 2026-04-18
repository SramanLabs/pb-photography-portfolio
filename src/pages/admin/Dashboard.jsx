import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Image as ImageIcon, 
  MessageSquare, 
  Mail, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  Clock,
  User as UserIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, trend, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="glass-card p-6 rounded-2xl border border-white/5 bg-white/[0.02] relative overflow-hidden group hover:bg-white/[0.04] transition-colors"
  >
    <div className="flex items-start justify-between">
      <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4 transition-transform duration-500 group-hover:scale-110">
        <Icon className="w-6 h-6" />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-widest">
          <TrendingUp className="w-3 h-3" /> {trend}
        </span>
      )}
    </div>
    <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
    <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">{label}</p>
    
    {/* Subtle bottom glow */}
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/0 via-amber-500/20 to-amber-500/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
  </motion.div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    albums: 0,
    photos: 0,
    testimonials: 0,
    unreadContacts: 0
  });
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [albumsRes, testimonialsRes, contactsRes] = await Promise.all([
          api.get('/albums'),
          api.get('/testimonials/all'),
          api.get('/contacts')
        ]);

        const totalPhotos = albumsRes.data.reduce((acc, album) => acc + (album.photos?.length || 0), 0);
        const unreadCnt = contactsRes.data.filter(c => !c.read).length;

        setStats({
          albums: albumsRes.data.length,
          photos: totalPhotos,
          testimonials: testimonialsRes.data.length,
          unreadContacts: unreadCnt
        });
        
        setRecentContacts(contactsRes.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-playfair font-bold text-white mb-2">
            Overview <span className="text-amber-500">Dashboard</span>
          </h1>
          <p className="text-gray-400 text-sm">Welcome back to the PB Photography management console.</p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-gray-400 text-xs font-bold uppercase tracking-widest">
          <Calendar className="w-4 h-4 text-amber-500" />
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={ImageIcon} label="Total Albums" value={stats.albums} trend="+2 new" delay={0.1} />
        <StatCard icon={ImageIcon} label="Total Photos" value={stats.photos} trend="+12" delay={0.2} />
        <StatCard icon={MessageSquare} label="Testimonials" value={stats.testimonials} trend="100% OK" delay={0.3} />
        <StatCard icon={Mail} label="New Contacts" value={stats.unreadContacts} trend={stats.unreadContacts > 0 ? `${stats.unreadContacts} Action` : 'Clear'} delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="lg:col-span-2 glass-card rounded-2xl border border-white/5 overflow-hidden flex flex-col"
        >
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-playfair font-bold text-white">Recent Inquiries</h3>
                <button 
                    onClick={() => navigate('/admin/contacts')}
                    className="text-amber-500 text-[10px] uppercase tracking-[0.2em] font-bold hover:text-amber-400 flex items-center gap-2 group"
                >
                    View All <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white/5">
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Client</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Event Type</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Status</th>
                            <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {recentContacts.map((contact, idx) => (
                            <tr key={contact._id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 text-[10px] font-bold">
                                            {contact.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{contact.name}</p>
                                            <p className="text-[10px] text-gray-500">{contact.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 bg-white/5 px-2 py-1 rounded-md">
                                        {contact.eventType}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {contact.read ? (
                                        <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-bold text-gray-600">
                                            <CheckCircle2 className="w-3 h-3" /> Responded
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-bold text-amber-500">
                                            <Clock className="w-3 h-3" /> Awaiting
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-[10px] text-gray-500 font-mono">
                                    {new Date(contact.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {recentContacts.length === 0 && (
                <div className="py-20 text-center flex flex-col items-center gap-4">
                    <Mail className="w-12 h-12 text-white/10" />
                    <p className="text-gray-500 text-sm uppercase tracking-widest">No inquiries found</p>
                </div>
            )}
        </motion.div>

        {/* System Info Sidebar */}
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="space-y-8"
        >
            {/* User Profile Card */}
            <div className="glass-card p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-amber-500/10 to-transparent">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center text-black font-bold text-xl shadow-xl shadow-amber-500/20">
                        {localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).email.charAt(0).toUpperCase() : 'A'}
                    </div>
                    <div>
                        <h4 className="text-lg font-playfair font-bold text-white">Admin</h4>
                        <p className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">PB Photography</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                        <span className="text-gray-500">System Role</span>
                        <span className="text-white font-bold flex items-center gap-1.5">
                            <UserIcon className="w-3 h-3 text-amber-500" /> Main Admin
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                        <span className="text-gray-500">Last Login</span>
                        <span className="text-white font-mono">Just now</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-2">
                        <span className="text-gray-500">Server Status</span>
                        <span className="text-emerald-500 font-bold flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Action Widget */}
            <div className="glass-card p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                <h4 className="text-sm font-playfair font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500/50" /> Backup Status
                </h4>
                <div className="p-4 rounded-xl bg-black/40 border border-white/5 text-[11px] text-gray-400 leading-relaxed">
                   Your portfolio database is stored on the secure production server. Daily backups are enabled.
                </div>
                <button className="w-full mt-4 py-3 rounded-xl bg-white/5 border border-white/10 text-[10px] uppercase font-bold tracking-widest hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all">
                    Generate Report
                </button>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
