import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message envoyé !",
      description: "Merci pour votre message. Je vous répondrai bientôt.",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center animate-fade-in">
          Me Contacter
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8 animate-fade-in">
            <div>
              <h3 className="text-2xl font-bold mb-6">Restons en contact</h3>
              <p className="text-muted-foreground mb-8">
                N'hésitez pas à me contacter pour discuter de vos projets ou
                simplement pour échanger sur le design et le développement.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary text-primary-foreground rounded-lg">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-muted-foreground">contact@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary text-primary-foreground rounded-lg">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Téléphone</p>
                  <p className="text-muted-foreground">+33 6 12 34 56 78</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary text-primary-foreground rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Localisation</p>
                  <p className="text-muted-foreground">Paris, France</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div>
              <Input
                type="text"
                placeholder="Votre nom"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Votre email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Textarea
                placeholder="Votre message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={6}
                required
              />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Envoyer le message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
