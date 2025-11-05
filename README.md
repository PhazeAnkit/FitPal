# 🏋️‍♀️ FitPal — AI-Powered Personalized Fitness Planner

FitPal is a full-stack **AI fitness and nutrition planner** built with **Next.js**, **shadcn/ui**, and **OpenAI (or Azure OpenAI)**.  
It generates **custom workout routines**, **diet plans**, and **motivational insights** based on your fitness goals — with **voice assistant**, and **plan saving** capabilities.

---

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/PhazeAnkit/FitPal.git
cd fitpal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root and add the following (update with your keys):
```bash
# OpenAI or Azure OpenAI API
OPENAI_API_KEY=your_openai_api_key
ENDPOINT=https://api.openai.com/v1

# (If using Azure OpenAI)
ENDPOINT1=https://your-resource-name.openai.azure.com
OPENAI_API_KEY1=your_azure_api_key

```

### 4. Run the Development Server
```bash
npm run dev
```

Visit 👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🧠 Technologies Used

| Layer                | Stack                                                |
| -------------------- | ---------------------------------------------------- |
| **Frontend**         | Next.js 14, React 18, TypeScript                     |
| **UI**               | shadcn/ui, Tailwind CSS, Framer Motion, Lucide Icons |
| **AI Integration**   | OpenAI / Azure OpenAI (GPT-4o, DALL·E 3, TTS)        |
| **Data Persistence** | LocalStorage + SessionStorage                        |
| **Deployment**       | Vercel                                               |

---

## 🧩 Implementation Overview

### ✳️ Flow

1. **User Registration & Form**
   * Collects age, fitness goals, dietary preferences, etc.
   * Data stored temporarily in `sessionStorage`.

2. **Plan Generation (LLM-powered)**
   * Backend route `/api/plan` calls OpenAI/Azure to create a **personalized 7-day workout and meal plan**.

3. **Dashboard View**
   * Displays the full plan interactively using cards (`WorkoutCard`, `MealCard`).
   * Users can listen to plans (Speech Synthesis) or generate AI exercise images.

4. **Save & Manage Plans**
   * Saved locally in `localStorage`.
   * Users can revisit via `/saved`.

---

## 🎥 Demo

🌐 **Live Demo:** [FitPal](https://fit-rnwytw5oq-phazeankits-projects.vercel.app/dashboard)


---

## 🧩 Future Enhancements

* User authentication & cloud persistence  
* AI-based progress tracking  
* PDF export for workout and diet summaries  
* Image generation caching via Azure Blob Storage  

---

### 👨‍💻 Developed by Ankit Ojha

Built with ❤️ using **Next.js + OpenAI**
