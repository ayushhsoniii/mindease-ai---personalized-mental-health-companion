
import React, { useState, useEffect } from 'react';
import { Music, Play, ExternalLink, RefreshCcw, Loader2, Music2, Headphones, Sparkles, CheckCircle2, Zap, Activity } from 'lucide-react';
import { Mood, SpotifyPlaylist, UserProfile } from '../types';
import { geminiService } from '../services/geminiService';

interface MusicTherapyProps {
  currentMood: Mood | null;
  profile: UserProfile | null;
  isLinked: boolean;
  recommendedPlaylists: SpotifyPlaylist[];
  onLink: () => void;
  onRefresh: (playlists: SpotifyPlaylist[]) => void;
  onVibeUpdate: (vibe: string) => void;
}

const MusicTherapy: React.FC<MusicTherapyProps> = ({ 
  currentMood, 
  profile, 
  isLinked, 
  recommendedPlaylists, 
  onLink,
  onRefresh,
  onVibeUpdate
}) => {
  const [loading, setLoading] = useState(false);
  const [linking, setLinking] = useState(false);
  const [scanning, setScanning] = useState(false);

  const handleLinkSpotify = () => {
    setLinking(true);
    setTimeout(() => {
      onLink();
      setLinking(false);
      fetchPlaylists();
    }, 1500);
  };

  const scanActivity = () => {
    setScanning(true);
    setTimeout(() => {
      const vibes = ["Mellow & Reflective", "High-Energy Focus", "Calm & Ambient", "Stirring & Emotional", "Dark & Intense", "Uplifting & Vibrant"];
      const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];
      onVibeUpdate(randomVibe);
      setScanning(false);
    }, 2500);
  };

  const fetchPlaylists = async () => {
    setLoading(true);
    try {
      const playlists = await geminiService.getMusicRecommendations(currentMood, profile);
      onRefresh(playlists);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLinked && recommendedPlaylists.length === 0) {
      fetchPlaylists();
    }
  }, [isLinked, currentMood]);

  if (!isLinked) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="bg-gradient-to-br from-zinc-900 to-black rounded-[48px] p-10 md:p-20 text-white shadow-2xl relative overflow-hidden border border-zinc-800">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <Music2 className="w-64 h-64" />
          </div>
          
          <div className="relative z-10 space-y-8 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="bg-[#1DB954] p-3 rounded-2xl shadow-lg shadow-[#1DB954]/20">
                <Music className="w-8 h-8 text-white" />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.3em] text-[#1DB954]">Spotify Connect</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter">Music for your Soul.</h1>
              <p className="text-xl text-zinc-400 max-w-xl leading-relaxed">
                Connect your Spotify to let MindEase AI curate therapy-grade playlists and track your listening vibe for deeper personalized support.
              </p>
            </div>

            <button 
              onClick={handleLinkSpotify}
              disabled={linking}
              className="flex items-center gap-4 px-10 py-5 bg-[#1DB954] hover:bg-[#1ed760] text-white rounded-[24px] font-black shadow-2xl shadow-[#1DB954]/40 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 mx-auto md:mx-0"
            >
              {linking ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 fill-current" />
                  Link Spotify Account
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="bg-emerald-50 p-10 rounded-[48px] border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-8">
         <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#1DB954] rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-200">
               <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
               <h2 className="text-2xl font-black text-slate-800">Spotify Vibe Tracker</h2>
               <p className="text-sm text-slate-500 font-medium">Sync your recent activity to help MindEase AI sense your overall mood.</p>
            </div>
         </div>
         <button 
           onClick={scanActivity}
           disabled={scanning}
           className="flex items-center gap-3 px-8 py-4 bg-white text-[#1DB954] border-2 border-[#1DB954] rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#1DB954] hover:text-white transition-all active:scale-95 disabled:opacity-50"
         >
           {scanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
           {scanning ? 'Analyzing History...' : 'Sync Recent Vibe'}
         </button>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 text-center md:text-left">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#1DB954] justify-center md:justify-start">
             <Headphones className="w-4 h-4" /> Therapeutic Audio
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-800">
            For you, <span className="text-[var(--primary)]">{profile?.name?.split(' ')[0]}</span>
          </h1>
          <p className="theme-text-muted font-medium text-lg">Personalized selections based on your {profile?.personalityType} archetype.</p>
        </div>

        <button 
          onClick={fetchPlaylists}
          disabled={loading}
          className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all active:scale-95 text-slate-600 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin text-[var(--primary)]" /> : <Zap className="w-4 h-4 text-[var(--primary)]" />}
          Re-Curate
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {loading ? (
           <div className="lg:col-span-2 py-20 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-12 h-12 text-[#1DB954] animate-spin" />
              <p className="text-zinc-400 font-black uppercase tracking-[0.2em] text-xs">Matching sounds to your spirit...</p>
           </div>
        ) : (
          recommendedPlaylists.map((playlist) => {
            const embedUrl = playlist.uri?.includes('open.spotify.com/') ? playlist.uri.replace('open.spotify.com/', 'open.spotify.com/embed/') : '';
            return (
              <div key={playlist.id} className="bg-white rounded-[48px] p-8 border border-slate-100 shadow-sm space-y-6 hover:shadow-xl transition-all group">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#1DB954]/10 text-[#1DB954] rounded-full text-[10px] font-black uppercase tracking-widest mb-2">
                       <Sparkles className="w-3 h-3" /> Archetype Pick
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 group-hover:text-[var(--primary)] transition-colors">{playlist.title}</h3>
                    <p className="text-sm theme-text-muted font-medium italic">"{playlist.description}"</p>
                  </div>
                  <a href={playlist.uri} target="_blank" rel="noreferrer" className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-[#1DB954] hover:text-white transition-all">
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
                {embedUrl && (
                  <div className="rounded-[32px] overflow-hidden shadow-inner bg-slate-900 border-4 border-slate-100 h-[152px]">
                     <iframe src={embedUrl} width="100%" height="152" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MusicTherapy;
