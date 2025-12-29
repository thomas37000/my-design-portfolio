import { forwardRef } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

interface ContactInfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const ContactInfoItem = ({ icon, label, value }: ContactInfoItemProps) => (
  <div className="flex items-center gap-4">
    <div className="p-3 bg-primary text-primary-foreground rounded-lg">
      {icon}
    </div>
    <div>
      <p className="font-semibold">{label}</p>
      <p className="text-muted-foreground">{value}</p>
    </div>
  </div>
);

const ContactInfo = forwardRef<HTMLDivElement>((_, ref) => {
  const contactItems: ContactInfoItemProps[] = [
    {
      icon: <Mail className="w-5 h-5" />,
      label: "Email",
      value: "contact@example.com",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: "Téléphone",
      value: "+33 6 12 34 56 78",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: "Localisation",
      value: "Paris, France",
    },
  ];

  return (
    <div ref={ref} className="space-y-8 opacity-0">
      <div>
        <h3 className="text-2xl font-bold mb-6">Restons en contact</h3>
        <p className="text-muted-foreground mb-8">
          N'hésitez pas à me contacter pour discuter de vos projets ou
          simplement pour échanger sur le design et le développement.
        </p>
      </div>
      <div className="space-y-4">
        {contactItems.map((item, index) => (
          <ContactInfoItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
});

ContactInfo.displayName = "ContactInfo";

export default ContactInfo;
