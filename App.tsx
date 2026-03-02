/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Users, 
  Calendar, 
  Newspaper, 
  MapPin, 
  Clock, 
  LogIn, 
  LogOut, 
  ShoppingCart, 
  Plus, 
  Trash2, 
  ChevronRight,
  Menu,
  X,
  Download,
  CheckCircle2,
  CreditCard,
  User,
  FileText,
  Image as ImageIcon,
  Upload
} from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { OFFICIALS, EVENTS, TRAINING, GPU_ADDRESS, REGISTRATION_FEE, BANK_INFO } from './constants';
import { Official, Athlete, Registration, News } from './types';

// --- Components ---

const Navbar = ({ activePage, setActivePage, loggedInOfficial, onLogout, cartCount }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'events', label: 'Event 2026' },
    { id: 'training', label: 'Pelatihan' },
    { id: 'news', label: 'Berita' },
    { id: 'schedule', label: 'Jadwal' },
  ];

  if (loggedInOfficial) {
    if (loggedInOfficial.isAdmin) {
      navItems.push({ id: 'admin', label: 'Admin Panel' });
    } else {
      navItems.push({ id: 'history', label: 'Riwayat' });
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-ipsi-black/95 text-white border-b border-ipsi-yellow/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActivePage('home')}>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1.5 shadow-lg shadow-ipsi-yellow/20">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Logo_IPSI.png" alt="IPSI Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight tracking-tight">IPSI</h1>
              <p className="text-[10px] uppercase tracking-widest text-ipsi-yellow">Kabupaten Pekalongan</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`text-sm font-medium transition-colors hover:text-ipsi-yellow ${activePage === item.id ? 'text-ipsi-yellow' : 'text-white/70'}`}
              >
                {item.label}
              </button>
            ))}
            {loggedInOfficial ? (
              <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                <button 
                  onClick={() => setActivePage('cart')}
                  className="relative p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                  <ShoppingCart className="w-5 h-5 text-ipsi-yellow" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs font-bold">{loggedInOfficial.name}</p>
                    <p className="text-[10px] text-white/50">{loggedInOfficial.perguruan}</p>
                  </div>
                  <button onClick={onLogout} className="p-2 hover:text-red-400 transition-colors">
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => setActivePage('login')}
                className="bg-ipsi-yellow text-ipsi-black px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-white transition-all"
              >
                <LogIn className="w-4 h-4" />
                Login Official
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
             {loggedInOfficial && (
                <button 
                  onClick={() => setActivePage('cart')}
                  className="relative p-2"
                >
                  <ShoppingCart className="w-5 h-5 text-ipsi-yellow" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-ipsi-black border-t border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left text-lg font-medium py-2 border-b border-white/5"
                >
                  {item.label}
                </button>
              ))}
              {!loggedInOfficial ? (
                <button 
                  onClick={() => {
                    setActivePage('login');
                    setIsOpen(false);
                  }}
                  className="w-full bg-ipsi-yellow text-ipsi-black py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <LogIn className="w-5 h-5" />
                  Login Official
                </button>
              ) : (
                <button 
                  onClick={onLogout}
                  className="w-full bg-red-500/10 text-red-500 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ onStartRegistration }: any) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-04-15T08:00:00');
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=2000" 
          alt="Gapura Wayang" 
          className="w-full h-full object-cover grayscale opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ipsi-black via-ipsi-black/90 to-ipsi-black"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-ipsi-yellow/10 border border-ipsi-yellow/30 px-4 py-2 rounded-full mb-8">
            <div className="w-6 h-6 bg-white rounded-full p-1">
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Logo_IPSI.png" alt="IPSI Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
            <span className="text-ipsi-yellow text-xs font-bold uppercase tracking-widest">Website Resmi Organisasi</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black text-white mb-8 leading-tight tracking-tighter">
            IKATAN PENCAK SILAT INDONESIA <br />
            <span className="text-ipsi-yellow">KABUPATEN PEKALONGAN</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto mb-12 leading-relaxed">
            Selamat datang di portal resmi IPSI Kabupaten Pekalongan. Kami berkomitmen untuk melestarikan budaya bangsa melalui pembinaan prestasi atlet pencak silat yang berkelanjutan, profesional, dan berintegritas di seluruh wilayah Kabupaten Pekalongan.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-32">
            <button 
              onClick={onStartRegistration}
              className="bg-ipsi-yellow text-ipsi-black px-10 py-5 rounded-2xl font-black text-lg flex items-center gap-3 hover:scale-105 transition-transform shadow-xl shadow-ipsi-yellow/20"
            >
              IKUTI KEJUARAAN 2026
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Featured Event Section */}
          <div className="mt-20 pt-20 border-t border-white/5 pb-32">
            <p className="text-ipsi-yellow font-bold tracking-[0.3em] text-xs mb-8 uppercase">Event Terdekat</p>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-12 uppercase tracking-tight">IPSI CUP 3</h2>
            
            {/* Countdown - Moved further down with more spacing */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { label: 'HARI', value: timeLeft.days },
                { label: 'JAM', value: timeLeft.hours },
                { label: 'MENIT', value: timeLeft.minutes },
                { label: 'DETIK', value: timeLeft.seconds },
              ].map((item) => (
                <div key={item.label} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
                  <p className="text-4xl md:text-5xl font-black text-ipsi-yellow leading-none mb-2">{item.value.toString().padStart(2, '0')}</p>
                  <p className="text-[10px] text-white/40 font-bold tracking-widest uppercase">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Location Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-ipsi-yellow py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6 md:gap-16 text-ipsi-black font-black text-xs md:text-sm tracking-wider">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            <span>GPU KABUPATEN PEKALONGAN</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>15 - 20 APRIL 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            <span>IPSI CUP 3</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutSection = () => (
  <section className="py-24 bg-ipsi-white">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-gray-50 p-6 grid grid-cols-5 gap-3 items-center justify-items-center">
            {[
              "https://upload.wikimedia.org/wikipedia/commons/2/2f/Logo_IPSI.png",
              "https://upload.wikimedia.org/wikipedia/id/d/d4/Logo_PSHT.png",
              "https://upload.wikimedia.org/wikipedia/id/7/7e/Logo_Pagar_Nusa.png",
              "https://upload.wikimedia.org/wikipedia/id/a/a2/Logo_Tapak_Suci.png",
              "https://upload.wikimedia.org/wikipedia/id/b/b3/Logo_Merpati_Putih.png",
              "https://upload.wikimedia.org/wikipedia/id/1/1e/Logo_Perisai_Diri.png",
              "https://upload.wikimedia.org/wikipedia/id/0/0e/Logo_Persinas_ASAD.png",
              "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Logo_KONI.svg/1200px-Logo_KONI.svg.png",
              "https://upload.wikimedia.org/wikipedia/commons/2/2f/Logo_IPSI.png",
              "https://upload.wikimedia.org/wikipedia/id/d/d4/Logo_PSHT.png",
              "https://upload.wikimedia.org/wikipedia/id/7/7e/Logo_Pagar_Nusa.png",
              "https://upload.wikimedia.org/wikipedia/id/a/a2/Logo_Tapak_Suci.png",
              "https://upload.wikimedia.org/wikipedia/id/b/b3/Logo_Merpati_Putih.png",
              "https://upload.wikimedia.org/wikipedia/id/1/1e/Logo_Perisai_Diri.png",
              "https://upload.wikimedia.org/wikipedia/id/0/0e/Logo_Persinas_ASAD.png"
            ].map((logo, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="w-full aspect-square flex items-center justify-center p-1.5 bg-white rounded-lg shadow-sm border border-gray-100"
              >
                <img 
                  src={logo} 
                  alt={`Logo Perguruan ${i}`} 
                  className="max-w-full max-h-full object-contain grayscale hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ))}
          </div>
          <div className="absolute -bottom-8 -right-8 bg-ipsi-yellow p-8 rounded-3xl shadow-xl hidden md:block">
            <p className="text-4xl font-black text-ipsi-black">10+</p>
            <p className="text-xs font-bold text-ipsi-black/60 uppercase tracking-widest">Perguruan Aktif</p>
          </div>
        </div>
        <div>
          <p className="text-ipsi-yellow font-black tracking-widest text-xs mb-4 uppercase">Tentang Kami</p>
          <h2 className="text-4xl md:text-5xl font-black text-ipsi-black mb-8 leading-tight">
            Membangun Karakter Melalui <br />
            <span className="text-gray-400">Seni PENCAK SILAT</span>
          </h2>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p>
              Ikatan Pencak Silat Indonesia (IPSI) Kabupaten Pekalongan merupakan wadah resmi bagi seluruh organisasi pencak silat di wilayah Kabupaten Pekalongan. Kami berfokus pada pengembangan prestasi atlet, standarisasi kepelatihan, dan pelestarian nilai-nilai luhur pencak silat.
            </p>
            <p>
              Dengan semangat kebersamaan, kami terus berupaya mencetak generasi pesilat yang tidak hanya unggul dalam gelanggang, tetapi juga memiliki karakter yang kuat, disiplin, dan menjunjung tinggi sportivitas.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Login = ({ onLoginSuccess }: any) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const official = OFFICIALS.find(o => o.name.toLowerCase() === name.toLowerCase() && o.uniqueCode === code);
    if (official) {
      onLoginSuccess(official);
    } else {
      setError('Nama atau Kode Unik salah. Silakan hubungi panitia.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ipsi-black px-4 pt-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 p-2 shadow-xl shadow-ipsi-yellow/20">
               <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Logo_IPSI.png" alt="IPSI Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          <h2 className="text-2xl font-black text-ipsi-black">LOGIN OFFICIAL</h2>
          <p className="text-gray-500 text-sm">Masukkan data official untuk mendaftar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nama Lengkap</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-ipsi-yellow transition-all"
              placeholder="Contoh: Nafisah Amalina"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Kode Unik Official</label>
            <input 
              type="text" 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-ipsi-yellow transition-all"
              placeholder="Contoh: IPSI-PKL-P5-004"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium text-center">{error}</p>
          )}

          <button 
            type="submit"
            className="w-full bg-ipsi-black text-white py-4 rounded-2xl font-black text-lg hover:bg-ipsi-yellow hover:text-ipsi-black transition-all shadow-lg"
          >
            MASUK
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">Belum punya kode unik? Hubungi sekretariat IPSI Kabupaten Pekalongan</p>
        </div>
      </motion.div>
    </div>
  );
};

const RegistrationForm = ({ onAddAthlete, official }: any) => {
  const [formData, setFormData] = useState<Partial<Athlete>>({
    gender: 'Putra',
    category: 'Tanding',
    classes: ['Pra Usia Dini']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddAthlete({ ...formData, id: Date.now().toString() } as Athlete);
    setFormData({ gender: 'Putra', category: 'Tanding', classes: ['Pra Usia Dini'] });
    alert('Atlet berhasil ditambahkan ke keranjang!');
  };

  const handleClassChange = (index: number, value: string) => {
    const newClasses = [...(formData.classes || [])];
    newClasses[index] = value;
    setFormData({ ...formData, classes: newClasses });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-ipsi-yellow/10 border-l-4 border-ipsi-yellow p-6 rounded-r-2xl mb-12">
        <h2 className="text-2xl font-black text-white mb-2">Selamat Datang, {official.name}!</h2>
        <p className="text-white/60 text-sm">Official dari: <span className="text-ipsi-yellow font-bold">{official.perguruan}</span> | Kode: {official.uniqueCode}</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl">
        <h3 className="text-xl font-black text-ipsi-black mb-8 flex items-center gap-3">
          <Plus className="w-6 h-6 text-ipsi-yellow" />
          TAMBAH PENDAFTARAN ATLET
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nama Lengkap Atlet</label>
              <input 
                type="text" 
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                value={formData.name || ''}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tempat, Tanggal Lahir</label>
              <input 
                type="text" 
                required
                placeholder="Pekalongan, 01-01-2010"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                onChange={(e) => setFormData({...formData, birthPlaceDate: e.target.value})}
                value={formData.birthPlaceDate || ''}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Jenis Kelamin</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                  onChange={(e) => setFormData({...formData, gender: e.target.value as any})}
                  value={formData.gender}
                >
                  <option value="Putra">Putra</option>
                  <option value="Putri">Putri</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">NIK</label>
                <input 
                  type="text" 
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                  onChange={(e) => setFormData({...formData, nik: e.target.value})}
                  value={formData.nik || ''}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Berat Badan (kg)</label>
                <input 
                  type="number" 
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                  onChange={(e) => setFormData({...formData, weight: Number(e.target.value)})}
                  value={formData.weight || ''}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tinggi Badan (cm)</label>
                <input 
                  type="number" 
                  required
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                  onChange={(e) => setFormData({...formData, height: Number(e.target.value)})}
                  value={formData.height || ''}
                />
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <p className="text-xs font-black text-ipsi-black uppercase tracking-widest">Upload Berkas Terpisah</p>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { label: 'Kartu Keluarga (KK)', key: 'kk' },
                  { label: 'Surat Izin Orang Tua', key: 'parentPermission' },
                  { label: 'Surat Keterangan Dokter', key: 'doctorNote' },
                  { label: 'Pas Foto 3x4', key: 'photo' },
                ].map((file) => (
                  <div key={file.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-xs font-bold text-gray-600">{file.label}</span>
                      </div>
                      {formData.files?.[file.key as keyof typeof formData.files] && (
                        <span className="text-[9px] text-emerald-500 font-bold mt-1 ml-7 truncate max-w-[150px]">
                          ✓ Berkas terpilih
                        </span>
                      )}
                    </div>
                    <label className={`cursor-pointer px-3 py-1 rounded-lg text-[10px] font-bold transition-colors ${formData.files?.[file.key as keyof typeof formData.files] ? 'bg-emerald-500 text-white' : 'bg-white border border-gray-200 hover:bg-ipsi-yellow'}`}>
                      {formData.files?.[file.key as keyof typeof formData.files] ? 'TERPILIH' : 'UPLOAD'}
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => {
                          const fileObj = e.target.files?.[0];
                          if (fileObj) {
                            setFormData({
                              ...formData,
                              files: {
                                ...formData.files,
                                [file.key]: fileObj.name
                              }
                            });
                          }
                        }}
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Kontingen / Sekolah</label>
              <input 
                type="text" 
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                onChange={(e) => setFormData({...formData, kontingen: e.target.value})}
                value={formData.kontingen || ''}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Kategori</label>
              <select 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                value={formData.category}
              >
                <option value="Tanding">Tanding</option>
                <option value="Seni">Seni</option>
              </select>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Kategori Usia</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                  onChange={(e) => handleClassChange(0, e.target.value)}
                  value={formData.classes?.[0] || ''}
                  required
                >
                  <option>Pra Usia Dini</option>
                  <option>Usia Dini 1</option>
                  <option>Usia Dini 2</option>
                  <option>Pra Remaja</option>
                  <option>Remaja</option>
                  <option>Dewasa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Kelas Berat</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                  onChange={(e) => handleClassChange(1, e.target.value)}
                  value={formData.classes?.[1] || ''}
                  required
                >
                  <option>Under</option>
                  <option>Kelas A</option>
                  <option>Kelas B</option>
                  <option>Kelas C</option>
                  <option>Kelas D</option>
                  <option>Kelas E</option>
                  <option>Kelas F</option>
                  <option>Kelas G</option>
                  <option>Kelas H</option>
                  <option>Kelas I</option>
                  <option>Kelas J</option>
                  <option>Bebas</option>
                </select>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 pt-6">
            <button 
              type="submit"
              className="w-full bg-ipsi-black text-white py-4 rounded-2xl font-black text-lg hover:bg-ipsi-yellow hover:text-ipsi-black transition-all"
            >
              TAMBAH KE PENDAFTARAN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Cart = ({ athletes, onRemoveAthlete, onCheckout }: any) => {
  const total = athletes.length * REGISTRATION_FEE;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
        <ShoppingCart className="w-8 h-8 text-ipsi-yellow" />
        KERANJANG PENDAFTARAN
      </h2>

      {athletes.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center">
          <p className="text-gray-400 mb-6">Belum ada atlet yang didaftarkan.</p>
          <button className="text-ipsi-yellow font-bold underline">Kembali ke pendaftaran</button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl overflow-hidden shadow-xl">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Nama Atlet</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Kategori</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Kelas</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Biaya</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {athletes.map((athlete: Athlete) => (
                  <tr key={athlete.id}>
                    <td className="px-6 py-4">
                      <p className="font-bold text-ipsi-black">{athlete.name}</p>
                      <p className="text-xs text-gray-400">{athlete.kontingen}</p>
                    </td>
                    <td className="px-6 py-4 text-sm">{athlete.category}</td>
                    <td className="px-6 py-4 text-sm">{athlete.classes.filter(Boolean).join(', ')}</td>
                    <td className="px-6 py-4 font-bold">Rp {REGISTRATION_FEE.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => onRemoveAthlete(athlete.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-ipsi-yellow rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-ipsi-black/60 font-bold uppercase tracking-widest text-xs">Total Pembayaran</p>
              <h3 className="text-4xl font-black text-ipsi-black">Rp {total.toLocaleString()}</h3>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full md:w-auto bg-ipsi-black text-white px-12 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-transform"
            >
              BAYAR SEKARANG
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Checkout = ({ athletes, official, onFinish }: any) => {
  const [method, setMethod] = useState<'Transfer' | 'COD'>('Transfer');
  const [hasTransferred, setHasTransferred] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const total = athletes.length * REGISTRATION_FEE;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-black text-ipsi-black mb-8">PILIH METODE PEMBAYARAN</h2>
        
        <div className="space-y-4 mb-8">
          <button 
            onClick={() => { setMethod('Transfer'); setHasTransferred(false); setProofFile(null); }}
            className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${method === 'Transfer' ? 'border-ipsi-yellow bg-ipsi-yellow/5' : 'border-gray-100'}`}
          >
            <div className="flex items-center gap-4">
              <CreditCard className={`w-6 h-6 ${method === 'Transfer' ? 'text-ipsi-yellow' : 'text-gray-400'}`} />
              <div className="text-left">
                <p className="font-bold">Transfer Bank</p>
                <p className="text-xs text-gray-400">Bayar via Bank Jateng</p>
              </div>
            </div>
            {method === 'Transfer' && <CheckCircle2 className="w-6 h-6 text-ipsi-yellow" />}
          </button>

          <button 
            onClick={() => { setMethod('COD'); setHasTransferred(true); setProofFile(null); }}
            className={`w-full flex items-center justify-between p-6 rounded-2xl border-2 transition-all ${method === 'COD' ? 'border-ipsi-yellow bg-ipsi-yellow/5' : 'border-gray-100'}`}
          >
            <div className="flex items-center gap-4">
              <MapPin className={`w-6 h-6 ${method === 'COD' ? 'text-ipsi-yellow' : 'text-gray-400'}`} />
              <div className="text-left">
                <p className="font-bold">Bayar di Tempat (COD)</p>
                <p className="text-xs text-gray-400">Bayar saat Technical Meeting</p>
              </div>
            </div>
            {method === 'COD' && <CheckCircle2 className="w-6 h-6 text-ipsi-yellow" />}
          </button>
        </div>

        {method === 'Transfer' && (
          <div className="space-y-6 mb-8">
            <div className="bg-gray-50 rounded-2xl p-6">
              <p className="text-xs font-bold text-gray-400 uppercase mb-4">Informasi Rekening</p>
              <div className="space-y-2">
                <p className="text-lg font-black text-ipsi-black">{BANK_INFO.bankName}</p>
                <p className="text-2xl font-black text-ipsi-yellow tracking-wider">{BANK_INFO.accountNumber}</p>
                <p className="text-sm font-bold text-gray-500">A/N {BANK_INFO.accountHolder}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Catatan Transfer:</p>
                <p className="text-sm text-ipsi-black">Harap sertakan nama official: <span className="font-black text-ipsi-yellow bg-ipsi-black px-2 py-0.5 rounded">{official.name}</span> pada berita transfer.</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Upload Bukti Transfer</p>
              <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-ipsi-yellow transition-colors group">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-ipsi-yellow/10 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-ipsi-yellow" />
                  </div>
                  <p className="text-sm font-bold text-gray-600">
                    {proofFile ? proofFile.name : 'Klik atau seret gambar bukti transfer'}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase">Format: JPG, PNG (Maks 2MB)</p>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 p-4 bg-ipsi-yellow/5 border border-ipsi-yellow/20 rounded-2xl cursor-pointer group">
              <input 
                type="checkbox" 
                checked={hasTransferred}
                onChange={(e) => setHasTransferred(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-gray-300 text-ipsi-yellow focus:ring-ipsi-yellow"
              />
              <span className="text-sm font-bold text-ipsi-black group-hover:text-ipsi-yellow transition-colors">
                SAYA KONFIRMASI BAHWA SAYA SUDAH MELAKUKAN TRANSFER SESUAI NOMINAL DAN MENYERTAKAN NAMA OFFICIAL.
              </span>
            </label>
          </div>
        )}

        <button 
          onClick={() => onFinish(method)}
          disabled={method === 'Transfer' && (!hasTransferred || !proofFile)}
          className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-lg ${
            (method === 'Transfer' && (!hasTransferred || !proofFile)) 
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
            : 'bg-ipsi-black text-white hover:bg-ipsi-yellow hover:text-ipsi-black'
          }`}
        >
          KONFIRMASI PEMBAYARAN
        </button>
      </div>
    </div>
  );
};

const Receipt = ({ athletes, official, method }: any) => {
  const total = athletes.length * REGISTRATION_FEE;
  const receiptNo = `INV-${Date.now()}`;
  const receiptRef = React.useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (receiptRef.current) {
      try {
        // Wait a bit for images to be ready
        await new Promise(resolve => setTimeout(resolve, 500));
        const dataUrl = await htmlToImage.toPng(receiptRef.current, {
          backgroundColor: '#FFFFFF',
          pixelRatio: 3,
          cacheBust: true,
        });
        const link = document.createElement('a');
        link.download = `Struk-IPSI-${receiptNo}.png`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
        alert('Gagal mendownload gambar. Pastikan koneksi internet stabil.');
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (receiptRef.current) {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const dataUrl = await htmlToImage.toPng(receiptRef.current, {
          backgroundColor: '#FFFFFF',
          pixelRatio: 2,
          cacheBust: true,
        });
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Struk-IPSI-${receiptNo}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Gagal mendownload PDF.');
      }
    }
  };

  const handleDownloadWord = () => {
    if (receiptRef.current) {
      const content = receiptRef.current.innerHTML;
      const style = `
        <style>
          body { font-family: sans-serif; }
          .font-black { font-weight: 900; }
          .font-bold { font-weight: 700; }
          .text-2xl { font-size: 24px; }
          .text-sm { font-size: 14px; }
          .text-xs { font-size: 12px; }
          .text-gray-400 { color: #9ca3af; }
          .text-gray-500 { color: #6b7280; }
          .bg-ipsi-black { background-color: #1A1A1A; color: white; }
          .text-ipsi-yellow { color: #FFD700; }
          .border-t-8 { border-top: 8px solid #FFD700; }
          .p-8 { padding: 32px; }
          .mb-8 { margin-bottom: 32px; }
          .flex { display: flex; }
          .justify-between { justify-content: space-between; }
          .grid { display: grid; }
          .grid-cols-2 { grid-template-columns: 1fr 1fr; }
          .gap-8 { gap: 32px; }
        </style>
      `;
      const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
            "xmlns:w='urn:schemas-microsoft-com:office:word' "+
            "xmlns='http://www.w3.org/TR/REC-html40'>"+
            "<head><meta charset='utf-8'><title>Struk IPSI</title>"+style+"</head><body>";
      const footer = "</body></html>";
      const sourceHTML = header + content + footer;
      
      const blob = new Blob(['\ufeff', sourceHTML], {
        type: 'application/msword'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Struk-IPSI-${receiptNo}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div ref={receiptRef} className="bg-white rounded-3xl p-8 shadow-2xl border-t-8 border-ipsi-yellow">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-black text-ipsi-black">STRUK PENDAFTARAN</h2>
            <p className="text-gray-400 text-sm">No: {receiptNo}</p>
          </div>
          <div className="w-16 h-16">
             <img 
               src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Logo_IPSI.png" 
               alt="IPSI Logo" 
               className="w-full h-full object-contain" 
               referrerPolicy="no-referrer"
               crossOrigin="anonymous"
             />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-100">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Official</p>
            <p className="font-bold">{official.name}</p>
            <p className="text-xs text-gray-500">{official.perguruan}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Metode Bayar</p>
            <p className="font-bold">{method}</p>
            <p className="text-xs text-gray-500">{method === 'Transfer' ? 'Sudah Transfer' : 'Bayar di TM'}</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daftar Atlet</p>
          {athletes.map((a: Athlete) => (
            <div key={a.id} className="flex justify-between items-center py-2">
              <div>
                <p className="font-bold text-sm">{a.name}</p>
                <div className="flex flex-wrap gap-x-2 text-[10px] text-gray-400">
                  <span>{a.category}</span>
                  <span>•</span>
                  <span>{a.classes[0]}</span>
                  {a.classes[1] && (
                    <>
                      <span>•</span>
                      <span>{a.classes[1]} ({a.weight}kg)</span>
                    </>
                  )}
                </div>
              </div>
              <p className="font-bold text-sm">Rp {REGISTRATION_FEE.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="bg-ipsi-black text-white p-6 rounded-2xl flex justify-between items-center mb-8">
          <p className="font-bold">TOTAL</p>
          <p className="text-2xl font-black text-ipsi-yellow">Rp {total.toLocaleString()}</p>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400 italic font-bold">Harap simpan bukti ini dan tunjukkan saat Technical Meeting.</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-center">
        <button 
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-600 px-4 py-4 rounded-2xl text-sm font-bold hover:bg-gray-200 transition-all"
        >
          <FileText className="w-5 h-5" />
          Cetak Struk
        </button>
        <button 
          onClick={handleDownload}
          className="inline-flex items-center justify-center gap-2 bg-ipsi-yellow text-ipsi-black px-4 py-4 rounded-2xl text-sm font-bold hover:bg-white transition-all shadow-lg"
        >
          <ImageIcon className="w-5 h-5" />
          Download Gambar
        </button>
        <button 
          onClick={handleDownloadPDF}
          className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-4 rounded-2xl text-sm font-bold hover:bg-red-700 transition-all shadow-lg"
        >
          <FileText className="w-5 h-5" />
          Download PDF
        </button>
        <button 
          onClick={handleDownloadWord}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-4 rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg"
        >
          <FileText className="w-5 h-5" />
          Download Word
        </button>
      </div>

      <div className="mt-12 bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
        <h3 className="text-white font-black mb-4">PENTING! GABUNG GRUP OFFICIAL</h3>
        <p className="text-white/60 text-sm mb-6">Silakan bergabung ke grup WhatsApp Official untuk mendapatkan informasi teknis dan jadwal pertandingan terkini.</p>
        <a 
          href="https://chat.whatsapp.com/invite/example" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-4 rounded-2xl font-black hover:scale-105 transition-transform shadow-xl"
        >
          <Users className="w-6 h-6" />
          GABUNG GRUP WHATSAPP
        </a>
      </div>
    </div>
  );
};

const HistoryPage = ({ history, onViewReceipt }: { history: Registration[], onViewReceipt: (reg: Registration) => void }) => (
  <div className="max-w-4xl mx-auto px-4 py-24">
    <h2 className="text-4xl font-black text-white mb-12 text-center">RIWAYAT PENDAFTARAN</h2>
    {history.length === 0 ? (
      <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
        <p className="text-white/50">Belum ada riwayat pendaftaran.</p>
      </div>
    ) : (
      <div className="space-y-6">
        {history.map((reg, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-8 shadow-xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[10px] font-bold text-ipsi-yellow uppercase tracking-widest mb-1">Invoice</p>
                <h3 className="text-xl font-black text-ipsi-black">{reg.id}</h3>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="bg-ipsi-black text-white px-4 py-2 rounded-xl text-xs font-bold">
                  {reg.method}
                </div>
                <p className="text-[10px] text-gray-400 font-bold">{new Date(reg.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              {reg.athletes.map((a, i) => (
                <div key={i} className="flex justify-between text-sm border-b border-gray-50 pb-2">
                  <span className="font-bold">{a.name}</span>
                  <span className="text-gray-500">{a.category}</span>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex justify-between w-full sm:w-auto gap-8 items-center">
                <p className="font-bold text-gray-400 text-xs uppercase tracking-widest">TOTAL</p>
                <p className="text-xl font-black text-ipsi-black">Rp {(reg.athletes.length * REGISTRATION_FEE).toLocaleString()}</p>
              </div>
              <button 
                onClick={() => onViewReceipt(reg)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-ipsi-yellow text-ipsi-black px-6 py-3 rounded-2xl text-sm font-bold hover:bg-ipsi-black hover:text-white transition-all shadow-md"
              >
                <FileText className="w-4 h-4" />
                Lihat & Download Struk
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const ChairmanSection = () => (
  <section className="py-24 bg-ipsi-black">
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center gap-12 bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-16">
        <div className="w-64 h-80 relative flex-shrink-0">
          <div className="absolute inset-0 bg-ipsi-yellow rounded-3xl rotate-6"></div>
          <div className="absolute inset-0 overflow-hidden rounded-3xl border-4 border-ipsi-yellow shadow-2xl">
            <img 
              src="https://picsum.photos/seed/ruben/400/600" 
              alt="H. RUBEN R PRABU FAZA, SH" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
            "Pencak Silat <br />
            <span className="text-ipsi-yellow">Budaya Bangsa</span>"
          </h2>
          <p className="text-white/60 leading-relaxed mb-8 max-w-2xl">
            Selamat datang di portal resmi pendaftaran IPSI Kabupaten Pekalongan. Kami berkomitmen untuk terus memajukan prestasi pencak silat di wilayah kita melalui sistem yang transparan, modern, dan profesional. Mari kita junjung tinggi sportivitas dan persaudaraan.
          </p>
          <div className="bg-ipsi-yellow inline-block px-6 py-3 rounded-2xl">
            <p className="text-ipsi-black font-black text-lg uppercase">H. RUBEN R PRABU FAZA, SH.</p>
            <p className="text-ipsi-black/60 text-[10px] font-bold uppercase tracking-widest">Ketua IPSI Kabupaten Pekalongan</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const NewsPage = ({ news }: { news: News[] }) => (
  <div className="max-w-6xl mx-auto px-4 py-24">
    <h2 className="text-4xl font-black text-white mb-4 text-center">BERITA TERKINI</h2>
    <p className="text-white/50 text-center mb-16 uppercase tracking-widest text-xs">Informasi Terbaru IPSI Kabupaten Pekalongan</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {news.map((item) => (
        <motion.div 
          key={item.id}
          whileHover={{ y: -10 }}
          className="bg-white rounded-[32px] overflow-hidden shadow-2xl group"
        >
          <div className="h-56 bg-ipsi-black relative overflow-hidden">
            <img 
              src={item.image || 'https://picsum.photos/seed/news/800/600'} 
              alt={item.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 bg-ipsi-yellow text-ipsi-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              {item.date}
            </div>
          </div>
          <div className="p-8">
            <h3 className="text-xl font-black text-ipsi-black mb-4 leading-tight group-hover:text-ipsi-yellow transition-colors">{item.title}</h3>
            <p className="text-gray-500 text-sm mb-8 line-clamp-3 leading-relaxed">
              {item.summary}
            </p>
            <button className="flex items-center gap-2 text-sm font-black text-ipsi-black hover:gap-4 transition-all">
              BACA SELENGKAPNYA <ChevronRight className="w-4 h-4 text-ipsi-yellow" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const AdminDashboard = ({ 
  history, 
  officials, 
  onUpdateHistory,
  news,
  onUpdateNews
}: { 
  history: Registration[], 
  officials: Official[], 
  onUpdateHistory: (newHistory: Registration[]) => void,
  news: News[],
  onUpdateNews: (newNews: News[]) => void
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Registration | null>(null);
  
  // News management state
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newNews, setNewNews] = useState<Partial<News>>({
    title: '',
    summary: '',
    content: '',
    image: '',
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()
  });

  useEffect(() => {
    const savedSessions = localStorage.getItem('ipsi_active_sessions');
    if (savedSessions) {
      setActiveSessions(JSON.parse(savedSessions));
    }
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data pendaftaran ini?')) {
      onUpdateHistory(history.filter(reg => reg.id !== id));
    }
  };

  const handleStartEdit = (reg: Registration) => {
    setEditingId(reg.id);
    setEditData(JSON.parse(JSON.stringify(reg))); // Deep clone
  };

  const handleSaveEdit = () => {
    if (editData) {
      const newHistory = history.map(reg => reg.id === editData.id ? editData : reg);
      onUpdateHistory(newHistory);
      setEditingId(null);
      setEditData(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData(null);
  };

  const handleUpdateAthlete = (athleteId: string, field: keyof Athlete, value: any) => {
    if (editData) {
      const updatedAthletes = editData.athletes.map(a => {
        if (a.id === athleteId) {
          if (field === 'classes') {
            return { ...a, [field]: value.split(',').map((s: string) => s.trim()) };
          }
          return { ...a, [field]: value };
        }
        return a;
      });
      setEditData({ ...editData, athletes: updatedAthletes });
    }
  };

  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    const newsItem: News = {
      ...newNews as News,
      id: Date.now().toString()
    };
    onUpdateNews([newsItem, ...news]);
    setIsAddingNews(false);
    setNewNews({
      title: '',
      summary: '',
      content: '',
      image: '',
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()
    });
    alert('Berita berhasil ditambahkan!');
  };

  const handleDeleteNews = (id: string) => {
    if (window.confirm('Hapus berita ini?')) {
      onUpdateNews(news.filter(n => n.id !== id));
    }
  };

  const exportToExcel = () => {
    const dataToExport = history.flatMap(reg => 
      reg.athletes.map(athlete => ({
        'No. Invoice': reg.id,
        'Tanggal': new Date(reg.timestamp).toLocaleString('id-ID'),
        'Official': reg.official.name,
        'Perguruan': reg.official.perguruan,
        'Metode': reg.method,
        'Nama Atlet': athlete.name,
        'NIK': athlete.nik,
        'Gender': athlete.gender,
        'Kategori': athlete.category,
        'Kelas': athlete.classes[0],
        'Sub-Kelas': athlete.classes[1] || '-',
        'Berat (kg)': athlete.weight,
        'Tinggi (cm)': athlete.height,
        'Kontingen': athlete.kontingen,
        'Biaya': REGISTRATION_FEE
      }))
    );

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Pendaftar");
    
    // Generate filename with current date
    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `Data_Pendaftar_IPSI_Pekalongan_${dateStr}.xlsx`);
  };

  const filteredHistory = history.filter(reg => 
    reg.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.official.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.official.perguruan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <h2 className="text-4xl font-black text-white">ADMIN DASHBOARD</h2>
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <button 
            onClick={exportToExcel}
            className="bg-emerald-500 text-white px-6 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg"
          >
            <Download className="w-5 h-5" />
            EXPORT EXCEL
          </button>
          <div className="relative flex-1 md:w-96">
            <input 
              type="text" 
              placeholder="Cari Invoice, Nama Official, atau Perguruan..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-ipsi-yellow transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* News Management Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-white flex items-center gap-3">
            <Newspaper className="w-6 h-6 text-ipsi-yellow" />
            MANAJEMEN BERITA
          </h3>
          <button 
            onClick={() => setIsAddingNews(!isAddingNews)}
            className="bg-ipsi-yellow text-ipsi-black px-6 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-white transition-all"
          >
            {isAddingNews ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAddingNews ? 'Batal' : 'Tambah Berita'}
          </button>
        </div>

        {isAddingNews && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white rounded-[32px] p-8 mb-8 shadow-2xl"
          >
            <form onSubmit={handleAddNews} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Judul Berita</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                    value={newNews.title}
                    onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Ringkasan (Summary)</label>
                  <textarea 
                    required
                    rows={3}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                    value={newNews.summary}
                    onChange={(e) => setNewNews({ ...newNews, summary: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">URL Gambar</label>
                  <input 
                    type="text" 
                    placeholder="https://..."
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                    value={newNews.image}
                    onChange={(e) => setNewNews({ ...newNews, image: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Konten Lengkap</label>
                  <textarea 
                    required
                    rows={8}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3"
                    value={newNews.content}
                    onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-ipsi-black text-white py-4 rounded-xl font-black hover:bg-ipsi-yellow hover:text-ipsi-black transition-all"
                >
                  PUBLIKASIKAN BERITA
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <div key={item.id} className="bg-white/5 rounded-2xl p-6 border border-white/5 relative group">
                <button 
                  onClick={() => handleDeleteNews(item.id)}
                  className="absolute top-4 right-4 p-2 bg-red-500/10 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <p className="text-ipsi-yellow text-[10px] font-bold uppercase tracking-widest mb-2">{item.date}</p>
                <h4 className="text-white font-bold mb-2 line-clamp-1">{item.title}</h4>
                <p className="text-white/40 text-xs line-clamp-2 mb-4">{item.summary}</p>
                <div className="h-32 bg-white/5 rounded-xl overflow-hidden">
                  <img 
                    src={item.image || 'https://picsum.photos/seed/news/400/300'} 
                    alt={item.title}
                    className="w-full h-full object-cover opacity-50"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
          <p className="text-ipsi-yellow font-black text-xs uppercase tracking-widest mb-2">Total Pendaftar</p>
          <p className="text-4xl font-black text-white">{history.reduce((acc, reg) => acc + reg.athletes.length, 0)}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
          <p className="text-ipsi-yellow font-black text-xs uppercase tracking-widest mb-2">Total Invoice</p>
          <p className="text-4xl font-black text-white">{history.length}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
          <p className="text-ipsi-yellow font-black text-xs uppercase tracking-widest mb-2">Total Pendapatan</p>
          <p className="text-4xl font-black text-white">Rp {(history.reduce((acc, reg) => acc + reg.athletes.length, 0) * REGISTRATION_FEE).toLocaleString()}</p>
        </div>
      </div>

      {/* Active Sessions Section */}
      <div className="mb-12">
        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
          <LogIn className="w-6 h-6 text-ipsi-yellow" />
          SIAPA SAJA YANG LOGIN (AKTIF)
        </h3>
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
          {activeSessions.length === 0 ? (
            <p className="text-white/30 text-center py-4">Belum ada aktivitas login tercatat.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeSessions.map((session, idx) => (
                <div key={idx} className="bg-white/5 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-ipsi-yellow rounded-full flex items-center justify-center text-ipsi-black font-black">
                    {session.official.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{session.official.name}</p>
                    <p className="text-white/40 text-[10px] uppercase tracking-widest">{session.official.perguruan}</p>
                    <p className="text-ipsi-yellow/60 text-[9px] font-bold mt-1">
                      {new Date(session.lastActive).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Detailed Input Table Section */}
      <div className="mb-12">
        <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
          <FileText className="w-6 h-6 text-ipsi-yellow" />
          TABEL INPUTAN DATA (SEMUA ATLET)
        </h3>
        <div className="bg-white rounded-[32px] p-8 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <th className="pb-4">No. Invoice</th>
                  <th className="pb-4">Nama Atlet</th>
                  <th className="pb-4">Kategori</th>
                  <th className="pb-4">Usia / Kelas</th>
                  <th className="pb-4">Berat</th>
                  <th className="pb-4">Official / Perguruan</th>
                  <th className="pb-4">Metode</th>
                  <th className="pb-4">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredHistory.flatMap(reg => 
                  reg.athletes.map((athlete, aIdx) => (
                    <tr key={`${reg.id}-${athlete.id}`} className="text-sm hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-black text-ipsi-black">{reg.id}</td>
                      <td className="py-4 font-bold text-ipsi-black">{athlete.name}</td>
                      <td className="py-4 text-gray-600">{athlete.category}</td>
                      <td className="py-4 text-gray-600">
                        <p className="font-bold">{athlete.classes[0]}</p>
                        <p className="text-xs text-gray-400">{athlete.classes[1] || '-'}</p>
                      </td>
                      <td className="py-4 text-gray-600 font-bold">{athlete.weight}kg</td>
                      <td className="py-4">
                        <p className="font-bold text-xs">{reg.official.name}</p>
                        <p className="text-[10px] text-gray-400">{reg.official.perguruan}</p>
                      </td>
                      <td className="py-4">
                        <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-ipsi-yellow/10 text-ipsi-yellow">
                          {reg.method}
                        </span>
                      </td>
                      <td className="py-4 text-xs text-gray-400">{new Date(reg.timestamp).toLocaleDateString('id-ID')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detailed Cards Section (Existing) */}
      <div className="space-y-6">
        <h3 className="text-xl font-black text-white mb-6">DETAIL INVOICE</h3>
        {filteredHistory.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
            <p className="text-white/50">Tidak ada data pendaftaran ditemukan.</p>
          </div>
        ) : (
          filteredHistory.map((reg) => {
            const isEditing = editingId === reg.id;
            const data = isEditing ? editData! : reg;

            return (
              <div key={reg.id} className="bg-white rounded-[32px] p-8 shadow-2xl overflow-hidden border-2 border-transparent hover:border-ipsi-yellow/20 transition-all">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      {isEditing ? (
                        <select 
                          value={data.method}
                          onChange={(e) => setEditData({ ...data, method: e.target.value as any })}
                          className="bg-ipsi-yellow text-ipsi-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest focus:outline-none"
                        >
                          <option value="Transfer">Transfer</option>
                          <option value="COD">COD</option>
                        </select>
                      ) : (
                        <span className="bg-ipsi-yellow text-ipsi-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                          {reg.method}
                        </span>
                      )}
                      <p className="text-gray-400 text-xs font-bold">{new Date(reg.timestamp).toLocaleString('id-ID')}</p>
                    </div>
                    <h3 className="text-2xl font-black text-ipsi-black">{reg.id}</h3>
                  </div>
                  <div className="flex gap-3">
                    {isEditing ? (
                      <>
                        <button 
                          onClick={handleSaveEdit}
                          className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Simpan
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="flex items-center gap-2 bg-gray-100 text-gray-600 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-gray-200 transition-all"
                        >
                          <X className="w-4 h-4" />
                          Batal
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => handleStartEdit(reg)}
                          className="flex items-center gap-2 bg-ipsi-yellow text-ipsi-black px-6 py-3 rounded-2xl text-sm font-bold hover:bg-ipsi-black hover:text-white transition-all shadow-md"
                        >
                          <FileText className="w-4 h-4" />
                          Ubah Data
                        </button>
                        <button 
                          onClick={() => handleDelete(reg.id)}
                          className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all"
                          title="Hapus Pendaftaran"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Data Penginput (Official)</p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-ipsi-black rounded-full flex items-center justify-center text-ipsi-yellow font-black">
                        {data.official.name[0]}
                      </div>
                      <div className="flex-1 space-y-2">
                        {isEditing ? (
                          <>
                            <input 
                              type="text" 
                              value={data.official.name}
                              onChange={(e) => setEditData({ ...data, official: { ...data.official, name: e.target.value } })}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ipsi-yellow"
                              placeholder="Nama Official"
                            />
                            <input 
                              type="text" 
                              value={data.official.perguruan}
                              onChange={(e) => setEditData({ ...data, official: { ...data.official, perguruan: e.target.value } })}
                              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-ipsi-yellow"
                              placeholder="Perguruan"
                            />
                          </>
                        ) : (
                          <>
                            <p className="font-black text-ipsi-black">{reg.official.name}</p>
                            <p className="text-xs text-gray-500">{reg.official.perguruan}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Ringkasan Biaya</p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-gray-600">{data.athletes.length} Atlet</p>
                        <p className="text-xs text-gray-400">x Rp {REGISTRATION_FEE.toLocaleString()}</p>
                      </div>
                      <p className="text-xl font-black text-ipsi-black">Rp {(data.athletes.length * REGISTRATION_FEE).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Daftar Atlet Terdaftar</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                          <th className="pb-4">Nama Atlet</th>
                          <th className="pb-4">Kategori</th>
                          <th className="pb-4">Usia / Kelas Berat</th>
                          <th className="pb-4">Berat (kg)</th>
                          <th className="pb-4">Kontingen</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {data.athletes.map((athlete) => (
                          <tr key={athlete.id} className="text-sm">
                            <td className="py-4 font-bold text-ipsi-black">
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  value={athlete.name}
                                  onChange={(e) => handleUpdateAthlete(athlete.id, 'name', e.target.value)}
                                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-ipsi-yellow"
                                />
                              ) : athlete.name}
                            </td>
                            <td className="py-4 text-gray-600">
                              {isEditing ? (
                                <select 
                                  value={athlete.category}
                                  onChange={(e) => handleUpdateAthlete(athlete.id, 'category', e.target.value)}
                                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-ipsi-yellow"
                                >
                                  <option value="Tanding">Tanding</option>
                                  <option value="Seni">Seni</option>
                                </select>
                              ) : athlete.category}
                            </td>
                            <td className="py-4 text-gray-600">
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  value={athlete.classes.join(', ')}
                                  onChange={(e) => handleUpdateAthlete(athlete.id, 'classes', e.target.value)}
                                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-ipsi-yellow"
                                  placeholder="Pisahkan dengan koma"
                                />
                              ) : (
                                <>
                                  <p className="font-bold">{athlete.classes[0]}</p>
                                  <p className="text-xs text-gray-400">{athlete.classes[1] || '-'}</p>
                                </>
                              )}
                            </td>
                            <td className="py-4 text-gray-600">
                              {isEditing ? (
                                <input 
                                  type="number" 
                                  value={athlete.weight}
                                  onChange={(e) => handleUpdateAthlete(athlete.id, 'weight', Number(e.target.value))}
                                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-ipsi-yellow"
                                />
                              ) : `${athlete.weight} kg`}
                            </td>
                            <td className="py-4 text-gray-600">
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  value={athlete.kontingen}
                                  onChange={(e) => handleUpdateAthlete(athlete.id, 'kontingen', e.target.value)}
                                  className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-ipsi-yellow"
                                />
                              ) : athlete.kontingen}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

const Schedule = () => (
  <div className="max-w-4xl mx-auto px-4 py-24">
    <h2 className="text-4xl font-black text-white mb-12 text-center">JADWAL PELAKSANAAN</h2>
    <div className="space-y-6">
      {[
        { date: '1 Maret - 10 April 2026', title: 'Pendaftaran Online', desc: 'Melalui website resmi IPSI Kabupaten Pekalongan' },
        { date: '12 April 2026', title: 'Technical Meeting', desc: 'Pukul 09:00 WIB di GPU Kabupaten Pekalongan' },
        { date: '14 April 2026', title: 'Timbang Badan & Verifikasi', desc: 'Pukul 13:00 WIB di GPU Kabupaten Pekalongan' },
        { date: '15 - 20 April 2026', title: 'Pelaksanaan Pertandingan', desc: 'IPSI CUP 3 Invitasi Pelajar' },
      ].map((item, idx) => (
        <div key={idx} className="bg-white rounded-3xl p-8 flex flex-col md:flex-row gap-6 items-start md:items-center shadow-xl">
          <div className="bg-ipsi-yellow text-ipsi-black px-6 py-3 rounded-2xl font-black text-sm whitespace-nowrap">
            {item.date}
          </div>
          <div>
            <h3 className="text-xl font-black text-ipsi-black mb-1">{item.title}</h3>
            <p className="text-gray-500">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EventsPage = ({ onSelectEvent }: any) => (
  <div className="max-w-6xl mx-auto px-4 py-24">
    <h2 className="text-4xl font-black text-white mb-4 text-center">EVENT KEJUARAAN 2026</h2>
    <p className="text-white/50 text-center mb-16">Daftar agenda kejuaraan pencak silat di Kabupaten Pekalongan</p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {EVENTS.map((event) => (
        <motion.div 
          key={event.id}
          whileHover={{ y: -10 }}
          className="bg-white rounded-3xl overflow-hidden shadow-2xl cursor-pointer group"
          onClick={() => onSelectEvent(event)}
        >
          <div className="h-48 bg-ipsi-black relative overflow-hidden">
            <div className="absolute inset-0 bg-ipsi-yellow/20 group-hover:bg-ipsi-yellow/40 transition-colors"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <Trophy className="w-16 h-16 text-ipsi-yellow" />
            </div>
          </div>
          <div className="p-6">
            <p className="text-[10px] font-bold text-ipsi-yellow uppercase tracking-widest mb-2">{event.type}</p>
            <h3 className="text-xl font-black text-ipsi-black mb-4">{event.title}</h3>
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
              <Calendar className="w-4 h-4" />
              <span>{event.date}</span>
            </div>
            <button className="w-full bg-ipsi-black text-white py-3 rounded-xl font-bold text-sm group-hover:bg-ipsi-yellow group-hover:text-ipsi-black transition-all">
              LIHAT DETAIL
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const TrainingPage = () => (
  <div className="max-w-6xl mx-auto px-4 py-24 text-center">
    <h2 className="text-4xl font-black text-white mb-4">PENATARAN & PELATIHAN</h2>
    <p className="text-white/50 mb-16">Peningkatan kapasitas SDM Pencak Silat Kabupaten Pekalongan</p>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {TRAINING.map((item) => (
        <div key={item.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-left">
          <div className="w-12 h-12 bg-ipsi-yellow rounded-2xl flex items-center justify-center mb-6">
            <Users className="w-6 h-6 text-ipsi-black" />
          </div>
          <h3 className="text-xl font-black text-white mb-2">{item.title}</h3>
          <p className="text-ipsi-yellow text-sm font-bold mb-6">{item.date}</p>
          <button className="text-white/70 text-sm font-bold flex items-center gap-2 hover:text-ipsi-yellow transition-colors">
            Daftar Pelatihan <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [activePage, setActivePage] = useState('login');
  const [loggedInOfficial, setLoggedInOfficial] = useState<Official | null>(null);
  const [cart, setCart] = useState<Athlete[]>([]);
  const [history, setHistory] = useState<Registration[]>([]);
  const [method, setMethod] = useState<'Transfer' | 'COD'>('Transfer');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<Registration | null>(null);
  const [news, setNews] = useState<News[]>([]);

  // Load persisted data on mount
  useEffect(() => {
    const savedNews = localStorage.getItem('ipsi_news');
    if (savedNews) {
      try {
        setNews(JSON.parse(savedNews));
      } catch (e) {
        console.error('Failed to parse saved news');
      }
    } else {
      // Default news if none exists
      const defaultNews: News[] = [
        {
          id: '1',
          title: 'Bagan Pertandingan IPSI Cup 3 Telah Dirilis',
          date: '27 FEB 2026',
          summary: 'Bagan pertandingan resmi untuk IPSI Cup 3 Invitasi Pelajar kini sudah dapat diakses oleh seluruh official.',
          content: 'Bagan pertandingan resmi untuk IPSI Cup 3 Invitasi Pelajar kini sudah dapat diakses oleh seluruh official. Silakan cek di menu jadwal atau hubungi panitia untuk salinan fisik.',
          image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=800'
        },
        {
          id: '2',
          title: 'Download Proposal Kegiatan IPSI Cup 3',
          date: '25 FEB 2026',
          summary: 'Panitia telah merilis proposal resmi kegiatan IPSI Cup 3 untuk keperluan administrasi sekolah/perguruan.',
          content: 'Panitia telah merilis proposal resmi kegiatan IPSI Cup 3 untuk keperluan administrasi sekolah/perguruan. Silakan download melalui link yang tersedia.',
          image: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&q=80&w=800'
        }
      ];
      setNews(defaultNews);
      localStorage.setItem('ipsi_news', JSON.stringify(defaultNews));
    }
    const savedHistory = localStorage.getItem('ipsi_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Failed to parse saved history');
      }
    }

    const savedSession = localStorage.getItem('ipsi_session');
    if (savedSession) {
      try {
        const { official, timestamp } = JSON.parse(savedSession);
        const now = Date.now();
        const twoHours = 2 * 60 * 60 * 1000;

        if (now - timestamp > twoHours) {
          // Session expired
          localStorage.removeItem('ipsi_session');
          setLoggedInOfficial(null);
          setActivePage('login');
          alert('Sesi Anda telah berakhir (maksimal 2 jam). Silakan login kembali.');
        } else {
          setLoggedInOfficial(official);
          setActivePage('home'); // Go to home if already logged in
          
          // Load cart for this specific official
          const savedCart = localStorage.getItem(`ipsi_cart_${official.id}`);
          if (savedCart) {
            setCart(JSON.parse(savedCart));
          }
        }
      } catch (e) {
        console.error('Failed to parse saved session');
      }
    }
  }, []);

  // Persist cart whenever it changes (tied to official)
  useEffect(() => {
    if (loggedInOfficial) {
      localStorage.setItem(`ipsi_cart_${loggedInOfficial.id}`, JSON.stringify(cart));
    }
  }, [cart, loggedInOfficial]);

  // Persist history whenever it changes
  useEffect(() => {
    localStorage.setItem('ipsi_history', JSON.stringify(history));
  }, [history]);

  // Persist news whenever it changes
  useEffect(() => {
    localStorage.setItem('ipsi_news', JSON.stringify(news));
  }, [news]);

  const handleLogin = (official: Official) => {
    setLoggedInOfficial(official);
    const now = Date.now();
    const session = {
      official,
      timestamp: now
    };
    localStorage.setItem('ipsi_session', JSON.stringify(session));
    
    // Track active sessions for admin (simulated)
    const savedActiveSessions = localStorage.getItem('ipsi_active_sessions');
    let activeSessions = savedActiveSessions ? JSON.parse(savedActiveSessions) : [];
    // Remove old session for this official if exists
    activeSessions = activeSessions.filter((s: any) => s.official.id !== official.id);
    // Add new session
    activeSessions.push({ official, lastActive: now });
    // Keep only last 10 sessions
    if (activeSessions.length > 10) activeSessions.shift();
    localStorage.setItem('ipsi_active_sessions', JSON.stringify(activeSessions));
    
    // Load cart for this specific official
    const savedCart = localStorage.getItem(`ipsi_cart_${official.id}`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      setCart([]);
    }
    
    setActivePage('register');
  };

  const handleLogout = () => {
    setLoggedInOfficial(null);
    setCart([]);
    localStorage.removeItem('ipsi_session');
    setActivePage('home');
  };

  const addAthlete = (athlete: Athlete) => {
    setCart([...cart, athlete]);
  };

  const removeAthlete = (id: string) => {
    setCart(cart.filter(a => a.id !== id));
  };

  const handleCheckout = () => {
    setActivePage('checkout');
  };

  const handleViewReceipt = (reg: Registration) => {
    setSelectedHistoryItem(reg);
    setMethod(reg.method);
    setActivePage('receipt');
  };

  const handleFinish = (payMethod: 'Transfer' | 'COD') => {
    setMethod(payMethod);
    
    // Create registration record for history
    const newRegistration: Registration = {
      id: `INV-${Date.now()}`,
      official: loggedInOfficial!,
      athletes: [...cart],
      method: payMethod,
      timestamp: new Date().toISOString()
    };
    
    setHistory([newRegistration, ...history]);
    setSelectedHistoryItem(newRegistration); // Set for receipt view
    setCart([]); // Clear cart state
    if (loggedInOfficial) {
      localStorage.removeItem(`ipsi_cart_${loggedInOfficial.id}`); // Clear specific official's cart in storage
    }
    setActivePage('receipt');
  };

  return (
    <div className="min-h-screen bg-ipsi-black selection:bg-ipsi-yellow selection:text-ipsi-black">
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        loggedInOfficial={loggedInOfficial}
        onLogout={handleLogout}
        cartCount={cart.length}
      />

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {activePage === 'home' && (
              <>
                <Hero onStartRegistration={() => loggedInOfficial ? setActivePage('register') : setActivePage('login')} />
                <ChairmanSection />
                <AboutSection />
              </>
            )}
            
            {activePage === 'login' && (
              <Login onLoginSuccess={handleLogin} />
            )}

            {activePage === 'register' && loggedInOfficial && (
              <RegistrationForm 
                official={loggedInOfficial} 
                onAddAthlete={addAthlete} 
              />
            )}

            {activePage === 'cart' && (
              <Cart 
                athletes={cart} 
                onRemoveAthlete={removeAthlete} 
                onCheckout={handleCheckout}
              />
            )}

            {activePage === 'checkout' && (
              <Checkout 
                athletes={cart} 
                official={loggedInOfficial}
                onFinish={handleFinish}
              />
            )}

            {activePage === 'receipt' && (
              <Receipt 
                athletes={selectedHistoryItem?.athletes || cart} 
                official={selectedHistoryItem?.official || loggedInOfficial} 
                method={method}
              />
            )}

            {activePage === 'events' && (
              <EventsPage onSelectEvent={(e: any) => e.id === 'ipsi-cup-3' ? (loggedInOfficial ? setActivePage('register') : setActivePage('login')) : alert('Detail event segera hadir!')} />
            )}

            {activePage === 'training' && (
              <TrainingPage />
            )}

            {activePage === 'history' && (
              <HistoryPage history={history} onViewReceipt={handleViewReceipt} />
            )}

            {activePage === 'admin' && loggedInOfficial?.isAdmin && (
              <AdminDashboard 
                history={history} 
                officials={OFFICIALS} 
                onUpdateHistory={setHistory} 
                news={news}
                onUpdateNews={setNews}
              />
            )}

            {activePage === 'schedule' && (
              <Schedule />
            )}

            {activePage === 'news' && (
              <NewsPage news={news} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-ipsi-black border-t border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Logo_IPSI.png" alt="IPSI Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              <h2 className="text-white font-black">IPSI KAB PEKALONGAN</h2>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Organisasi resmi yang mewadahi seluruh perguruan pencak silat di wilayah Kabupaten Pekalongan.
            </p>
          </div>
          <div>
            <h3 className="text-ipsi-yellow font-bold mb-6 uppercase tracking-widest text-xs">Kontak Kami</h3>
            <ul className="space-y-4 text-white/60 text-sm">
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-ipsi-yellow" />
                {GPU_ADDRESS}
              </li>
              <li className="flex items-center gap-3">
                <Users className="w-4 h-4 text-ipsi-yellow" />
                Sekretariat: KONI Kab. Pekalongan
              </li>
              <li className="flex items-center gap-3">
                <span className="text-ipsi-yellow font-bold">WA:</span>
                085713408400
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-white/20 text-[10px] font-bold tracking-widest uppercase mb-2">
            © 2026 IPSI KABUPATEN PEKALONGAN. ALL RIGHTS RESERVED.
          </p>
          <p className="text-ipsi-yellow/40 text-[9px] font-black tracking-[0.3em] uppercase">
            CREATED BY NAVORA
          </p>
        </div>
      </footer>
    </div>
  );
}
