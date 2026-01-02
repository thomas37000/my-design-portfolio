import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
}

interface Language {
  name: string;
  level: string;
}

interface CVData {
  full_name: string;
  title: string;
  email: string;
  phone: string | null;
  location: string | null;
  summary: string | null;
  experiences: Experience[];
  education: Education[];
  languages: Language[];
  cv_file_url: string | null;
}

const CVDownload = () => {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchCVData();
  }, []);

  const fetchCVData = async () => {
    try {
      const { data, error } = await supabase
        .from("cv_data")
        .select("*")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCvData({
          full_name: data.full_name,
          title: data.title,
          email: data.email,
          phone: data.phone,
          location: data.location,
          summary: data.summary,
          experiences: (data.experiences as unknown as Experience[]) || [],
          education: (data.education as unknown as Education[]) || [],
          languages: (data.languages as unknown as Language[]) || [],
          cv_file_url: data.cv_file_url || null,
        });
      }
    } catch (error) {
      console.error("Error fetching CV:", error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!cvData) return;

    // If there's an uploaded PDF, open it directly
    if (cvData.cv_file_url) {
      window.open(cvData.cv_file_url, "_blank");
      return;
    }

    setGenerating(true);

    // Create a printable HTML version
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      setGenerating(false);
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>CV - ${cvData.full_name}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; color: #333; line-height: 1.6; }
          h1 { font-size: 28px; margin-bottom: 5px; color: #1a1a1a; }
          h2 { font-size: 14px; font-weight: 500; color: #666; margin-bottom: 20px; }
          h3 { font-size: 18px; color: #1a1a1a; margin: 25px 0 15px; padding-bottom: 8px; border-bottom: 2px solid #e0e0e0; }
          .contact { font-size: 13px; color: #666; margin-bottom: 20px; }
          .contact span { margin-right: 15px; }
          .summary { margin-bottom: 20px; color: #555; }
          .item { margin-bottom: 18px; }
          .item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px; }
          .item-title { font-weight: 600; color: #1a1a1a; }
          .item-subtitle { color: #666; font-size: 14px; }
          .item-date { font-size: 13px; color: #888; }
          .item-description { font-size: 14px; color: #555; margin-top: 5px; }
          .languages { display: flex; flex-wrap: wrap; gap: 15px; }
          .language { font-size: 14px; }
          .language-name { font-weight: 500; }
          .language-level { color: #666; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <h1>${cvData.full_name}</h1>
        <h2>${cvData.title}</h2>
        <div class="contact">
          <span>${cvData.email}</span>
          ${cvData.phone ? `<span>${cvData.phone}</span>` : ""}
          ${cvData.location ? `<span>${cvData.location}</span>` : ""}
        </div>
        ${cvData.summary ? `<div class="summary">${cvData.summary}</div>` : ""}
        
        ${cvData.experiences.length > 0 ? `
          <h3>Expériences professionnelles</h3>
          ${cvData.experiences.map(exp => `
            <div class="item">
              <div class="item-header">
                <div>
                  <span class="item-title">${exp.position}</span>
                  <span class="item-subtitle"> - ${exp.company}</span>
                </div>
                <span class="item-date">${exp.startDate} - ${exp.endDate}</span>
              </div>
              ${exp.description ? `<div class="item-description">${exp.description}</div>` : ""}
            </div>
          `).join("")}
        ` : ""}
        
        ${cvData.education.length > 0 ? `
          <h3>Formation</h3>
          ${cvData.education.map(edu => `
            <div class="item">
              <div class="item-header">
                <div>
                  <span class="item-title">${edu.degree}</span>
                  <span class="item-subtitle"> - ${edu.school}</span>
                </div>
                <span class="item-date">${edu.startDate} - ${edu.endDate}</span>
              </div>
            </div>
          `).join("")}
        ` : ""}
        
        ${cvData.languages.length > 0 ? `
          <h3>Langues</h3>
          <div class="languages">
            ${cvData.languages.map(lang => `
              <div class="language">
                <span class="language-name">${lang.name}</span>: 
                <span class="language-level">${lang.level}</span>
              </div>
            `).join("")}
          </div>
        ` : ""}
        
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setGenerating(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!cvData || (!cvData.full_name && !cvData.cv_file_url)) {
    return null;
  }

  return (
    <div className="mt-8 pt-8 border-t border-border">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Mon CV</h3>
          <p className="text-muted-foreground text-sm">Téléchargez mon curriculum vitae</p>
        </div>
        <Button onClick={generatePDF} disabled={generating}>
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          Télécharger CV
        </Button>
      </div>
    </div>
  );
};

export default CVDownload;
