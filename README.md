# Project Reflection: InsightAI - Next.js AI Assistant

## Overview

**Project Name**: InsightAI (next-ai-assist)  
**Type**: AI-Powered Marketing Analytics & Task Guidance Assistant  
**Tech Stack**: Next.js 15, React 19, TypeScript, OpenAI GPT-4.1-nano, Mistral AI  
**Purpose**: A conversational AI assistant designed to help users analyze marketing data (GA4 & Google Search Console) and provide step-by-step guidance for WordPress/Divi website optimization tasks.

**Source code on the master branch**

---

## What This Application Does

### Core Features

1. **Dual AI Provider Support**
   - Integrated both OpenAI (GPT-4.1-nano) and Mistral AI (mistral-small-latest)
   - Users can switch between providers via a dropdown menu
   - Each provider logs token usage to the console for cost monitoring

2. **Marketing Analytics Chat Interface**
   - Analyzes Google Analytics 4 (GA4) and Google Search Console (GSC) data
   - Provides insights on website performance, SEO rankings, conversion rates
   - Uses sample data stored in separate files (`ga4-sample-data.ts` and `gsc-sample-data.ts`)
   - Context-aware: only loads analytics data when relevant to the user's query

3. **Task-Based Guidance System**
   - **Task List Sidebar**: Displays optimization tasks with reliability ratings (high/medium/low)
   - **Step-by-Step Instructions**: When a task is selected, the AI provides detailed, WordPress/Divi-specific guidance
   - **Active Task Banner**: Shows which task is currently being worked on
   - **Task Completion Flow**: Users can mark tasks as complete and receive congratulatory feedback

4. **Conversation Management**
   - Messages persist in localStorage (conversation history saved)
   - Chat can be reset via menu
   - Recent conversation context (last 10 messages) sent to AI to maintain coherence
   - Timestamp display for each message

5. **UI/UX Features**
   - Collapsible sidebar for task list
   - Quick action buttons for common queries (when not in task mode)
   - Loading animations while AI processes
   - Enter key to send messages
   - Responsive design with gradient background
   - HTML-formatted AI responses for better readability

---

## Technical Implementation

### Architecture

**Frontend** ([src/app/page.tsx](src/app/page.tsx))
- Client-side React component with state management for:
  - Messages array
  - Active task tracking
  - Provider selection
  - UI toggles (sidebar, menu, loading states)
- Local storage integration for message persistence
- Auto-scrolling chat container

**Backend** ([src/app/api/chat/route.ts](src/app/api/chat/route.ts))
- Next.js API route handling POST requests
- Conditional data loading (analytics data only when relevant)
- Dynamic system prompts based on task guidance state
- Token usage logging
- Error handling for both AI providers

### Key Technical Decisions

1. **Provider Abstraction**: Both OpenAI and Mistral use the same message structure, making it easy to switch between them
2. **Context Optimization**: Only sends last 10 messages to AI to reduce token costs
3. **Smart Data Loading**: Analytics data is conditionally included based on keyword detection in prompts
4. **HTML Formatting**: Strict HTML-based formatting rules enforced via system prompts (avoiding markdown in responses)
5. **Task Context Injection**: When task guidance is active, specialized instructions are added to the system prompt

### UI Component Library

- Extensive use of **Radix UI** primitives (20+ components)
- **shadcn/ui** components for consistent design
- **Lucide React** for icons
- **Tailwind CSS** for styling
- **Sonner** for toast notifications

---

## What I Learned

### 1. **Multi-Provider AI Integration**
- How to integrate and switch between different AI providers (OpenAI vs Mistral)
- Managing different API response structures
- Understanding token usage and cost implications
- The importance of logging for debugging AI interactions

### 2. **Context Management in Conversational AI**
- Balancing context window size (recent messages only) vs conversation coherence
- System prompt engineering for specific formatting requirements
- Conditional context loading based on query relevance
- The power of well-structured system prompts for consistent output

### 3. **Next.js 15 & React 19 Best Practices**
- Using the App Router with API routes
- Server vs client components
- TypeScript integration for type safety
- Environment variable management for API keys

### 4. **State Management in React**
- Managing complex UI state (sidebar, menu, tasks, messages, loading)
- useRef for DOM manipulation (auto-scroll)
- localStorage for persistence
- Optimistic UI updates

### 5. **Prompt Engineering**
- Creating detailed system prompts with specific formatting rules
- Injecting dynamic context (task guidance, analytics data)
- Enforcing HTML output instead of Markdown
- Structured step-by-step instruction formatting

### 6. **User Experience Design**
- Importance of loading states and visual feedback
- Collapsible UI elements for cleaner interfaces
- Quick action buttons for common tasks
- Visual hierarchy with color-coded reliability badges

### 7. **Cost Optimization**
- Limiting conversation history sent to AI (last 10 messages)
- Conditional data loading (only when needed)
- Token counting and monitoring
- Choosing smaller models (gpt-4.1-nano, mistral-small-latest) for cost efficiency

### 8. **Real-World Application Design**
- Building for a specific use case (marketing analytics + WordPress guidance)
- Separation of concerns (analytics data in separate files)
- Hardcoded sample data approach for prototyping
- Task-based workflow design

---

## Challenges Encountered

1. **Formatting Consistency**: Ensuring AI responses consistently used HTML tags instead of Markdown required detailed system prompt engineering
2. **Context Window Management**: Balancing between sending enough context for coherent responses vs keeping token costs low
3. **State Synchronization**: Managing multiple interacting UI states (task mode, sidebar, menu, messages)
4. **localStorage Handling**: Ensuring messages persist correctly and handling edge cases (parse errors)
5. **Provider Switching**: Handling different API response structures between OpenAI and Mistral

---

## Future Improvements

1. **Real Data Integration**: Connect to actual GA4 and GSC APIs instead of sample data
2. **User Authentication**: Allow multiple users with separate chat histories
3. **Task Customization**: Let users create their own tasks
4. **Export Functionality**: Export chat transcripts or task completion reports
5. **Streaming Responses**: Implement streaming for faster perceived response times
6. **More AI Providers**: Add support for Claude, Gemini, or other providers
7. **Analytics Dashboard**: Visual charts showing data insights
8. **Task Progress Tracking**: Store task completion history

---

## Conclusion

This project taught me how to build a production-ready conversational AI application with Next.js, combining multiple AI providers, managing complex state, and creating a task-oriented user experience. The most valuable lessons were around **prompt engineering**, **context management**, and **cost optimization** in AI applications. 

The combination of marketing analytics with step-by-step task guidance represents a practical use case for AI assistants in the digital marketing space, demonstrating how AI can both analyze data and provide actionable, context-specific guidance.

---

**Project Status**: ✅ Functional prototype  
**Deployment Platform**: Configured for Vercel  
**Lines of Code**: ~800 lines (frontend + backend + sample data)
