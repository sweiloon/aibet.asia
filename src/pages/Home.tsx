
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      
      {/* Hero section */}
      <section className="flex-1 flex flex-col md:flex-row items-center justify-center px-4 py-24 md:py-32 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-black">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="inline-block rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300 mb-4">
              Professional Website Management
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="text-gradient">Website Management</span>{" "}
              <br className="hidden md:block" />
              Made Simple
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-md md:max-w-xl">
              Let us handle your website's daily maintenance and management, so you can
              focus on what matters most—your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button
                size="lg"
                className="text-md"
                onClick={() => navigate("/signup")}
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-md"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-lg">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden neo-blur p-1">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 animate-pulse"></div>
              <div className="relative w-full h-full rounded-lg overflow-hidden bg-black/60 backdrop-blur">
                <div className="absolute top-0 w-full h-1.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="p-4 flex flex-col h-full">
                  <div className="flex items-center space-x-2 pb-2 border-b border-white/10">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <div className="ml-2 text-xs text-gray-400">Website Management Dashboard</div>
                  </div>
                  <div className="flex-1 flex flex-col mt-3 space-y-3">
                    <div className="h-8 w-3/4 bg-white/10 rounded animate-pulse"></div>
                    <div className="flex space-x-2">
                      <div className="h-4 w-1/4 bg-white/10 rounded animate-pulse"></div>
                      <div className="h-4 w-1/4 bg-white/10 rounded animate-pulse"></div>
                    </div>
                    <div className="flex-1 mt-2 bg-white/5 rounded">
                      <div className="grid grid-cols-3 gap-2 p-3">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="h-12 bg-white/10 rounded animate-pulse"></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-20 px-4 bg-slate-950">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Service</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We provide comprehensive website management services to keep your online presence running smoothly.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Daily Monitoring",
                description: "We check your website every day to ensure it's running properly and securely."
              },
              {
                title: "Performance Optimization",
                description: "Regular updates and tweaks to keep your website running at peak performance."
              },
              {
                title: "Security Updates",
                description: "Stay protected with timely security patches and vulnerability fixes."
              }
            ].map((feature, index) => (
              <div key={index} className="glass-morphism p-6 rounded-xl card-hover">
                <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-blue-500/20 text-blue-300 mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How it works */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-950 to-black">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Getting started with our website management service is simple and straightforward.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Register",
                description: "Create an account with us"
              },
              {
                step: "2",
                title: "Submit your website",
                description: "Provide your website details and credentials"
              },
              {
                step: "3",
                title: "Approval Process",
                description: "Our team reviews and approves your submission"
              },
              {
                step: "4",
                title: "Daily Management",
                description: "We start managing your website daily"
              }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="glass-morphism p-6 rounded-xl h-full">
                  <div className="absolute -top-4 -left-4 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3 mt-3">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 right-0 w-6 h-1 bg-blue-600/50 -mr-3 transform translate-x-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-20 px-4 bg-black">
        <div className="container mx-auto">
          <div className="glass-morphism max-w-4xl mx-auto p-8 md:p-12 rounded-2xl text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Join our platform today and let us take care of your website management needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-md"
                onClick={() => navigate("/signup")}
              >
                Create Account
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-md"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-10 px-4 bg-black border-t border-white/10">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">WebManage</span>
                <span className="text-xs rounded-full px-2 bg-blue-500/30 text-blue-200">CRM</span>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Professional website management services
              </p>
            </div>
            
            <div className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} WebManage CRM. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
