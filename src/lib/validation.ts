import { z } from "zod";

// Regex to detect potential SQL injection patterns
const sqlInjectionPattern = /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b|--|\/\*|\*\/)/i;

// Regex to detect potential XSS patterns
const xssPattern = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|javascript:|on\w+\s*=/i;

/**
 * Custom Zod refinement to check for SQL injection attempts
 */
export const noSqlInjection = (value: string) => !sqlInjectionPattern.test(value);

/**
 * Custom Zod refinement to check for XSS attempts
 */
export const noXss = (value: string) => !xssPattern.test(value);

/**
 * Safe string schema that rejects SQL injection and XSS attempts
 */
export const safeString = (minLength: number = 0, maxLength: number = 255) =>
  z
    .string()
    .min(minLength, { message: minLength > 0 ? "Ce champ est requis" : undefined })
    .max(maxLength, { message: `Maximum ${maxLength} caractères` })
    .refine(noSqlInjection, { message: "Caractères non autorisés détectés" })
    .refine(noXss, { message: "Contenu non autorisé détecté" });

/**
 * Safe text schema for longer content (messages, descriptions)
 */
export const safeText = (minLength: number = 0, maxLength: number = 2000) =>
  z
    .string()
    .min(minLength, { message: minLength > 0 ? "Ce champ est requis" : undefined })
    .max(maxLength, { message: `Maximum ${maxLength} caractères` })
    .refine(noSqlInjection, { message: "Caractères non autorisés détectés" })
    .refine(noXss, { message: "Contenu non autorisé détecté" });

/**
 * Email schema with additional safety checks
 */
export const safeEmail = z
  .string()
  .email({ message: "Email invalide" })
  .max(255, { message: "Maximum 255 caractères" })
  .refine(noSqlInjection, { message: "Caractères non autorisés détectés" });

/**
 * Contact form validation schema
 */
export const contactFormSchema = z.object({
  name: safeString(1, 100),
  email: safeEmail,
  subject: z.string().max(200).optional().default("Sans objet"),
  message: safeText(1, 2000),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Project form validation schema
 */
export const projectFormSchema = z.object({
  titre: safeString(1, 200),
  nom_projet: z.string().max(200).optional(),
  description: z.string().max(5000).optional(),
  lien_url: z.string().url({ message: "URL invalide" }).optional().or(z.literal("")),
  github: z.string().url({ message: "URL invalide" }).optional().or(z.literal("")),
  img: z.string().url({ message: "URL invalide" }).optional().or(z.literal("")),
  organisme: z.string().max(200).optional(),
  fini: z.boolean().default(false),
  IA: z.boolean().default(false),
});

/**
 * Skill form validation schema
 */
export const skillFormSchema = z.object({
  name: safeString(1, 100),
  category: safeString(1, 100),
  icon: z.string().max(100).optional(),
});

/**
 * Sanitize a string by removing potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
}

/**
 * Validate and sanitize contact form data
 */
export function validateContactForm(data: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): {
  success: boolean;
  data?: ContactFormData;
  errors?: z.ZodError;
} {
  const result = contactFormSchema.safeParse(data);
  if (result.success) {
    return {
      success: true,
      data: {
        name: sanitizeInput(result.data.name),
        email: result.data.email.toLowerCase().trim(),
        subject: result.data.subject ? sanitizeInput(result.data.subject) : "Sans objet",
        message: sanitizeInput(result.data.message),
      },
    };
  }
  return { success: false, errors: result.error };
}
