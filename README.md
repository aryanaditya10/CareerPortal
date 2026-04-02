# 🚀 CareerPortal | AI-Powered Job Matching Platform

CareerPortal is a modern full-stack recruitment platform that moves beyond traditional keyword-based searching. It utilizes **Machine Learning (NLP)** and **Vector Search** to semantically match students' resumes with the most relevant job descriptions.

## 🌟 Key Features

- **AI-Driven Matching:** Uses `all-MiniLM-L6-v2` (384-dimensional) transformer model to understand the context of skills and roles.
- **Semantic Search:** Powered by **MongoDB Atlas Vector Search** to rank jobs by relevance using Cosine Similarity.
- **Role-Based Access Control (RBAC):** Distinct dashboards and workflows for **Students** (Applications, Profile) and **Recruiters** (Job Management, Candidate Tracking).
- **Automated Text Extraction:** Integrated `pdf-parse` to convert uploaded resumes into searchable data.
- **Modern UI/UX:** Built with **shadcn/ui** and **Tailwind CSS** for a responsive, accessible, and professional interface.

## 🛠️ Technical Stack

- **Frontend:** React.js, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Vector Search & Aggregation Framework)
- **AI/ML:** Transformers.js (Local Inference), NLP, Text Embeddings
- **Storage:** Cloudinary (Resume & Profile Image Hosting)

## 🧠 How the AI Matching Works

1. **Embedding Generation:** When a resume is uploaded, the text is passed through a local Transformer model to generate a **384-dimension vector**.
2. **Vector Indexing:** These vectors are stored in MongoDB Atlas under a specialized **Vector Search Index**.
3. **Similarity Search:** When a student clicks "Find Jobs," the system performs a **k-Nearest Neighbors (k-NN)** search using **Cosine Similarity** to find the closest mathematical match between the resume and job postings.





