import { useState, useEffect, useRef } from 'react';

const TRANSLATE_API = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh-TW&tl=en&dt=t&q=";

// Field separator — Google Translate preserves ||| as-is
const SEP = " ||| ";
// Block separator between cafes — double newline
const BLOCK_SEP = "\n\n";

// Global cache to prevent re-translating the same cafes during the session
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
        // Build text: each cafe is one line with fields separated by |||
        // Between cafes we use double newline
        const textToTranslate = missing.map(c => {
          const name = (c.name || "").replace(/\n/g, " ").trim() || "—";
          const address = (c.address || "").replace(/\n/g, " ").trim() || "—";
          const mrt = (c.mrt || "").replace(/\n/g, " ").trim() || "—";
          return [name, address, mrt].join(SEP);
        }).join(BLOCK_SEP);

        const response = await fetch(TRANSLATE_API + encodeURIComponent(textToTranslate));
        if (!response.ok) throw new Error("Translation request failed");
        
        const data = await response.json();
        
        // Google Translate returns an array of sentence chunks — join them all
        let fullTranslatedText = "";
        if (data && data[0]) {
          fullTranslatedText = data[0].map(item => item[0]).join("");
        }

        // Split by double-newline to get per-cafe blocks
        const translatedBlocks = fullTranslatedText.split(/\n\s*\n/);
        
        missing.forEach((c, index) => {
          const block = (translatedBlocks[index] || "").replace(/\n/g, " ").trim();
          // Split by ||| (with flexible whitespace around it)
          const parts = block.split(/\s*\|\|\|\s*/);
          
          const tName = (parts[0] || "").trim();
          const tAddress = (parts[1] || "").trim();
          const tMrt = (parts[2] || "").trim();

          translationCache.set(c.id, {
            name: (tName && tName !== "—" && tName !== "-") ? tName : c.name,
            address: (tAddress && tAddress !== "—" && tAddress !== "-") ? tAddress : c.address,
            mrt: (tMrt && tMrt !== "—" && tMrt !== "-") ? tMrt : (c.mrt || ""),
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
