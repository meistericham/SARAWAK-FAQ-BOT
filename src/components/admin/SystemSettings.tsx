import React, { useState } from 'react';
import { Settings, Save, Palette, MessageSquare, Brain, Upload, FileText, Trash2 } from 'lucide-react';

interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  uploadDate: string;
  status: 'processing' | 'ready' | 'error';
}

export function SystemSettings() {
  const [settings, setSettings] = useState({
    brandName: 'AskSarawak',
    brandColor: '#10b981', // emerald-500
    fallbackMessage: "I'll need to check further and get back to you 😊",
    chatTone: 'friendly',
    leadCollectionEnabled: true,
    autoReindexEnabled: true,
    // AI Settings
    aiProvider: 'openai',
    openaiApiKey: '',
    anthropicApiKey: '',
    supabaseApiKey: '',
    aiModel: 'gpt-3.5-turbo',
    aiEnabled: false,
    maxTokens: 150,
    temperature: 0.7,
  });

  const [documents, setDocuments] = useState<UploadedDocument[]>([
    {
      id: '1',
      name: 'Sarawak Tourism Guide 2024.pdf',
      size: 2048576,
      uploadDate: new Date().toISOString(),
      status: 'ready'
    },
    {
      id: '2',
      name: 'Cultural Village Information.docx',
      size: 1024000,
      uploadDate: new Date(Date.now() - 86400000).toISOString(),
      status: 'ready'
    }
  ]);

  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSave = async () => {
    console.log('💾 Saving settings...');
    setSaveError('');
    
    try {
      // Validate AI settings if enabled
      if (settings.aiEnabled) {
        const currentApiKey = settings.aiProvider === 'openai' ? settings.openaiApiKey :
                             settings.aiProvider === 'anthropic' ? settings.anthropicApiKey :
                             settings.supabaseApiKey;
        
        if (!currentApiKey.trim()) {
          throw new Error(`Please enter a valid ${settings.aiProvider.toUpperCase()} API key`);
        }
        
        if (settings.maxTokens < 50 || settings.maxTokens > 500) {
          throw new Error('Max tokens must be between 50 and 500');
        }
        
        if (settings.temperature < 0 || settings.temperature > 1) {
          throw new Error('Temperature must be between 0 and 1');
        }
      }

      // Validate other settings
      if (!settings.brandName.trim()) {
        throw new Error('Brand name cannot be empty');
      }

      if (!settings.fallbackMessage.trim()) {
        throw new Error('Fallback message cannot be empty');
      }

      // Simulate API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store in localStorage for persistence
      localStorage.setItem('askSarawak_settings', JSON.stringify(settings));
      
      console.log('✅ Settings saved successfully');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
    } catch (error: any) {
      console.error('❌ Failed to save settings:', error);
      setSaveError(error.message || 'Failed to save settings');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    console.log('📁 Starting file upload process...');
    setUploading(true);

    for (const file of files) {
      console.log(`📄 Processing file: ${file.name} (${file.size} bytes)`);
      
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        console.warn(`❌ Unsupported file type: ${file.type} for ${file.name}`);
        alert(`File type not supported: ${file.name}. Please upload PDF, Word, or text files.`);
        continue;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        console.warn(`❌ File too large: ${file.name} (${file.size} bytes)`);
        alert(`File too large: ${file.name} (max 10MB)`);
        continue;
      }

      const newDocument: UploadedDocument = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        uploadDate: new Date().toISOString(),
        status: 'processing'
      };

      console.log(`✅ File validated, adding to documents: ${newDocument.id}`);
      setDocuments(prev => [...prev, newDocument]);

      // Simulate document processing (text extraction, embedding generation)
      const processingTime = 2000 + Math.random() * 3000;
      console.log(`⏳ Simulating processing for ${processingTime}ms...`);
      
      setTimeout(() => {
        const success = Math.random() > 0.1; // 90% success rate
        const finalStatus = success ? 'ready' : 'error';
        
        console.log(`${success ? '✅' : '❌'} Processing ${success ? 'completed' : 'failed'} for: ${file.name}`);
        
        setDocuments(prev => prev.map(doc => 
          doc.id === newDocument.id 
            ? { ...doc, status: finalStatus }
            : doc
        ));
      }, processingTime);
    }

    setUploading(false);
    event.target.value = ''; // Reset input
    console.log('📁 File upload process completed');
  };

  const handleDeleteDocument = (id: string) => {
    const document = documents.find(doc => doc.id === id);
    if (!document) return;
    
    console.log(`🗑️ Deleting document: ${document.name}`);
    
    if (confirm(`Are you sure you want to delete "${document.name}"?`)) {
      setDocuments(prev => prev.filter(doc => doc.id !== id));
      console.log('✅ Document deleted successfully');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: UploadedDocument['status']) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-700';
      case 'ready':
        return 'bg-green-100 text-green-700';
      case 'error':
        return 'bg-red-100 text-red-700';
    }
  };

  const getStatusText = (status: UploadedDocument['status']) => {
    switch (status) {
      case 'processing':
        return 'Processing...';
      case 'ready':
        return 'Ready';
      case 'error':
        return 'Error';
    }
  };

  const getCurrentApiKey = () => {
    switch (settings.aiProvider) {
      case 'openai':
        return settings.openaiApiKey;
      case 'anthropic':
        return settings.anthropicApiKey;
      case 'supabase':
        return settings.supabaseApiKey;
      default:
        return '';
    }
  };

  const updateCurrentApiKey = (value: string) => {
    switch (settings.aiProvider) {
      case 'openai':
        setSettings(prev => ({ ...prev, openaiApiKey: value }));
        break;
      case 'anthropic':
        setSettings(prev => ({ ...prev, anthropicApiKey: value }));
        break;
      case 'supabase':
        setSettings(prev => ({ ...prev, supabaseApiKey: value }));
        break;
    }
  };

  const getApiKeyUrl = () => {
    switch (settings.aiProvider) {
      case 'openai':
        return 'https://platform.openai.com/api-keys';
      case 'anthropic':
        return 'https://console.anthropic.com/';
      case 'supabase':
        return 'https://supabase.com/dashboard/project/_/settings/api';
      default:
        return '#';
    }
  };

  const getAvailableModels = () => {
    switch (settings.aiProvider) {
      case 'openai':
        return [
          { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Fast & Cost-effective)' },
          { value: 'gpt-4', label: 'GPT-4 (High Quality)' },
          { value: 'gpt-4-turbo', label: 'GPT-4 Turbo (Latest)' }
        ];
      case 'anthropic':
        return [
          { value: 'claude-3-haiku', label: 'Claude 3 Haiku (Fast)' },
          { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet (Balanced)' },
          { value: 'claude-3-opus', label: 'Claude 3 Opus (Most Capable)' }
        ];
      case 'supabase':
        return [
          { value: 'gte-small', label: 'GTE Small (Embeddings)' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span>Settings saved successfully!</span>
        </div>
      )}

      {saveError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <strong>Error:</strong> {saveError}
        </div>
      )}

      {/* AI Integration Settings */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
          <div className="flex items-center space-x-3">
            <Brain size={24} className="text-white" />
            <h2 className="text-xl font-bold text-white">AI Integration</h2>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-800">Enable AI Responses</p>
              <p className="text-sm text-gray-600">Use AI to generate dynamic responses from uploaded documents</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.aiEnabled}
                onChange={(e) => {
                  console.log('🤖 AI Integration toggled:', e.target.checked);
                  setSettings(prev => ({ ...prev, aiEnabled: e.target.checked }));
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>

          {settings.aiEnabled && (
            <div className="space-y-4 border-l-4 border-purple-500 pl-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">AI Provider</label>
                  <select
                    value={settings.aiProvider}
                    onChange={(e) => {
                      console.log('🔄 AI Provider changed to:', e.target.value);
                      setSettings(prev => ({ 
                        ...prev, 
                        aiProvider: e.target.value,
                        aiModel: e.target.value === 'openai' ? 'gpt-3.5-turbo' :
                                e.target.value === 'anthropic' ? 'claude-3-haiku' :
                                'gte-small'
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="openai">OpenAI (GPT)</option>
                    <option value="anthropic">Anthropic (Claude)</option>
                    <option value="supabase">Supabase AI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">AI Model</label>
                  <select
                    value={settings.aiModel}
                    onChange={(e) => {
                      console.log('🧠 AI Model changed to:', e.target.value);
                      setSettings(prev => ({ ...prev, aiModel: e.target.value }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {getAvailableModels().map(model => (
                      <option key={model.value} value={model.value}>
                        {model.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {settings.aiProvider === 'openai' ? 'OpenAI API Key' : 
                   settings.aiProvider === 'anthropic' ? 'Anthropic API Key' : 
                   'Supabase Service Role Key'}
                </label>
                <input
                  type="password"
                  value={getCurrentApiKey()}
                  onChange={(e) => {
                    console.log('🔑 API Key updated for provider:', settings.aiProvider);
                    updateCurrentApiKey(e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder={`Enter your ${settings.aiProvider.toUpperCase()} API key...`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  <a 
                    href={getApiKeyUrl()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-700 underline"
                  >
                    Get your API key here →
                  </a>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Response Length</label>
                  <input
                    type="number"
                    value={settings.maxTokens}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      console.log('📏 Max tokens changed to:', value);
                      setSettings(prev => ({ ...prev, maxTokens: value }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    min="50"
                    max="500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Tokens (roughly 150 = 100 words)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Response Creativity</label>
                  <input
                    type="range"
                    value={settings.temperature}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      console.log('🎨 Temperature changed to:', value);
                      setSettings(prev => ({ ...prev, temperature: value }));
                    }}
                    className="w-full"
                    min="0"
                    max="1"
                    step="0.1"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Focused (0.0)</span>
                    <span>Current: {settings.temperature}</span>
                    <span>Creative (1.0)</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-2">💡 AI Integration Status</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-blue-700">
                    ✅ Provider: {settings.aiProvider.toUpperCase()}
                  </p>
                  <p className="text-blue-700">
                    {getCurrentApiKey() ? '✅' : '❌'} API Key: {getCurrentApiKey() ? 'Configured' : 'Missing'}
                  </p>
                  <p className="text-blue-700">
                    ✅ Model: {settings.aiModel}
                  </p>
                  <p className="text-blue-700">
                    ✅ Documents: {documents.filter(d => d.status === 'ready').length} ready
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Document Upload & Management */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Upload size={24} className="text-white" />
              <h2 className="text-xl font-bold text-white">Document Management</h2>
            </div>
            <label className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 cursor-pointer flex items-center space-x-2">
              <Upload size={16} />
              <span>{uploading ? 'Uploading...' : 'Upload Documents'}</span>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">📋 Upload Guidelines</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-700">
                <span>📄 PDF files</span>
                <span>📝 Word documents (.doc, .docx)</span>
                <span>📄 Text files (.txt)</span>
                <span>📊 Max 10MB each</span>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Documents will be processed and used to enhance AI responses about Sarawak tourism.
              </p>
            </div>
          </div>

          {uploading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-yellow-700 font-medium">Processing uploaded files...</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{doc.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{formatFileSize(doc.size)}</span>
                        <span>Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                      {getStatusText(doc.status)}
                    </span>
                    <button
                      onClick={() => handleDeleteDocument(doc.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Delete document"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {documents.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Upload size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No documents uploaded yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Upload tourism documents to enhance AI responses
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Branding Settings */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-4">
          <div className="flex items-center space-x-3">
            <Palette size={24} className="text-white" />
            <h2 className="text-xl font-bold text-white">Branding</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name</label>
              <input
                type="text"
                value={settings.brandName}
                onChange={(e) => setSettings(prev => ({ ...prev, brandName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Brand Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.brandColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, brandColor: e.target.value }))}
                  className="w-12 h-10 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  value={settings.brandColor}
                  onChange={(e) => setSettings(prev => ({ ...prev, brandColor: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Settings */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
          <div className="flex items-center space-x-3">
            <MessageSquare size={24} className="text-white" />
            <h2 className="text-xl font-bold text-white">Chat Behavior</h2>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fallback Message</label>
            <textarea
              value={settings.fallbackMessage}
              onChange={(e) => setSettings(prev => ({ ...prev, fallbackMessage: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-20"
              placeholder="Message shown when no answer is found..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chat Tone</label>
            <select
              value={settings.chatTone}
              onChange={(e) => setSettings(prev => ({ ...prev, chatTone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="friendly">Friendly & Warm</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Lead Collection</p>
              <p className="text-sm text-gray-600">Enable visitor contact collection</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.leadCollectionEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, leadCollectionEnabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-800">Auto Reindex</p>
              <p className="text-sm text-gray-600">Automatically reindex knowledge base when documents change</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoReindexEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, autoReindexEnabled: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={settings.aiEnabled && !getCurrentApiKey().trim()}
          className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          <span>Save All Settings</span>
        </button>
      </div>
    </div>
  );
}