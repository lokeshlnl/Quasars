import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPatientSchema,
  insertDoctorSchema,
  insertAppointmentSchema,
  insertHealthEventSchema,
  insertChatMessageSchema,
  insertPharmacySchema
} from "@shared/schema";
import { z } from "zod";
import { HealthcareAIService } from "./ai-service";

const aiService = new HealthcareAIService();

// Enhanced schemas with proper validation
const enhancedAppointmentSchema = insertAppointmentSchema.extend({
  appointmentDate: z.coerce.date(),
  status: z.enum(["upcoming", "completed", "cancelled"]).optional(),
  type: z.enum(["consultation", "follow-up", "assessment"])
});

const enhancedHealthEventSchema = insertHealthEventSchema.extend({
  eventDate: z.coerce.date(),
  type: z.enum(["appointment", "prescription", "test", "note"]),
  status: z.enum(["completed", "upcoming", "cancelled"]).optional()
});

const enhancedChatMessageSchema = insertChatMessageSchema.extend({
  type: z.enum(["user", "ai"]),
  severity: z.enum(["mild", "moderate", "severe"]).optional()
});

const medicationStockUpdateSchema = z.object({
  stockStatus: z.enum(["in-stock", "low-stock", "out-of-stock"])
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Patient routes
  app.post('/api/patients', async (req, res) => {
    try {
      const validatedData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(validatedData);
      res.json(patient);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid patient data' });
    }
  });

  app.get('/api/patients/:id', async (req, res) => {
    try {
      const patient = await storage.getPatient(req.params.id);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch patient' });
    }
  });

  // Doctor routes
  app.get('/api/doctors', async (req, res) => {
    try {
      const { specialty } = req.query;
      const doctors = specialty 
        ? await storage.getDoctorsBySpecialty(specialty as string)
        : await storage.getAllDoctors();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch doctors' });
    }
  });

  app.get('/api/doctors/:id', async (req, res) => {
    try {
      const doctor = await storage.getDoctor(req.params.id);
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      res.json(doctor);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch doctor' });
    }
  });

  app.post('/api/doctors', async (req, res) => {
    try {
      const validatedData = insertDoctorSchema.parse(req.body);
      const doctor = await storage.createDoctor(validatedData);
      res.json(doctor);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid doctor data' });
    }
  });

  // Appointment routes
  app.post('/api/appointments', async (req, res) => {
    try {
      const validatedData = enhancedAppointmentSchema.parse(req.body);
      
      // Verify patient and doctor exist
      const patient = await storage.getPatient(validatedData.patientId);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      
      const doctor = await storage.getDoctor(validatedData.doctorId);
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      
      const appointment = await storage.createAppointment(validatedData);
      res.json(appointment);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid appointment data' });
    }
  });

  app.get('/api/appointments/patient/:patientId', async (req, res) => {
    try {
      const appointments = await storage.getAppointmentsByPatient(req.params.patientId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch appointments' });
    }
  });

  app.patch('/api/appointments/:id/status', async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }
      const appointment = await storage.updateAppointmentStatus(req.params.id, status);
      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found' });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update appointment' });
    }
  });

  // Health events routes
  app.get('/api/health-events/patient/:patientId', async (req, res) => {
    try {
      // Verify patient exists
      const patient = await storage.getPatient(req.params.patientId);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      
      const events = await storage.getHealthEventsByPatient(req.params.patientId);
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch health events' });
    }
  });

  app.post('/api/health-events', async (req, res) => {
    try {
      const validatedData = enhancedHealthEventSchema.parse(req.body);
      
      // Verify patient exists
      const patient = await storage.getPatient(validatedData.patientId);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      
      // Verify doctor exists if specified
      if (validatedData.doctorId) {
        const doctor = await storage.getDoctor(validatedData.doctorId);
        if (!doctor) {
          return res.status(404).json({ error: 'Doctor not found' });
        }
      }
      
      const event = await storage.createHealthEvent(validatedData);
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid health event data' });
    }
  });

  // Chat routes
  app.get('/api/chat/:sessionId', async (req, res) => {
    try {
      const messages = await storage.getChatMessagesBySession(req.params.sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch chat messages' });
    }
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const validatedData = enhancedChatMessageSchema.parse(req.body);
      
      // Verify patient exists
      const patient = await storage.getPatient(validatedData.patientId);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      
      const message = await storage.createChatMessage(validatedData);
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid chat message data' });
    }
  });

  // AI Chat endpoint
  app.post('/api/ai-chat', async (req, res) => {
    try {
      const { patientId, message, sessionId } = z.object({
        patientId: z.string(),
        message: z.string(),
        sessionId: z.string()
      }).parse(req.body);
      
      // Verify patient exists
      const patient = await storage.getPatient(patientId);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      
      // Get chat history for context
      const chatHistory = await storage.getChatMessagesBySession(sessionId);
      const formattedHistory = chatHistory.map(msg => ({
        role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));
      
      // Save user message
      const userMessage = await storage.createChatMessage({
        patientId,
        type: 'user',
        content: message,
        sessionId
      });
      
      // Generate AI response
      const aiResult = await aiService.generateResponse(
        message,
        formattedHistory,
        patient.age,
        patient.conditionType
      );
      
      // Save AI response
      const aiMessage = await storage.createChatMessage({
        patientId,
        type: 'ai',
        content: aiResult.response,
        sessionId,
        severity: aiResult.severity
      });
      
      res.json({
        userMessage,
        aiMessage,
        severity: aiResult.severity
      });
    } catch (error) {
      console.error('AI chat error:', error);
      res.status(500).json({ error: 'Failed to process AI chat' });
    }
  });
  
  // Symptom assessment endpoint
  app.post('/api/assess-symptoms', async (req, res) => {
    try {
      const { patientId, symptoms } = z.object({
        patientId: z.string(),
        symptoms: z.string()
      }).parse(req.body);
      
      // Verify patient exists
      const patient = await storage.getPatient(patientId);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      
      const assessment = await aiService.assessSymptoms(
        symptoms,
        patient.age,
        patient.conditionType
      );
      
      // If professional care is required, suggest doctors
      let suggestedDoctors: string[] = [];
      if (assessment.requiresProfessionalCare) {
        suggestedDoctors = await aiService.suggestDoctors(symptoms, assessment.suggestedDoctor);
      }
      
      res.json({
        ...assessment,
        suggestedDoctors
      });
    } catch (error) {
      console.error('Symptom assessment error:', error);
      res.status(500).json({ error: 'Failed to assess symptoms' });
    }
  });

  // Pharmacy routes
  app.get('/api/pharmacies', async (req, res) => {
    try {
      const pharmacies = await storage.getAllPharmacies();
      res.json(pharmacies);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch pharmacies' });
    }
  });

  app.get('/api/pharmacies/:id', async (req, res) => {
    try {
      const pharmacy = await storage.getPharmacy(req.params.id);
      if (!pharmacy) {
        return res.status(404).json({ error: 'Pharmacy not found' });
      }
      res.json(pharmacy);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch pharmacy' });
    }
  });

  app.get('/api/medication-stock/:pharmacyId/:medicationName', async (req, res) => {
    try {
      const stock = await storage.getMedicationStock(req.params.pharmacyId, req.params.medicationName);
      if (!stock) {
        return res.status(404).json({ error: 'Medication stock not found' });
      }
      res.json(stock);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch medication stock' });
    }
  });

  app.put('/api/medication-stock/:pharmacyId/:medicationName', async (req, res) => {
    try {
      const { stockStatus } = medicationStockUpdateSchema.parse(req.body);
      
      // Verify pharmacy exists
      const pharmacy = await storage.getPharmacy(req.params.pharmacyId);
      if (!pharmacy) {
        return res.status(404).json({ error: 'Pharmacy not found' });
      }
      
      const stock = await storage.updateMedicationStock(req.params.pharmacyId, req.params.medicationName, stockStatus);
      res.json(stock);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid stock status' });
    }
  });

  // Additional missing routes
  app.patch('/api/patients/:id', async (req, res) => {
    try {
      const updates = insertPatientSchema.partial().parse(req.body);
      const patient = await storage.updatePatient(req.params.id, updates);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      res.json(patient);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid patient data' });
    }
  });

  app.patch('/api/doctors/:id/availability', async (req, res) => {
    try {
      const { isAvailable } = z.object({ isAvailable: z.boolean() }).parse(req.body);
      const doctor = await storage.updateDoctorAvailability(req.params.id, isAvailable);
      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
      res.json(doctor);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid availability data' });
    }
  });

  app.post('/api/pharmacies', async (req, res) => {
    try {
      const validatedData = insertPharmacySchema.parse(req.body);
      const pharmacy = await storage.createPharmacy(validatedData);
      res.json(pharmacy);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid pharmacy data' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
