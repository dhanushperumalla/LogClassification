# 🔍 Log Classification System 🔍

## 📋 Overview

This system provides automated classification of log entries using a multi-tiered approach. It combines regular expressions, machine learning, and large language models to accurately categorize logs based on their content and structure. 🤖

## 🎥 Demo

https://github.com/user-attachments/assets/60e90e0a-cef1-4295-ab7d-0c6d53c6c762

## 🏗️ Architecture

The system consists of two main components:

1. **Frontend** 🖥️: A user interface for submitting logs, viewing classification results, and managing the system.
2. **Backend** ⚙️: The classification engine that processes logs and determines their categories.

## 🧠 Classification Approaches

The system employs a cascading approach to log classification:

1. **Regular Expression (Regex)** 📝:

   - Handles the most simplified and predictable patterns
   - Useful for patterns that are easily captured using predefined rules
   - Fast and efficient for well-structured logs ⚡

2. **Sentence Transformer + Logistic Regression** 🔄:

   - Manages complex patterns when there is sufficient training data
   - Utilizes embeddings generated by Sentence Transformers
   - Applies Logistic Regression as the classification layer
   - Provides good balance between accuracy and computational efficiency 📊

3. **LLM (Large Language Models)** 🧠:
   - Used for handling complex patterns when sufficient labeled training data is not available
   - Provides a fallback approach when other methods fail
   - Offers high accuracy for ambiguous or previously unseen log formats 🎯

## ⚙️ How It Works

1. **Log Ingestion** 📥: The system receives log entries through the frontend interface or API.
2. **Preprocessing** 🧹: Logs are cleaned, normalized, and prepared for classification.
3. **Classification Pipeline** 🔄:
   - First, regex patterns attempt to match and classify the log
   - If unsuccessful, the Sentence Transformer + Logistic Regression model processes the log
   - If still uncertain, the LLM is used as a final classification method
4. **Result Presentation** 📊: Classification results are displayed to the user with confidence scores and explanations.

## 🚀 Getting Started

### Prerequisites

- Python 3.8+ 🐍
- Node.js (for frontend) 📦
- Required Python packages (see requirements.txt) 📋

### Installation

1. Clone the repository 📥
2. Install backend dependencies: `pip install -r backend/requirements.txt`
3. Install frontend dependencies: `cd frontend && npm install`

### Running the System

1. Start the backend server: `python backend/app.py` ⚙️
2. Start the frontend: `cd frontend && npm start` 🖥️
3. Access the web interface at `http://localhost:3000` 🌐

## 📝 Usage

1. Submit logs through the web interface or API 📤
2. View classification results and confidence scores 📊
3. Provide feedback to improve the system's accuracy 👍👎
4. Export classification results for further analysis 📋

## 🔮 Future Improvements

- Continuous training pipeline for the ML models 🔄
- Support for additional log formats 📋
- Enhanced visualization of classification results 📈
- Integration with popular log management systems 🔌
