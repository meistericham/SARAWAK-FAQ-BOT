import { supabase } from '../lib/supabase';
import { FAQ } from '../types';

export interface CreateFAQData {
  question: string;
  answer: string;
  category?: string;
}

export interface UpdateFAQData {
  question?: string;
  answer?: string;
  category?: string;
  is_active?: boolean;
}

export class FAQService {
  // Get all FAQs (admin view - includes inactive)
  static async getAllFAQs(): Promise<FAQ[]> {
    console.log('📋 Fetching all FAQs...');
    
    const { data, error } = await supabase
      .from('faqs')
      .select(`
        *,
        created_by_profile:profiles!faqs_created_by_fkey(full_name),
        updated_by_profile:profiles!faqs_updated_by_fkey(full_name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching FAQs:', error);
      throw new Error(`Failed to fetch FAQs: ${error.message}`);
    }

    console.log(`✅ Fetched ${data?.length || 0} FAQs`);
    return data || [];
  }

  // Get active FAQs only (public view)
  static async getActiveFAQs(): Promise<FAQ[]> {
    console.log('📋 Fetching active FAQs...');
    
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching active FAQs:', error);
      throw new Error(`Failed to fetch active FAQs: ${error.message}`);
    }

    console.log(`✅ Fetched ${data?.length || 0} active FAQs`);
    return data || [];
  }

  // Create new FAQ
  static async createFAQ(faqData: CreateFAQData): Promise<FAQ> {
    console.log('➕ Creating new FAQ:', faqData.question);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('faqs')
      .insert({
        question: faqData.question.trim(),
        answer: faqData.answer.trim(),
        category: faqData.category || 'general',
        created_by: user.id,
        updated_by: user.id
      })
      .select(`
        *,
        created_by_profile:profiles!faqs_created_by_fkey(full_name),
        updated_by_profile:profiles!faqs_updated_by_fkey(full_name)
      `)
      .single();

    if (error) {
      console.error('❌ Error creating FAQ:', error);
      throw new Error(`Failed to create FAQ: ${error.message}`);
    }

    console.log('✅ FAQ created successfully:', data.id);
    return data;
  }

  // Update existing FAQ
  static async updateFAQ(id: string, updates: UpdateFAQData): Promise<FAQ> {
    console.log('📝 Updating FAQ:', id);
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const updateData: any = {
      ...updates,
      updated_by: user.id,
      updated_at: new Date().toISOString()
    };

    // Clean up the data
    if (updateData.question) updateData.question = updateData.question.trim();
    if (updateData.answer) updateData.answer = updateData.answer.trim();

    const { data, error } = await supabase
      .from('faqs')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        created_by_profile:profiles!faqs_created_by_fkey(full_name),
        updated_by_profile:profiles!faqs_updated_by_fkey(full_name)
      `)
      .single();

    if (error) {
      console.error('❌ Error updating FAQ:', error);
      throw new Error(`Failed to update FAQ: ${error.message}`);
    }

    console.log('✅ FAQ updated successfully');
    return data;
  }

  // Delete FAQ (soft delete by setting is_active = false)
  static async deleteFAQ(id: string): Promise<void> {
    console.log('🗑️ Deleting FAQ:', id);
    
    const { error } = await supabase
      .from('faqs')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('❌ Error deleting FAQ:', error);
      throw new Error(`Failed to delete FAQ: ${error.message}`);
    }

    console.log('✅ FAQ deleted successfully');
  }

  // Hard delete FAQ (permanent removal)
  static async permanentlyDeleteFAQ(id: string): Promise<void> {
    console.log('💀 Permanently deleting FAQ:', id);
    
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('❌ Error permanently deleting FAQ:', error);
      throw new Error(`Failed to permanently delete FAQ: ${error.message}`);
    }

    console.log('✅ FAQ permanently deleted');
  }

  // Search FAQs
  static async searchFAQs(query: string): Promise<FAQ[]> {
    console.log('🔍 Searching FAQs for:', query);
    
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('is_active', true)
      .or(`question.ilike.%${query}%,answer.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error searching FAQs:', error);
      throw new Error(`Failed to search FAQs: ${error.message}`);
    }

    console.log(`✅ Found ${data?.length || 0} FAQs matching "${query}"`);
    return data || [];
  }

  // Get FAQ categories
  static async getCategories(): Promise<string[]> {
    console.log('📂 Fetching FAQ categories...');
    
    const { data, error } = await supabase
      .from('faqs')
      .select('category')
      .eq('is_active', true);

    if (error) {
      console.error('❌ Error fetching categories:', error);
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    const categories = [...new Set(data?.map(item => item.category).filter(Boolean))];
    console.log('✅ Categories found:', categories);
    return categories;
  }

  // Reindex knowledge base (for search optimization)
  static async reindexKnowledgeBase(): Promise<void> {
    console.log('🔄 Reindexing knowledge base...');
    
    // This would typically trigger a background job to rebuild search indexes
    // For now, we'll simulate the process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('✅ Knowledge base reindexed successfully');
  }
}