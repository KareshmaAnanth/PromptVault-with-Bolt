# 🚀 PromptVault: Prompt Better. Store Smarter. Create Faster.

## 🔗 Project Links

- 🎥 [YouTube Demo – PromptVault](https://youtu.be/H1ez9-R1Y8c)  
- 🌐 [Live Site – PromptVault on Netlify](https://mellifluous-stardust-4665b5.netlify.app/)

## 🌟 Inspiration

As creators and professionals, we constantly generate prompts—whether it's for writing, brainstorming, marketing, or coding. But we often struggle to **organize them**, **reuse them**, or **iterate** on past work.
We asked ourselves: *What if we had a smart, centralized vault to manage all our creative prompts?* That’s how **PromptVault** was born.

My goal was to **simplify the creative process** by allowing users to:

* Save and structure prompts with ease
* Create new prompts with the help of AI
* Organize everything into collections
* Favorite and revisit the best ones quickly

## 🧱 How I Built It

PromptVault was built using a **modern full-stack approach**:

* **Frontend**: React + Tailwind CSS for a sleek, responsive UI
* **Routing**: React Router DOM for clean navigation
* **Database & Auth**: Supabase (PostgreSQL + RLS + Auth)
* **Deployment**: Netlify for instant frontend hosting
* **AI**: "Create with AI" powered by OpenAI (or a pluggable AI generation endpoint)
* **Markdown Support**: `react-markdown` for prompt readability

### Core Features:

* 🧠 Create prompts manually or with AI
* 🗂 Group prompts into collections
* ⭐ Favorite key prompts
* 🕓 View recent prompt activity
* 📄 Use predefined templates for writing, marketing, storytelling, and productivity

## ⚙️ What I Learned

* **Supabase RLS (Row-Level Security)** helped us secure user-specific data in a very intuitive way.
* We explored using **AI as a co-creator**, not just a tool—giving users a jumpstart on creative tasks.
* Tailwind and Vite significantly sped up development with hot-reloading and clear structure.
* Building clean, re-usable UI components saved a lot of time in the long run.

## 🧗 Challenges I Faced

* 🔐 Handling Supabase authentication and syncing it with prompt ownership logic
* ⚙️ Structuring prompts, collections, and templates in a way that’s both scalable and user-friendly
* 🔄 Integrating AI generation while ensuring the content feels personalized and relevant
* 🧪 Designing a dashboard that’s useful from the very first login

## 🔭 What’s Next?

I'm planning to:

* Add tagging and advanced search
* Support multi-user collaboration
* Release an extension/plugin to use PromptVault inside tools like Notion or VS Code
* Expand the AI creation logic with more context awareness

---

PromptVault is just the beginning of a smarter, more organized way to create with AI.
**I'm excited to keep building!**

