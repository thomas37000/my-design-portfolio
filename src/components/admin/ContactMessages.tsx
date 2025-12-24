import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Mail, Check, Reply } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string | null;
  created_at: string;
}

const ContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("contact")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from("contact")
        .update({ status: "read" })
        .eq("id", id);

      if (error) throw error;
      
      setMessages(messages.map(m => 
        m.id === id ? { ...m, status: "read" } : m
      ));
      
      toast({ title: "Message marqué comme lu" });
    } catch (error) {
      console.error("Error updating message:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le message",
        variant: "destructive",
      });
    }
  };

  const deleteMessage = async (id: number) => {
    try {
      const { error } = await supabase
        .from("contact")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setMessages(messages.filter(m => m.id !== id));
      toast({ title: "Message supprimé" });
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le message",
        variant: "destructive",
      });
    }
  };

  const replyToMessage = (message: ContactMessage) => {
    const subject = encodeURIComponent(`Re: ${message.subject}`);
    const body = encodeURIComponent(
      `\n\n---\nMessage original de ${message.name} :\n${message.message}`
    );
    window.open(`mailto:${message.email}?subject=${subject}&body=${body}`, "_blank");
    
    // Mark as read after replying
    if (message.status === "unread") {
      markAsRead(message.id);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement...</div>;
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Aucun message reçu
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card key={message.id} className={message.status === "unread" ? "border-primary" : ""}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {message.name}
                  {message.status === "unread" && (
                    <Badge variant="default">Nouveau</Badge>
                  )}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{message.email}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => replyToMessage(message)}
                  title="Répondre"
                >
                  <Reply className="h-4 w-4" />
                </Button>
                {message.status === "unread" && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => markAsRead(message.id)}
                    title="Marquer comme lu"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteMessage(message.id)}
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium mb-1">{message.subject}</p>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {message.message}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {new Date(message.created_at).toLocaleString("fr-FR")}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ContactMessages;
