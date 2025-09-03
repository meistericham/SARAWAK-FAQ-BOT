# Deployment Guide for AskSarawak Tourism Assistant

## Prerequisites

Before deploying, ensure you have:
- Supabase project set up
- Environment variables configured
- AI provider API keys (if using AI features)

## Environment Setup

### 1. Supabase Configuration

Create a Supabase project and note down:
- Project URL
- Anon/Public key
- Service role key (for admin functions)

### 2. Database Setup

Run the following migrations in your Supabase SQL editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Service role full access" ON profiles
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'USER'
  );
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

### 3. Environment Variables

Create a `.env` file with:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Push to GitHub first
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/asksarawak.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set environment variables in Vercel dashboard
   - Deploy

3. **Vercel Configuration**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm install"
   }
   ```

### Option 2: Netlify

1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Environment Variables**
   - Add your Supabase variables in Netlify dashboard

### Option 3: Traditional Hosting

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Upload dist folder** to your web server

## Post-Deployment Setup

### 1. Create Admin User

After deployment, create your first admin user:

1. Sign up through the app with your email
2. Go to Supabase dashboard → Table Editor → profiles
3. Find your user record and change `role` from `USER` to `ADMIN`

### 2. Configure AI Integration (Optional)

1. Log in as admin
2. Go to Admin Dashboard → Settings
3. Enable AI responses
4. Enter your AI provider API key
5. Upload tourism documents
6. Save settings

### 3. Test the System

1. **Test chatbot functionality**
   - Ask sample questions
   - Verify responses from knowledge base
   - Test lead collection

2. **Test admin features**
   - User management
   - FAQ management
   - Lead export
   - Document upload

## Troubleshooting

### Common Issues

1. **Supabase Connection Error**
   - Verify environment variables
   - Check Supabase project status
   - Ensure RLS policies are set correctly

2. **Authentication Issues**
   - Verify Supabase auth settings
   - Check email confirmation settings
   - Ensure proper RLS policies

3. **AI Integration Not Working**
   - Verify API key is correct
   - Check provider-specific model availability
   - Ensure sufficient API credits

### Debug Mode

Enable debug logging by adding to your `.env`:
```env
VITE_DEBUG=true
```

This will show detailed console logs for:
- Authentication flow
- Search operations
- AI API calls
- Document processing

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use secure environment variable storage
   - Rotate API keys regularly

2. **Database Security**
   - RLS policies are enabled by default
   - Service role key should only be used server-side
   - Regular security audits

3. **File Uploads**
   - File type validation is enforced
   - Size limits prevent abuse
   - Consider virus scanning for production

## Monitoring

### Key Metrics to Monitor
- Chat response accuracy
- Lead conversion rates
- API usage and costs
- User engagement
- System performance

### Recommended Tools
- Supabase Analytics
- Vercel Analytics
- AI provider usage dashboards
- Custom analytics implementation

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review and update FAQ content
- Monitor AI API usage and costs
- Export and backup lead data
- Review user feedback and improve responses

### Updates
- Test in staging environment first
- Monitor error rates after deployment
- Keep AI models updated
- Regular security patches