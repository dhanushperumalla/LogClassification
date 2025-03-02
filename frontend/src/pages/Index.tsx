
import Hero from "@/components/Hero";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ClassifyLogs from "@/components/ClassifyLogs";
import { motion } from "framer-motion";

export default function Index() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Hero />
      <About />
      <ClassifyLogs />
      <Contact />
      <Footer />
    </motion.div>
  );
}
