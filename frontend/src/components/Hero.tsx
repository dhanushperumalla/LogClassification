
import { motion } from "framer-motion";
import { ArrowDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const scrollToClassify = () => {
    const classifySection = document.getElementById('classify-section');
    if (classifySection) {
      classifySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-100 opacity-60 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-blue-200 opacity-50 blur-3xl" />
      </div>
      
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6 text-center md:text-left"
            >
              <div>
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="inline-block px-3 py-1 text-sm text-blue-700 bg-blue-50 rounded-full mb-4"
                >
                  Intelligent Log Classification
                </motion.span>
              </div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-balance"
              >
                <span className="block font-bold">Simplify Log Analysis</span> 
                <span className="block text-blue-600">with Smart Classification</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-xl text-gray-600 max-w-xl mx-auto md:mx-0"
              >
                Our advanced log classification system transforms complex log data into actionable insights. Upload your CSV files and let our system do the rest.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 pt-2 items-center justify-center md:justify-start"
              >
                <Button 
                  size="lg" 
                  onClick={scrollToClassify}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 transition-all"
                >
                  Classify Logs
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                  className="rounded-full px-6 transition-all border-blue-200 text-blue-700 hover:text-blue-800 hover:border-blue-300"
                >
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="md:col-span-5 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-blue-50 rounded-2xl blur-xl opacity-30 transform rotate-3"></div>
              <div className="glass relative rounded-2xl p-6 sm:p-10 subtle-shadow">
                <div className="w-full max-w-md space-y-6">
                  <div className="w-full h-12 mb-4 flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <div className="ml-4 bg-gray-100 h-5 w-40 rounded"></div>
                  </div>
                  <div className="h-60 overflow-hidden rounded-md bg-gray-50 p-4">
                    <div className="space-y-3">
                      <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-4/6 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-3/6 h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                      <div className="w-5/6 h-4 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="px-4 py-2 bg-blue-600 rounded-md text-white text-sm">Classification Report</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2, repeat: Infinity, repeatType: "loop", repeatDelay: 2 }}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full animate-float"
            >
              <ArrowDownIcon className="h-6 w-6 text-blue-600" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
