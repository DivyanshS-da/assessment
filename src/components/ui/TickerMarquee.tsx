import React from 'react';

interface TickerMarqueeProps {
  items?: string[];
  bgClass?: string;
}

export const TickerMarquee: React.FC<TickerMarqueeProps> = ({
  items = [
    "BLOOM'S TAXONOMY ENGINE",
    "GEMINI 1.5 AI ASSESSMENTS",
    "COMPETENCY RADAR",
    "REAL-TIME CLASS GAP ANALYTICS",
    "OUTCOME-BASED LEARNING",
    "ZERO FAKE DATA",
  ],
  bgClass = "bg-black text-white"
}) => {
  return (
    <div className={`w-full overflow-hidden border-y-2 border-black py-2.5 font-black uppercase tracking-widest text-xs select-none ${bgClass}`}>
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((item, idx) => (
          <span key={idx} className="flex items-center mx-4">
            <span className="text-[#FFDE59] mr-3">✦</span>
            <span>{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
