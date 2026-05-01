"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "djpelfrer",
        uploadPreset: "kudonime_manual", // Anda perlu buat preset ini di Cloudinary
        folder: `kudonime/episodes/${animeSlug}`,
        resourceType: "video",
      },
      async (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          
          // Simpan ke database kita
          const res = await fetch("/api/cdn/save", {
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
            alert("Upload Berhasil dan sudah masuk DB!");
            router.refresh();
          }
        }
      }
    );
    widget.open();
  };

  return (
    <div className="min-h-screen bg-orange-50 p-8 font-sans">
      <div className="max-w-md mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 rounded-none">
        <h1 className="text-3xl font-black mb-6 uppercase tracking-tighter">CDN Upload Center</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block font-bold mb-1">Anime Slug</label>
            <input 
              type="text" 
              value={animeSlug}
              onChange={(e) => setAnimeSlug(e.target.value)}
              placeholder="contoh: solo-leveling"
              className="w-full border-2 border-black p-2 font-bold focus:bg-yellow-100 outline-none"
            />
          </div>

          <div>
            <label className="block font-bold mb-1">Episode Slug</label>
            <input 
              type="text" 
              value={episodeSlug}
              onChange={(e) => setEpisodeSlug(e.target.value)}
              placeholder="contoh: solo-leveling-episode-1"
              className="w-full border-2 border-black p-2 font-bold focus:bg-yellow-100 outline-none"
            />
          </div>

          <button 
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all uppercase"
          >
            {isUploading ? "MEMPROSES..." : "UPLOAD MP4 KE CDN"}
          </button>
        </div>

        <p className="mt-6 text-xs font-bold text-gray-500 italic">
          *Pastikan Anda sudah login ke Cloudinary dan membuat Upload Preset 'kudonime_manual' dengan Eager Transformation ke HLS (.m3u8)
        </p>
      </div>
    </div>
  );
}

        </div>

        <p className="mt-6 text-xs font-bold text-gray-500 italic">
          *Pastikan Anda sudah login ke Cloudinary dan membuat Upload Preset 'kudonime_manual' dengan Eager Transformation ke HLS (.m3u8)
        </p>
      </div>
      
      {/* Script Cloudinary Widget */}
      <script src="https://upload-widget.cloudinary.com/global/all.js" type="text/javascript"></script>
    </div>
  );
}
