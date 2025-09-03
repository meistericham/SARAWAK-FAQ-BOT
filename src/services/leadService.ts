import { LeadData } from '../types';

export interface LeadPayload extends LeadData {
  timestamp: string;
  source: string;
  sessionId: string;
}

export async function saveLeadToN8n(payload: LeadPayload): Promise<{ ok: boolean }> {
  try {
    console.log('Saving lead to n8n/Google Sheets:', payload);
    
    // In production, this would be your n8n webhook URL
    // const response = await fetch('YOUR_N8N_WEBHOOK_URL', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(payload),
    // });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    
    // Simulate success (in real app, check response.ok)
    return { ok: true };
  } catch (error) {
    console.error('Failed to save lead:', error);
    throw new Error('Failed to save lead data');
  }
}