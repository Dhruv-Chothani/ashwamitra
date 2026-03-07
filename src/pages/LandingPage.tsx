//                   boxShadow: "var(--shadow-card)",
//                 }}
//                 onMouseEnter={(e) => {
//                   (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 12px 40px -8px ${role.color}30`;
//                 }}
//                 onMouseLeave={(e) => {
//                   (e.currentTarget as HTMLButtonElement).style.boxShadow = "var(--shadow-card)";
//                 }}
//               >
//                 {/* Icon */}
//                 <div
//                   className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mb-3 transition-transform group-hover:scale-110"
//                   style={{ background: role.lightColor }}
//                 >
//                   {role.emoji}
//                 </div>

//                 {/* Label */}
//                 <h3 className="font-display font-bold text-lg text-foreground mb-1">
//                   {role.label}
//                 </h3>
//                 <p className="text-sm text-muted-foreground mb-3">{role.tagline}</p>

//                 {/* Features */}
//                 <ul className="space-y-2 mb-3">
//                   {role.features.map((f) => (
//                     <li key={f} className="flex items-center gap-2 text-xs">
//                       <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: role.color }} />
//                       <span className="text-muted-foreground">{f}</span>
//                     </li>
//                   ))}
//                 </ul>

//                 {/* CTA */}
//                 <div className="flex items-center gap-2 text-sm font-semibold transition-colors" style={{ color: role.color }}>
//                   Get Started
//                   <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//       </section>

     
     
//     </div>
//   );
// };

// export default LandingPage;


import React, { useState } from "react";
import { UserRole } from "@/context/AuthContext";
import AuthForm from "@/components/auth/AuthForm";
import Hero from "././landingPage/Hero";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import Navbar from "./landingPage/Navbar";
import HowItWorks from "./landingPage/HowItWorks";
import FarmerSection from "./landingPage/FarmerSection";
import Footer from "./landingPage/Footer";
import AboutUs from "./landingPage/AboutUs";
import WhyChooseUs from "./landingPage/WhyChooseUs";

const landingPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);

  if (selectedRole) {
    return (
      <AuthForm
        role={selectedRole}
        onBack={() => setSelectedRole(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar/>
      <Hero/>
      <HowItWorks/>
      <FarmerSection onSelectRole={setSelectedRole}/>
      <AboutUs/>
      <WhyChooseUs/>
      <Footer onSelectRole={setSelectedRole}/>
      
      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  );
};

export default landingPage;