import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import ProjectManager from "@/components/admin/ProjectManager";

const Admin = () => {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
      } else if (!isAdmin) {
        navigate("/");
      } else {
        setChecking(false);
      }
    }
  }, [user, loading, isAdmin, navigate]);

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Administration</h1>
            <p className="text-muted-foreground">Gérez vos projets design et développement</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            Retour au portfolio
          </Button>
        </div>

        <Tabs defaultValue="dev" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="dev">Projets Dev</TabsTrigger>
            <TabsTrigger value="design">Projets Design</TabsTrigger>
          </TabsList>

          <TabsContent value="dev" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Projets de Développement</CardTitle>
                <CardDescription>
                  Gérez vos projets de développement web et applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectManager projectType="dev" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Projets de Design</CardTitle>
                <CardDescription>
                  Gérez vos projets de design graphique et UI/UX
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectManager projectType="design" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
