import React from "react";

import L1 from "./columns/L1";
import L2 from "./columns/L2";
import CT from "./columns/CT";
import R1 from "./columns/R1";
import R2 from "./columns/R2";

const ScBottom = () => {
    return (
        <div className="min-h-screen flex items-end justify-center">
            <div className="relative w-[990px] h-[260px] flex border border-white/10 overflow-hidden shadow-2xl rounded-sm">

                {/* BACKGROUND */}
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[#050505]/90" />
                    <div className="absolute inset-y-0 left-0 w-[40%] bg-gradient-to-r from-blue-600/30 via-blue-900/10 to-transparent" />
                    <div className="absolute inset-y-0 right-0 w-[40%] bg-gradient-to-l from-red-600/30 via-red-900/10 to-transparent" />

                    <div
                        className="absolute inset-0"
                        style={{
                            background: `radial-gradient(circle at center, 
                rgba(234, 179, 8, 0.2) 0%, 
                rgba(234, 179, 8, 0.05) 30%, 
                transparent 70%)`,
                        }}
                    />

                    <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px]" />
                </div>

                {/* CONTENT */}
                <div className="relative z-10 flex w-full h-full">
                    <L1 />
                    <L2 />
                    <CT />
                    <R1 />
                    <R2 />
                </div>
            </div>
        </div>
    );
};

export default ScBottom;