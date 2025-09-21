import OpenAI from "openai";
import { storage } from "./storage";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface SymptomAssessment {
  severity: "mild" | "moderate" | "severe";
  recommendation: string;
  requiresProfessionalCare: boolean;
  suggestedDoctor?: string;
  selfCareAdvice?: string;
}

export class HealthcareAIService {
  async assessSymptoms(
    userMessage: string,
    patientAge?: number,
    conditionType?: string
  ): Promise<SymptomAssessment> {
    try {
      const systemPrompt = `You are a healthcare AI assistant specializing in rural healthcare, autism, and ADHD support. 
      Your role is to provide initial symptom assessment and guidance, NOT to diagnose or replace professional medical care.
      
      Guidelines:
      - Assess symptom severity as mild, moderate, or severe
      - Provide clear recommendations about seeking professional care
      - Offer appropriate self-care advice for mild symptoms
      - Be especially sensitive to autism and ADHD symptoms
      - Consider rural healthcare access limitations
      - Always err on the side of caution for severe symptoms
      
      Respond with JSON in this exact format:
      {
        "severity": "mild|moderate|severe",
        "recommendation": "Clear recommendation text",
        "requiresProfessionalCare": true|false,
        "suggestedDoctor": "Optional doctor specialty",
        "selfCareAdvice": "Optional self-care advice"
      }`;

      const userPrompt = `Patient details:
      Age: ${patientAge || "Not specified"}
      Condition: ${conditionType || "Not specified"}
      
      Symptoms/Message: ${userMessage}
      
      Please assess these symptoms and provide guidance.`;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      // Validate and normalize the response
      return {
        severity: ["mild", "moderate", "severe"].includes(result.severity) 
          ? result.severity 
          : "moderate",
        recommendation: result.recommendation || "Please monitor symptoms and consult a healthcare provider if they persist.",
        requiresProfessionalCare: Boolean(result.requiresProfessionalCare),
        suggestedDoctor: result.suggestedDoctor,
        selfCareAdvice: result.selfCareAdvice
      };
    } catch (error) {
      console.error("AI assessment error:", error);
      // Return safe fallback
      return {
        severity: "moderate",
        recommendation: "I'm unable to assess your symptoms right now. Please consult with a healthcare provider for proper evaluation.",
        requiresProfessionalCare: true,
        suggestedDoctor: "General Practitioner"
      };
    }
  }

  async generateResponse(
    userMessage: string,
    sessionHistory: Array<{ role: "user" | "assistant"; content: string }> = [],
    patientAge?: number,
    conditionType?: string
  ): Promise<{ response: string; severity?: "mild" | "moderate" | "severe" }> {
    try {
      const systemPrompt = `You are a compassionate healthcare AI assistant for rural communities, specializing in autism and ADHD support.
      
      Your capabilities:
      - Provide health education and general wellness advice
      - Offer coping strategies for ADHD and autism symptoms
      - Guide users to appropriate medical care when needed
      - Suggest breathing exercises, mindfulness, and focus techniques
      - Provide medication reminders and adherence support
      
      Guidelines:
      - Be warm, empathetic, and easy to understand
      - Use simple language suitable for all education levels
      - Never diagnose or prescribe medication
      - Always recommend professional care for serious symptoms
      - Provide practical, actionable advice
      - Be culturally sensitive to rural community needs
      
      Patient context:
      Age: ${patientAge || "Not specified"}
      Condition: ${conditionType || "Not specified"}`;

      const messages = [
        { role: "system" as const, content: systemPrompt },
        ...sessionHistory.slice(-6), // Keep last 3 exchanges for context
        { role: "user" as const, content: userMessage }
      ];

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages,
        max_tokens: 300
      });

      const aiResponse = response.choices[0].message.content || 
        "I understand you're looking for help. Please consider speaking with a healthcare provider for personalized guidance.";

      // Detect if this might be a symptom-related query
      const isSymptomQuery = userMessage.toLowerCase().includes('symptom') || 
                           userMessage.toLowerCase().includes('pain') ||
                           userMessage.toLowerCase().includes('feel') ||
                           userMessage.toLowerCase().includes('trouble') ||
                           userMessage.toLowerCase().includes('difficulty');

      let severity: "mild" | "moderate" | "severe" | undefined;
      
      if (isSymptomQuery) {
        const assessment = await this.assessSymptoms(userMessage, patientAge, conditionType);
        severity = assessment.severity;
      }

      return {
        response: aiResponse,
        severity
      };
    } catch (error) {
      console.error("AI response error:", error);
      return {
        response: "I'm having trouble responding right now. Please try again later or contact a healthcare provider if this is urgent."
      };
    }
  }

  async suggestDoctors(symptoms: string, specialty?: string): Promise<string[]> {
    try {
      // Get available doctors
      const doctors = await storage.getAllDoctors();
      const availableDoctors = doctors.filter(d => d.isAvailable);

      if (availableDoctors.length === 0) {
        return ["No doctors are currently available. Please try again later."];
      }

      // Simple matching based on specialty
      let relevantDoctors = availableDoctors;
      
      if (specialty) {
        relevantDoctors = availableDoctors.filter(d => 
          d.specialty.toLowerCase().includes(specialty.toLowerCase())
        );
      }

      // If no specialty match, use symptom-based matching
      if (relevantDoctors.length === 0) {
        const lowerSymptoms = symptoms.toLowerCase();
        if (lowerSymptoms.includes('adhd') || lowerSymptoms.includes('focus') || lowerSymptoms.includes('attention')) {
          relevantDoctors = availableDoctors.filter(d => 
            d.specialty.toLowerCase().includes('adhd') || 
            d.specialty.toLowerCase().includes('neurologist')
          );
        } else if (lowerSymptoms.includes('autism') || lowerSymptoms.includes('social') || lowerSymptoms.includes('behavior')) {
          relevantDoctors = availableDoctors.filter(d => 
            d.specialty.toLowerCase().includes('psychology') || 
            d.specialty.toLowerCase().includes('neurologist')
          );
        }
      }

      // Fallback to general practitioners
      if (relevantDoctors.length === 0) {
        relevantDoctors = availableDoctors.filter(d => 
          d.specialty.toLowerCase().includes('family') || 
          d.specialty.toLowerCase().includes('general')
        );
      }

      // Final fallback to any available doctor
      if (relevantDoctors.length === 0) {
        relevantDoctors = availableDoctors.slice(0, 2);
      }

      return relevantDoctors.slice(0, 3).map(d => 
        `Dr. ${d.name} (${d.specialty}) at ${d.hospital}`
      );
    } catch (error) {
      console.error("Doctor suggestion error:", error);
      return ["Please check our doctor directory for available specialists."];
    }
  }
}