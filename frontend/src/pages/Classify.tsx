
import { useLocation, Navigate } from "react-router-dom";
import LogTable from "@/components/LogTable";
import { Button } from "@/components/ui/button";
import { FileDown, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

export default function Classify() {
  const location = useLocation();
  const classifiedData = location.state?.classifiedData;

  // If there's no data, redirect back to home
  if (!classifiedData) {
    return <Navigate to="/" />;
  }

  const handleDownload = () => {
    if (!classifiedData) return;

    const headers = Object.keys(classifiedData[0]);
    const csvContent = [
      headers.join(","),
      ...classifiedData.map((row) =>
        headers.map((header) => row[header]).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "classified_logs.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your classified logs are being downloaded.",
    });
  };

  return (
    <section className="section-padding bg-white overflow-hidden py-12">
      <div className="container px-4 mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 mr-6">
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back to Home</span>
              </Link>
              <h1 className="text-3xl font-bold">Classification Results</h1>
            </div>
            <Button 
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Download CSV
            </Button>
          </div>
          
          <LogTable data={classifiedData} />

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-4">
              These logs have been classified using our hybrid classification framework,
              combining Regex, Sentence Transformers + Logistic Regression, and LLMs.
            </p>
            <Link to="/">
              <Button variant="outline" className="rounded-full px-6">
                Classify More Logs
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
