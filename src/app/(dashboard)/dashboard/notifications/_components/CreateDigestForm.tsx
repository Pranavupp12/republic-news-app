'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { sendDigestNotification } from '@/actions/notificationActions';

interface Article {
  id: string;
  title: string;
  createdAt: Date;
}

export function CreateDigestForm({ articles }: { articles: Article[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [customTitle, setCustomTitle] = useState("Daily Top Stories");
  const [customBody, setCustomBody] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Toggle article selection
  const handleSelect = (article: Article) => {
    setSelectedIds(prev => {
      const isSelected = prev.includes(article.id);
      const newIds = isSelected 
        ? prev.filter(id => id !== article.id) 
        : [...prev, article.id].slice(0, 3); // Limit to 3 for readability
      
      // Auto-generate body text
      updateBodyText(newIds, articles);
      return newIds;
    });
  };

  const updateBodyText = (ids: string[], allArticles: Article[]) => {
    const selectedArticles = allArticles.filter(a => ids.includes(a.id));
    const text = selectedArticles.map((a, i) => `${i + 1}. ${a.title}`).join('\n');
    setCustomBody(text);
  };

  const handleSend = async () => {
    if (selectedIds.length === 0) return toast.error("Select at least one article");
    
    setIsSending(true);
    const result = await sendDigestNotification(selectedIds, customTitle, customBody);
    
    if (result.success) {
      toast.success("Digest sent successfully!");
      setSelectedIds([]);
      setCustomBody("");
    } else {
      toast.error("Failed to send");
    }
    setIsSending(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* LEFT: Article Selector */}
      <Card className='p-4'>
        <CardHeader><CardTitle>1. Select Articles (Max 3)</CardTitle></CardHeader>
        <CardContent className="h-[400px] overflow-y-auto space-y-2">
          {articles.map(article => (
            <div key={article.id} className="flex items-center space-x-3 p-2 border rounded hover:bg-slate-50">
              <Checkbox 
                id={article.id} 
                checked={selectedIds.includes(article.id)}
                onCheckedChange={() => handleSelect(article)}
              />
              <label htmlFor={article.id} className="text-sm cursor-pointer line-clamp-1">
                {article.title}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* RIGHT: Preview & Send */}
      <Card className='p-4'>
        <CardHeader><CardTitle>2. Preview & Send</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Notification Title</label>
            <Input value={customTitle} onChange={(e) => setCustomTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">Notification Body</label>
            <Textarea 
              value={customBody} 
              onChange={(e) => setCustomBody(e.target.value)} 
              className="h-32"
              placeholder="Select articles to auto-fill..."
            />
            <p className="text-xs text-muted-foreground mt-1">Keep it short. Push notifications have limited space.</p>
          </div>

          <div className="bg-slate-100 p-4 rounded-md">
            <p className="text-xs uppercase text-slate-500 font-bold mb-1">Preview</p>
            <div className="flex gap-3">
               <div className="h-10 w-10 bg-red-600 rounded-md flex-shrink-0"></div>
               <div>
                  <p className="font-bold text-sm">{customTitle}</p>
                  <p className="text-xs text-slate-600 whitespace-pre-line">{customBody || "Content will appear here..."}</p>
               </div>
            </div>
          </div>

          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={handleSend} disabled={isSending || selectedIds.length === 0}>
            {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Notification"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}