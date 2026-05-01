"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

export default function UploadPage() {
  const [animeSlug, setAnimeSlug] = useState("");
  const [episodeSlug, setEpisodeSlug] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleUpload = () => {
    if (!animeSlug || !episodeSlug) {
      alert("Isi dulu slug anime dan episodenya bos!");
      return;
    }

    // @ts-ignore
    if (!window.cloudinary) {
      alert("Cloudinary widget belum siap!");
      return;
    }

    setIsUploading(true);

    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "djpelfrer",
        uploadPreset: "kudonime_manual",
        folder: `kudonime/episodes/${animeSlug}`,
        resourceType: "video",
      },
      async (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          const res = await fetch("/api/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              animeSlug,
              episodeSlug,
              publicId: result.info.public_id,
              hlsUrl: result.info.eager?.[0]?.secure_url || result.info.secure_url,
            }),
          });

          if (res.ok) {
            alert("Upload Berhasil!");
            setEpisodeSlug("");
            router.refresh();
          } else {
            alert("Gagal simpan ke DB bos!");
          }
        }
        setIsUploading(false);
      }
    );
    widget.open();
  };

  return (
    <div className="min-h-screen bg-[#fff7ed] p-4 md:p-8 font-sans text-black">
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="beforeInteractive" />
      
      <div className="max-w-xl mx-auto mt-10">
        <div className="bg-white border-[4px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 md:p-10">
          <h1 className="text-4xl font-black mb-8 uppercase tracking-tighter italic">
            CDN <span className="text-orange-600">Upload</span> Center
          </h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-black mb-2 uppercase">Anime Slug</label>
              <input 
                type="text" 
                value={animeSlug}
                onChange={(e) => setAnimeSlug(e.target.value)}
                placeholder="contoh: solo-leveling"
                className="w-full border-[3px] border-black p-3 font-bold focus:bg-orange-50 outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-lg font-black mb-2 uppercase">Episode Slug</label>
              <input 
                type="text" 
                value={episodeSlug}
                onChange={(e) => setEpisodeSlug(e.target.value)}
                placeholder="contoh: solo-leveling-episode-1"
                className="w-full border-[3px] border-black p-3 font-bold focus:bg-orange-50 outline-none transition-colors"
              />
            </div>

            <button 
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-black py-5 border-[4px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all uppercase text-xl"
            >
              {isUploading ? "SEDANG PROSES..." : "UPLOAD KE CLOUDINARY"}
            </button>
          </div>

          <div className="mt-10 p-4 bg-yellow-100 border-[3px] border-black">
            <p className="text-sm font-bold leading-tight">
              ⚠️ INFO PENTING: <br/>
              Pastikan Cloudinary Upload Preset <code className="bg-white px-1">kudonime_manual</code> sudah di-set ke <span className="text-orange-700">HLS (.m3u8)</span> biar player-nya jalan!
            </p>
          </div>
        </div>
        
        <p className="text-center mt-8 font-black uppercase text-sm tracking-widest opacity-50">
          KudoNime Digital Infrastructure © 2026
        </p>
      </div>
    </div>
  );
}
