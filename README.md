# AskSarawak Tourism Assistant

A comprehensive tourism chatbot and lead management system for Sarawak tourism booth staff.

## Features

### 🤖 Tourism Chatbot
- Interactive AI assistant for booth visitors
- Knowledge base with Sarawak tourism information
- Lead collection from interested visitors
- Real-time chat interface with typing indicators

### 👥 User Management
- Role-based access (Admin/User)
- Secure authentication with Supabase
- Profile management
- User dashboard for staff

### 📊 Admin Dashboard
- Lead management and export
- FAQ management with CRUD operations
- User management with role assignment
- Analytics and reporting
- System settings and configuration

### 🧠 AI Integration
- Multiple AI providers (OpenAI, Anthropic, Supabase AI)
- Document upload and processing
- Vector search for semantic matching
- Customizable AI responses

### 📄 Document Management
- Upload tourism documents (PDF, Word, Text)
- Automatic text extraction and indexing
- Document-based AI responses
- File validation and processing status

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Routing**: React Router DOM
- **AI Integration**: OpenAI/Anthropic/Supabase AI APIs

## Getting Started

### Prerequisites
- Node.js 18+ 
- Supabase account
- AI provider API key (optional)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd asksarawak-tourism-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Set up Supabase database:
- Run the migrations in `/supabase/migrations/`
- Ensure RLS policies are enabled

6. Start the development server:
```bash
npm run dev
```

## Default Admin Account

For testing purposes, use these credentials:
- **Email**: hisyamudin@sarawaktourism.com
- **Password**: 11223344

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin dashboard components
│   ├── auth/           # Authentication components
│   ├── chat/           # Chat interface components
│   ├── chatbot/        # Chatbot page and testing
│   ├── layout/         # Layout components
│   └── user/           # User dashboard components
├── contexts/           # React contexts (Auth)
├── lib/               # Utilities (Supabase client)
├── services/          # API services
└── types/             # TypeScript type definitions
```

## Key Features

### Knowledge Base
The system includes a built-in knowledge base covering:
- Sarawak Cultural Village information
- Local food recommendations
- National parks (Bako, Mulu)
- Cultural experiences and festivals
- Transportation and accommodation

### Lead Collection
- Automatic lead capture during conversations
- Export leads to CSV
- Integration with external systems (N8N webhook ready)
- Lead categorization by interest

### AI Enhancement
- Upload tourism documents for AI context
- Semantic search across documents
- Customizable AI responses
- Multiple AI provider support

## Configuration

### AI Settings
1. Go to Admin Dashboard → Settings
2. Enable "AI Responses"
3. Select AI provider and enter API key
4. Configure response parameters
5. Upload relevant documents

### Document Upload
- Supports PDF, DOC, DOCX, TXT files
- Maximum 10MB per file
- Automatic text extraction and indexing
- Status tracking for processing

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
1. Connect your Git repository
2. Set environment variables
3. Deploy with build command: `npm run build`
4. Set output directory: `dist`

## Environment Variables

Required environment variables:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, contact the development team or create an issue in the repository.