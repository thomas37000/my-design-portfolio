import { forwardRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { checkRateLimit } from "@/lib/rateLimit";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const ContactForm = forwardRef<HTMLFormElement>((_, ref) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check rate limit first (5 requests per minute)
      const rateLimitResult = await checkRateLimit({
        endpoint: "contact-form",
        maxRequests: 5,
        windowMinutes: 1,
      });

      if (!rateLimitResult.allowed) {
        toast({
          title: "Trop de requêtes",
          description: "Veuillez patienter avant de renvoyer un message.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("contact").insert({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim() || "Sans objet",
        message: formData.message.trim(),
        status: "unread",
      });

      if (error) throw error;

      toast({
        title: "Message envoyé !",
        description: "Merci pour votre message. Je vous répondrai bientôt.",
      });
      setFormData(initialFormData);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={ref} onSubmit={handleSubmit} className="space-y-6 opacity-0">
      <Input
        type="text"
        placeholder="Votre nom"
        value={formData.name}
        onChange={handleChange("name")}
        required
        maxLength={100}
      />
      <Input
        type="email"
        placeholder="Votre email"
        value={formData.email}
        onChange={handleChange("email")}
        required
        maxLength={255}
      />
      <Input
        type="text"
        placeholder="Sujet"
        value={formData.subject}
        onChange={handleChange("subject")}
        maxLength={200}
      />
      <Textarea
        placeholder="Votre message"
        value={formData.message}
        onChange={handleChange("message")}
        rows={6}
        required
        maxLength={2000}
      />
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
      </Button>
    </form>
  );
});

ContactForm.displayName = "ContactForm";

export default ContactForm;
