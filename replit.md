# Discord Intro Manager Bot

## Overview
This Discord bot for the AI Learners India community streamlines member onboarding, facilitates collaboration, and enhances meeting productivity. Its core capabilities include AI-powered member introductions, a system for launching and managing team projects, an AI-driven VC summarizer and meeting assistant, and an AI-powered teammate matching feature. The project aims to foster a more organized, collaborative, and AI-augmented community experience.

## Recent Changes (November 2, 2025)

### Introduction System Refinements
- ✅ **Clean Channel Embeds** - Intro embeds posted in channel WITHOUT buttons for clean appearance
- ✅ **Private Controls** - Update/Delete buttons appear ONLY in ephemeral confirmation message
- ✅ **Auto-Delete Confirmation** - Ephemeral messages auto-delete after 15 seconds to keep chats clean
- ✅ **Verified Footer** - Intro embeds now show "🛡️ Verified Intro" footer with timestamp
- ✅ **Modal-Based /update_intro** - Command now opens pre-filled modal instead of text input
- ✅ **Enhanced Field Validation** - Validates name, interests, and all required fields with proper error messages
- ✅ **Permission Checks** - Verifies bot has SendMessages and EmbedLinks permissions before posting
- ✅ **Comprehensive Logging** - Logs all intro posts, updates, and deletions with message IDs
- ✅ **Improved Error Handling** - Field reading errors, channel access errors, and permission issues handled gracefully
- ✅ **Better User Feedback** - Clear error messages for all failure scenarios

### Initial Setup
- ✅ **Replit Import Complete** - Successfully imported GitHub project and configured for Replit environment
- ✅ **Dependencies Installed** - All npm packages installed (discord.js, @google/genai, @discordjs/voice, etc.)
- ✅ **Environment Configuration** - All required secrets configured (DISCORD_TOKEN, GEMINI_API_KEY, INTRO_CHANNEL_ID, PROFILE_CHANNEL_ID)
- ✅ **Bot Successfully Running** - Connected to Discord and registered 16 slash commands
- ✅ **Workflow Configured** - discord-bot workflow running with console output
- ✅ **Git Protection Added** - Created .gitignore to protect sensitive data files
- ✅ **All Features Enabled** - Gemini AI, Voice Summarizer, and Modern Intro System all active

## Previous Changes (November 1, 2025)
- ✅ **Complete Intro System Rebuild** - Rebuilt from scratch with modern, stable implementation
- ✅ **New AI Summary Engine** (`utils/aiIntroSummary.js`) - Clean Gemini SDK usage with robust error handling
- ✅ **Interactive Update/Delete Buttons** - Users can now update or delete their intros with button clicks
- ✅ **One Intro Per User** - Automatically deletes old intros before posting new ones
- ✅ **Comprehensive Fallback System** - Never crashes, always provides a usable intro even if AI fails
- ✅ **Hinglish Support** - AI naturally detects and responds in English or Hinglish
- ✅ **Fixed critical bugs** - Proper fallback handling and removed divergent legacy code

## User Preferences
I prefer iterative development, where features are developed and integrated in stages. Before making major changes or architectural decisions, please ask for my approval. I appreciate clear, concise explanations and prefer working with modular and well-documented code. Please do not make changes to the existing file structure without prior discussion.

## System Architecture

### UI/UX Decisions
- **Dynamic Embeds:** Utilizes Discord embeds with dynamic, color-coded designs based on AI-detected skill levels (Green, Yellow, Red) for introductions, and project types for team launches.
- **Emoji Integration:** Employs relevant emojis to enhance readability and visual cues.
- **Clean Layout:** Focuses on an organized presentation of information within Discord messages.

### Technical Implementations
- **Modular Design:** Built with a modular architecture, separating concerns for maintainability and scalability.
- **Persistent Storage:** Uses JSON files (`profiles.json`, `projectData.json`, `vcSessions.json`, `userPreferences.json`, `botConfig.json`) for persistent data storage.
- **AI-Powered Processing:** Integrates Google Gemini AI for natural language understanding, text generation, and audio transcription.
- **Voice Capabilities:** Leverages `@discordjs/voice` for robust voice channel interaction, recording, and transcription.
- **PDF Generation:** Employs `pdfkit` for generating professional PDF meeting minutes.
- **Error Handling:** Includes comprehensive error handling for graceful fallbacks and user feedback.
- **Automated Actions:** Implements features like auto-deletion of intro messages and scheduled project cleanup.

### Feature Specifications
- **Member Introduction System:** Supports flexible intro formats, AI-powered semantic extraction, spelling/grammar correction, role/experience level assignment, and `updateintro`/`deleteintro` commands.
- **Team Launch System:** Manages project applications, approvals, and automated private workspace creation; includes `addTeammate`, `projectStatus`, and `projectShowcase` commands.
- **VC Summarizer & Meeting Assistant:** Records voice channel audio, transcribes using Gemini, provides multilingual summaries (English, Hindi, Hinglish) with dynamic color coding based on productivity, generates PDF meeting minutes, and offers `/stop-summary`, `/summarize-vc`, `/summary-mode`, and `/minutes` commands.
- **Teammate Matching:** AI analyzes profiles to suggest top 3 matches based on skills, interests, and goals via `/find_teammate`, providing compatibility scores.

### System Design Choices
- **Node.js with discord.js v14:** Chosen for asynchronous capabilities and Discord API wrapper.
- **Slash Commands:** Primary interaction method for users.
- **Environment Variables:** Configuration managed through Replit Secrets for security.
- **Discord Intents:** Explicitly configured for necessary bot permissions.

## External Dependencies

- **Discord API:** Core platform for bot interactions.
- **Google Gemini AI:** Used for text analysis, natural language understanding and generation, and audio transcription.
- **npm packages:**
    - `discord.js`: Discord API interaction.
    - `@google/genai`: Google Gemini API SDK.
    - `dotenv`: Environment variable management.
    - `@discordjs/voice`, `opusscript`, `prism-media`, `ffmpeg-static`, `libsodium-wrappers`: Voice channel functionality.
    - `pdfkit`: PDF document generation.

## Detailed Change Log

### November 2, 2025 - GitHub Import to Replit
- **GitHub Import:** Successfully cloned and imported Discord bot project into Replit environment
- **Dependency Installation:** Installed 90 npm packages including discord.js v14.14.1, @google/genai v1.28.0, and voice libraries
- **Environment Configuration:** 
  - Configured DISCORD_TOKEN for bot authentication
  - Configured GEMINI_API_KEY for AI-powered features
  - Configured INTRO_CHANNEL_ID and PROFILE_CHANNEL_ID for channel routing
- **Workflow Setup:** Created discord-bot workflow with `npm start` command
- **Git Protection:** Added comprehensive `.gitignore` to protect sensitive data files (profiles.json, projectData.json, etc.) and node_modules
- **Bot Status:** ✅ Bot logged in successfully as testingggggg#1609, all 16 commands registered, all features operational

### November 1, 2025 - Error Handling Improvements
- **Fixed Null Value Crashes:** Updated `handlers/introInteractions.js` to prevent crashes from missing intro fields
- **Enhanced Error Resilience:** Added fallback values and improved null checking for optional fields

## Replit Configuration

### Workflow
- **Name:** discord-bot
- **Command:** `npm start`
- **Output Type:** Console
- **Status:** Running

### Required Environment Variables
All configured as Replit Secrets:
- `DISCORD_TOKEN` - Discord bot authentication token
- `GEMINI_API_KEY` - Google Gemini API key for AI processing
- `INTRO_CHANNEL_ID` - Channel ID for user introductions
- `PROFILE_CHANNEL_ID` - Channel ID for formatted profiles

### Bot Capabilities
✅ All 16 commands loaded and registered:
- Member Introduction System (setup-intro-button, edit-profile, update_intro, deleteintro)
- Team Launch System (setup-apply-button, add-teammate, project-status, project-showcase)
- VC Summarizer (join-vc-summary, stop-summary, summarize-vc, summary-mode, minutes)
- Teammate Matching (find_teammate)
- Bot Configuration (setup-bot, setup-reset)