const fs = require("fs");
const path = "c:\\Users\\napsi\\OneDrive\\Desktop\\KK-DGP-VT-FSMERN\\FINAL PROJECT\\frontend\\src\\index.css";
const css = `@tailwind base;
@tailwind components;
@tailwind utilities;

html { scroll-behavior: smooth; }

body {
  background-color: #0a0a0b;
  color: #fff;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  overflow-x: hidden;
}

.glass {
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255,255,255,0.06);
}
.glass-strong {
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.08);
}
.gradient-text {
  background: linear-gradient(135deg, #f87171, #ef4444, #b91c1c);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 36px;
  background: linear-gradient(135deg, #ef4444, #b91c1c);
  color: #fff;
  text-decoration: none;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  box-shadow: 0 4px 25px rgba(239,68,68,0.3);
}
.btn-primary:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 40px rgba(239,68,68,0.45);
}
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 36px;
  background: rgba(255,255,255,0.04);
  color: #f87171;
  text-decoration: none;
  border-radius: 14px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  border: 1.5px solid rgba(248,113,113,0.25);
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  backdrop-filter: blur(10px);
}
.btn-secondary:hover {
  transform: translateY(-2px);
  border-color: rgba(248,113,113,0.5);
  background: rgba(255,255,255,0.07);
}
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0a0a0b; }
::-webkit-scrollbar-thumb { background: #27272a; border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
::selection { background: rgba(239,68,68,0.3); color: #fff; }

.swiper-pagination-bullet {
  background: rgba(255,255,255,0.15) !important;
  opacity: 1 !important;
}
.swiper-pagination-bullet-active {
  background: #ef4444 !important;
  width: 22px !important;
  border-radius: 4px !important;
}
.swiper-button-next,
.swiper-button-prev {
  color: #f87171 !important;
  background: rgba(255,255,255,0.04);
  width: 40px !important;
  height: 40px !important;
  border-radius: 50%;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.06);
}
.swiper-button-next::after,
.swiper-button-prev::after {
  font-size: 1rem !important;
  font-weight: 700;
}
`;
fs.writeFileSync(path, css + "\n", "utf8");
console.log("Wrote index.css");
