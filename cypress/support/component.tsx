import { mount } from "cypress/react18";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import "@/index.css";

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

Cypress.Commands.add("mount", (component, options = {}) => {
  const wrapped = (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
          {component}
          <Toaster />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );

  return mount(wrapped, options);
});
