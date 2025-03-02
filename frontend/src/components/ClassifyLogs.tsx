import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Upload,
  CheckCircle,
  AlertCircle,
  Loader,
  FileDown,
  Info,
} from "lucide-react";
import LogTable from "./LogTable";
import { useNavigate } from "react-router-dom";

export default function ClassifyLogs() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classifiedData, setClassifiedData] = useState<any[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const sampleData = [
    {
      source: "ModernCRM",
      log_message: "IP 192.168.133.114 blocked due to potential attack",
      target_label: "Security Alert",
    },
    {
      source: "BillingSystem",
      log_message: "User 12345 logged in.",
      target_label: "Security Alert",
    },
    {
      source: "AnalyticsEngine",
      log_message: "File data_6957.csv uploaded successfully by user User265.",
      target_label: "System Notification",
    },
    {
      source: "AnalyticsEngine",
      log_message: "Backup completed successfully.",
      target_label: "System Notification",
    },
    {
      source: "ModernHR",
      log_message:
        "GET /v2/54fadb412c4e40cdbaed9335e4c35a9e/servers/detail HTTP/1.1 RCODE 200 len: 1583 time: 0.1878400",
      target_label: "HTTP Status",
    },
    {
      source: "ModernHR",
      log_message: "Admin access escalation detected for user 9429",
      target_label: "Security Alert",
    },
    {
      source: "LegacyCRM",
      log_message:
        "Case escalation for ticket ID 7324 failed because the assigned support agent is no longer active.",
      target_label: "Workflow Error",
    },
    {
      source: "LegacyCRM",
      log_message:
        "Invoice generation process aborted for order ID 8910 due to invalid tax calculation module.",
      target_label: "Workflow Error",
    },
    {
      source: "LegacyCRM",
      log_message:
        "The 'BulkEmailSender' feature is no longer supported. Use 'EmailCampaignManager' for improved functionality.",
      target_label: "Deprecation Warning",
    },
    {
      source: "LegacyCRM",
      log_message:
        "The 'ReportGenerator' module will be retired in version 4.0. Please migrate to the 'AdvancedAnalyticsSuite' by Dec 2025",
      target_label: "Deprecation Warning",
    },
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please upload a CSV file");
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a CSV file.",
      });
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile);
      setError(null);
    } else if (selectedFile) {
      setError("Please upload a CSV file");
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a CSV file.",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setClassifiedData(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/classify", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Classification failed");
      }

      const blob = await response.blob();
      const text = await blob.text();

      // Parse CSV data
      const rows = text.split("\n");
      const headers = rows[0].split(",");
      const data = rows
        .slice(1)
        .map((row) => {
          const values = row.split(",");
          return headers.reduce<Record<string, string>>(
            (obj, header, index) => {
              obj[header] = values[index];
              return obj;
            },
            {}
          );
        })
        .filter((row) => row.source); // Filter out empty rows

      navigate("/classify", { state: { classifiedData: data } });
    } catch (err) {
      console.error("Error during classification:", err);
      setError("Failed to classify logs. Please try again.");
      toast({
        variant: "destructive",
        title: "Classification failed",
        description:
          "There was an error processing your file. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    <section
      id="classify-section"
      className="section-padding bg-white overflow-hidden"
    >
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="inline-block px-3 py-1 text-sm text-blue-700 bg-blue-50 rounded-full mb-4">
            Log Classification
          </span>
          <h2 className="mb-4">Classify Your Logs</h2>
          <p className="text-lg text-gray-600 text-balance">
            Upload your CSV file containing logs and our intelligent system will
            classify them, providing insights and categorization instantly.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`glass rounded-2xl p-10 subtle-shadow mb-8 border-2 transition-all duration-300 ${
              isDragging
                ? "border-blue-400 bg-blue-50/50"
                : "border-dashed border-gray-200"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center py-8">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {isDragging ? "Drop your file here" : "Upload your CSV file"}
              </h3>
              <p className="text-gray-500 mb-6">
                Drag and drop your file here, or click to browse
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
                id="file-input"
              />

              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 rounded-full px-6"
                >
                  Browse Files
                </Button>

                {file && (
                  <div className="flex items-center gap-2">
                    <div className="py-3 px-4 bg-blue-50 rounded-lg inline-flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">{file.name}</span>
                    </div>

                    {!isLoading && (
                      <Button
                        onClick={handleUpload}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
                      >
                        Classify
                      </Button>
                    )}
                  </div>
                )}

                {isLoading && (
                  <div className="flex items-center">
                    <Loader className="h-5 w-5 text-blue-600 animate-spin mr-2" />
                    <span className="text-gray-600">Classifying...</span>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-center">
                <div className="flex items-center p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm max-w-xl">
                  <Info className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p>
                    Important: Your CSV file must contain columns named exactly{" "}
                    <strong>source</strong> and <strong>log_message</strong>.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 flex items-center"
            >
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Sample Output</h3>
              <div className="flex gap-2 items-center text-sm text-blue-600">
                <FileDown className="h-4 w-4" />
                <span>CSV Format</span>
              </div>
            </div>
            <LogTable data={sampleData} isSample={true} />
            <p className="mt-4 text-sm text-gray-500 italic">
              This is a sample of how your log data will be classified. The
              system identifies patterns and categorizes logs into different
              types such as Security Alerts, System Notifications, HTTP Status,
              etc.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
