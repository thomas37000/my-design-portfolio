import { forwardRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { checkRateLimit } from "@/lib/rateLimit";
import { validateContactForm } from "@/lib/validation";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const ContactForm = forwardRef<HTMLFormElement>((_, ref) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Validate form data
      const validation = validateContactForm(formData);

      if (!validation.success && validation.errors) {
        const fieldErrors: FormErrors = {};
        validation.errors.errors.forEach((err) => {
          const field = err.path[0] as keyof FormErrors;
          if (field) {
            fieldErrors[field] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast({
          title: "Erreur de validation",
          description: "Veuillez corriger les erreurs dans le formulaire.",
          variant: "destructive",
        });
        return;
      }

      // Check rate limit (5 requests per minute)
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

      // Use validated and sanitized data
      const sanitizedData = validation.data!;

      const { error } = await supabase.from("contact").insert({
        name: sanitizedData.name,
        email: sanitizedData.email,
        subject: sanitizedData.subject || "Sans objet",
        message: sanitizedData.message,
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
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Votre nom"
          value={formData.name}
          onChange={handleChange("name")}
          required
          maxLength={100}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>
      <div className="space-y-2">
        <Input
          type="email"
          placeholder="Votre email"
          value={formData.email}
          onChange={handleChange("email")}
          required
          maxLength={255}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Sujet"
          value={formData.subject}
          onChange={handleChange("subject")}
          maxLength={200}
          className={errors.subject ? "border-destructive" : ""}
        />
        {errors.subject && (
          <p className="text-sm text-destructive">{errors.subject}</p>
        )}
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Votre message"
          value={formData.message}
          onChange={handleChange("message")}
          rows={6}
          required
          maxLength={2000}
          className={errors.message ? "border-destructive" : ""}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message}</p>
        )}
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
      </Button>
    </form>
  );
});

ContactForm.displayName = "ContactForm";

export default ContactForm;
