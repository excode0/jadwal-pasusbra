'use client'
 
import React, { useRef, useState } from 'react';
import { Calendar, Users, Megaphone, Award, ChevronsDown, Download, Loader } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { scheduleData, prokerData } from '@/data/scheduleData';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- VARIAN ANIMASI ---
const fadeIn = (delay: number = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, type: 'spring' as const, stiffness: 50 },
  viewport: { once: true, amount: 0.3 }
});

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

// --- KOMPONEN SVG KUSTOM ---
const SkyBackground = () => (
  <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#4a90e2', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#87ceeb', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#skyGradient)" />
  </svg>
);

const MountainSilhouette = () => (
  <svg width="100%" height="100%" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1920 1080">
    <path d="M0,1080 V800 L300,600 L600,850 L900,500 L1200,750 L1500,450 L1920,800 V1080 H0 Z" fill="#1a202c" opacity="0.7" />
    <path d="M0,1080 V850 L400,650 L700,800 L1000,600 L1300,850 L1600,550 L1920,900 V1080 H0 Z" fill="#2d3748" opacity="0.5" />
  </svg>
);

const WavingFlag = () => (
  <>
    <style jsx>{`
      @keyframes wave {
        0% { d: path("M10,10 C40,30 70,0 100,20 S160,80 190,50 V150 H10 Z"); }
        50% { d: path("M10,10 C40,0 70,30 100,10 S160,20 190,40 V150 H10 Z"); }
        100% { d: path("M10,10 C40,30 70,0 100,20 S160,80 190,50 V150 H10 Z"); }
      }
    `}</style>
    <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 200 200">
       <g transform="translate(450, 200) scale(3)">
        <rect x="5" y="5" width="5" height="150" fill="#606060" />
        <path fill="#FF0000" style={{ animation: 'wave 4s linear infinite' }}>
          <animate attributeName="d" values="M10,10 C40,30 70,0 100,20 S160,80 190,50 V80 H10 Z; M10,10 C40,0 70,40 100,10 S160,20 190,40 V80 H10 Z; M10,10 C40,30 70,0 100,20 S160,80 190,50 V80 H10 Z" dur="4s" repeatCount="indefinite" />
        </path>
        <path fill="#FFFFFF" style={{ animation: 'wave 4s linear infinite' }}>
           <animate attributeName="d" values="M10,80 C40,100 70,70 100,90 S160,150 190,120 V150 H10 Z; M10,80 C40,70 70,110 100,80 S160,90 190,110 V150 H10 Z; M10,80 C40,100 70,70 100,90 S160,150 190,120 V150 H10 Z" dur="4s" repeatCount="indefinite" />
        </path>
       </g>
    </svg>
  </>
);

// const PaskibraSilhouette = () => (
//   <svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1920 1080">
//     <g fill="black" transform="translate(910, 500)">
//       <circle cx="50" cy="80" r="15" />
//       <rect x="35" y="95" width="30" height="80" rx="5" />
//       <rect x="40" y="65" width="20" height="15" />
//       <circle cx="-20" cy="85" r="15" opacity="0.8" />
//       <rect x="-35" y="100" width="30" height="80" rx="5" opacity="0.8" />
//       <rect x="-30" y="70" width="20" height="15" opacity="0.8" />
//       <circle cx="120" cy="85" r="15" opacity="0.8" />
//       <rect x="105" y="100" width="30" height="80" rx="5" opacity="0.8" />
//       <rect x="110" y="70" width="20" height="15" opacity="0.8" />
//     </g>
//   </svg>
// );

// --- INTERFACE & KOMPONEN KARTU ---
// interface ScheduleCardProps {
//   date: string;
//   activities: { time: string; desc: string }[];
//   pemimpinApel: string;
//   tura: string;
// }

// const ScheduleCard: React.FC<ScheduleCardProps> = ({ date, activities, pemimpinApel, tura }) => (
//   <motion.div
//     variants={fadeIn(0.2)}
//     className="bg-gradient-to-br from-gray-800 to-gray-900 border border-white/20 p-6 rounded-2xl shadow-lg flex flex-col h-full group"
//   >
//     <div className="flex-grow">
//       <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center transition-colors group-hover:text-red-300">
//         <Calendar className="mr-3 h-5 w-5" />
//         {date}
//       </h3>
//       <ul className="space-y-3 text-white/90 text-sm">
//         {activities.map((a, i) => (
//           <li key={i} className="flex items-start">
//             <span className="font-mono bg-red-500/80 text-white rounded px-2 py-1 text-xs mr-3 leading-tight">{a.time}</span>
//             <span className="leading-tight">{a.desc}</span>
//           </li>
//         ))}
//       </ul>
//     </div>
//     <div className="text-white/80 text-sm space-y-2 mt-5 border-t border-white/20 pt-4">
//       <p className="flex items-center"><Megaphone className="mr-2 h-4 w-4 text-red-400" /> <strong className="font-semibold">Pemimpin Apel:</strong><span className="ml-2">{pemimpinApel}</span></p>
//       <p className="flex items-center"><Users className="mr-2 h-4 w-4 text-red-400" /> <strong className="font-semibold">Tura:</strong><span className="ml-2">{tura}</span></p>
//     </div>
//   </motion.div>
// );


// --- KOMPONEN UTAMA HALAMAN ---
export default function Home() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const scheduleRef = useRef<HTMLDivElement>(null); // Ref untuk menargetkan bagian jadwal
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ['start start', 'end start']
  });

  // Fungsi untuk menangani unduhan PDF
  const handleDownloadPdf = () => {
    const input = scheduleRef.current;
    if (!input) return;

    setIsGeneratingPdf(true);

    html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#111827', // Warna bg-gray-900
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('Jadwal-Latihan-PASUSBRA.pdf');
      setIsGeneratingPdf(false);
    });
  };

  // Transformasi untuk Parallax
  const skyY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const mountainsY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const flagY = useTransform(scrollYProgress, [0, 1], ['0%', '5%']);
  const silhouetteY = useTransform(scrollYProgress, [0, 1], ['0%', '0%']);
  
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], ['0%', '50%']);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-gray-900 text-white font-sans">
      
      <div ref={parallaxRef} className="relative w-full h-screen">
        <motion.div style={{ y: skyY }} className="absolute inset-0 z-0"><SkyBackground /></motion.div>
        <motion.div style={{ y: mountainsY }} className="absolute inset-0 z-10"><MountainSilhouette /></motion.div>
        <motion.div style={{ y: flagY }} className="absolute inset-0 z-20 opacity-80"><WavingFlag /></motion.div>
       <motion.div style={{ y: silhouetteY }} className="absolute inset-0 z-30 flex justify-center items-end "><img src={"http://localhost:3000/paskibra.png"} className='w-150 h-150  md:h-250 md:w-250'/></motion.div>
       
        <motion.div 
          style={{ opacity: textOpacity, y: textY }}
          className="relative z-50 flex flex-col items-center justify-center h-full text-center px-4"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="relative z-10">
            {/* <Flag className="mx-auto h-20 w-20 text-red-500 mb-4" /> */}
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold uppercase tracking-wider text-white" style={{textShadow: '0 4px 15px rgba(0,0,0,0.5)'}}>
              PASUSBRA
            </h1>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white/90 mt-2" style={{textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>
              SMAN 2 PASAMAN
            </h2>
            <p className="mt-6 text-red-300 text-lg sm:text-xl font-semibold">Program Kerja & Jadwal Latihan 2025</p>
          </div>
          <ChevronsDown className="absolute bottom-10 h-10 w-10 text-white/70 animate-bounce z-10" />
        </motion.div>
        
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-gray-900 to-transparent z-40"></div>
      </div>

      <div className="relative z-50 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          
          <motion.section 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-20 sm:mb-24"
          >
            <motion.div variants={fadeIn()}>
              <Award className="mx-auto h-16 w-16 text-red-400 mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Semangat Perjuangan</h2>
            </motion.div>
            <motion.p variants={fadeIn(0.2)} className="text-lg text-white/80 max-w-3xl mx-auto mb-8">
              Setiap langkah, setiap hentakan, dan setiap barisan adalah cerminan dari disiplin, kehormatan, dan cinta kami pada tanah air. Ini lebih dari sekadar baris-berbaris, ini adalah janji setia pada Merah Putih.
            </motion.p>
            <motion.blockquote variants={fadeIn(0.4)} className="italic text-white/90 text-md sm:text-lg max-w-3xl mx-auto">
              “Beri aku 1.000 orang tua, niscaya akan kucabut semeru dari akarnya. Beri aku 10 pemuda, niscaya akan kuguncangkan dunia.”
              <cite className="text-red-400 font-bold mt-3 block not-italic">– Ir. Soekarno</cite>
            </motion.blockquote>
          </motion.section>

          <motion.section {...fadeIn()} className="mb-16 sm:mb-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-white border-l-4 border-red-500 pl-4 mb-6">
              Program Kerja
            </h2>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 sm:p-8 rounded-2xl">
              <ol className="columns-1 sm:columns-2 gap-x-8 space-y-2 text-white/90">
                {prokerData.map((item, index) => (
                  <li key={index} className="flex items-start mb-2 break-inside-avoid">
                    <span className="text-red-400 font-bold mr-3">{index + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.section>

          {/* Bagian Jadwal Latihan dengan Tombol Unduh */}
          <motion.section {...fadeIn()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white border-l-4 border-red-500 pl-4">
                Detail Jadwal Latihan
              </h2>
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                {isGeneratingPdf ? (
                  <>
                    <Loader className="animate-spin h-5 w-5" />
                    <span>Membuat PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-5 w-5" />
                    <span>Unduh Jadwal</span>
                  </>
                )}
              </button>
            </div>
            {/* Kontainer ini yang akan diubah menjadi PDF */}
            <div ref={scheduleRef} style={{ backgroundColor: '#111827', padding: '24px', borderRadius: '0.5rem' }}>
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {scheduleData.map((data, idx) => (
                    // PERBAIKAN: Menggunakan inline-style untuk warna agar kompatibel dengan html2canvas
                    <div
                      key={idx}
                      style={{
                        background: 'linear-gradient(to bottom right, #1f2937, #1f2937)', // gray-800 to gray-900
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        padding: '24px',
                        borderRadius: '1rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        color: 'rgba(255, 255, 255, 0.9)'
                      }}
                    >
                      <div style={{ flexGrow: 1 }}>
                        <div style={{ marginBottom: '1.5rem',display: 'flex', alignItems: 'center', justifyContent: 'space-between' ,justifyItems: 'center'}}>
                          
                          <h3 style={{ color: '#FFF', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                            <Calendar className="mr-3 h-5 w-5" />
                            {data.date}
                          </h3>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {data.activities.map((a, i) => (
                            <li key={i} style={{ display: 'flex', alignItems: 'flex-start' }}>
                              <span style={{ fontFamily: 'monospace', backgroundColor: 'rgba(239, 68, 68, 0.8)', color: 'white', borderRadius: '0.25rem', padding: '2px 8px', fontSize: '0.75rem', marginRight: '0.75rem', lineHeight: '1.25' }}>{a.time}</span>
                              <span style={{ lineHeight: '1.25' }}>{a.desc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.875rem', marginTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.2)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <p style={{ display: 'flex', alignItems: 'center' }}><Megaphone style={{ color: '#f87171' }} className="mr-2 h-4 w-4" /> <strong style={{ fontWeight: 600 }}>Pemimpin Apel:</strong><span style={{ marginLeft: '0.5rem' }}>{data.pemimpinApel}</span></p>
                        <p style={{ display: 'flex', alignItems: 'center' }}><Users style={{ color: '#f87171' }} className="mr-2 h-4 w-4" /> <strong style={{ fontWeight: 600 }}>Tura:</strong><span style={{ marginLeft: '0.5rem' }}>{data.tura}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
            </div>
          </motion.section>

          <footer className="text-center text-sm text-white/60 mt-20 sm:mt-24 pt-8 border-t border-white/20">
            <p>🇮🇩 Dibuat dengan semangat untuk PASUSBRA SMAN 2 Pasaman | © {new Date().getFullYear()}</p>
          </footer>
        </div>
      </div>
    </main>
  );
}
