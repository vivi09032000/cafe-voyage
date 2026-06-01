import { useState, useEffect, useRef } from 'react';

const TRANSLATE_API = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-TW&tl=en&dt=t&q=";

// Global cache to prevent re-translating the same cafes during the session
// Store translations keyed by cafe.id
const translationCache = new Map();

export function useTranslation(cafes, lang) {
  const [translatedCafes, setTranslatedCafes] = useState(cafes);
  const [isTranslating, setIsTranslating] = useState(false);
  const currentBatchRef = useRef("");

  useEffect(() => {
    if (!cafes || cafes.length === 0) {
      setTranslatedCafes(cafes);
      return;
    }

    if (lang !== "en") {
      setTranslatedCafes(cafes);
      return;
    }

    const translateBatch = async () => {
      // Find cafes that need translation
      const missing = cafes.filter(c => !translationCache.has(c.id));
      
      if (missing.length === 0) {
        // All cached
        setTranslatedCafes(cafes.map(c => ({ ...c, ...translationCache.get(c.id) })));
        return;
      }

      // Check if we are already translating this exact batch to prevent race conditions
      const batchSignature = missing.map(c => c.id).join(",");
      if (currentBatchRef.current === batchSignature) return;
      currentBatchRef.current = batchSignature;

      setIsTranslating(true);
      
      try {
        // Combine all missing data into one big string separated by \n\n
        const textToTranslate = missing.map(c => {
          const name = (c.name || " ").replace(/\n/g, " ");
          const address = (c.address || " ").replace(/\n/g, " ");
          const limitedTime = (c.limited_time || " ").replace(/\n/g, " ");
          const mrt = (c.mrt || "-").replace(/\n/g, " ");
          return `${name}\n${address}\n${limitedTime}\n${mrt}`;
        }).join("\n\n");

        const response = await fetch(TRANSLATE_API + encodeURIComponent(textToTranslate));
        if (!response.ok) throw new Error("Translation request failed");
        
        const data = await response.json();
        
        // Google Translate returns an array of chunks
        let fullTranslatedText = "";
        if (data && data[0]) {
          fullTranslatedText = data[0].map(item => item[0]).join("");
        }

        // Split by \n\n to get the blocks
        const translatedBlocks = fullTranslatedText.split(/\n\s*\n/);
        
        missing.forEach((c, index) => {
          const block = translatedBlocks[index] || "";
          const lines = block.split("\n").map(l => l.trim());
          
          translationCache.set(c.id, {
            name: lines[0] || c.name,
            address: lines[1] || c.address,
            limited_time: lines[2] || c.limited_time,
            mrt: (lines[3] && lines[3] !== "-") ? lines[3] : (c.mrt || "")
          });
        });

      } catch (err) {
        console.error("Batch translation failed, using fallback", err);
      } finally {
        setIsTranslating(false);
        currentBatchRef.current = "";
        // Update state with translated items (fallback to original if translation failed)
        setTranslatedCafes(cafes.map(c => ({ ...c, ...(translationCache.get(c.id) || {}) })));
      }
    };

    translateBatch();
  }, [cafes, lang]);

  return { translatedCafes, isTranslating };
}
