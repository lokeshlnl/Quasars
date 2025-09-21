import { 
  type User, type InsertUser,
  type Patient, type InsertPatient,
  type Doctor, type InsertDoctor,
  type Appointment, type InsertAppointment,
  type HealthEvent, type InsertHealthEvent,
  type ChatMessage, type InsertChatMessage,
  type Pharmacy, type InsertPharmacy,
  type MedicationStock, type InsertMedicationStock
} from "@shared/schema";
import { randomUUID } from "crypto";

// Healthcare storage interface
export interface IStorage {
  // Legacy user methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Patient methods
  getPatient(id: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: string, patient: Partial<InsertPatient>): Promise<Patient | undefined>;
  
  // Doctor methods
  getAllDoctors(): Promise<Doctor[]>;
  getDoctor(id: string): Promise<Doctor | undefined>;
  getDoctorsBySpecialty(specialty: string): Promise<Doctor[]>;
  createDoctor(doctor: InsertDoctor): Promise<Doctor>;
  updateDoctorAvailability(id: string, isAvailable: boolean): Promise<Doctor | undefined>;
  
  // Appointment methods
  getAppointmentsByPatient(patientId: string): Promise<Appointment[]>;
  getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointmentStatus(id: string, status: string): Promise<Appointment | undefined>;
  
  // Health events methods
  getHealthEventsByPatient(patientId: string): Promise<HealthEvent[]>;
  createHealthEvent(event: InsertHealthEvent): Promise<HealthEvent>;
  
  // Chat methods
  getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Pharmacy methods
  getAllPharmacies(): Promise<Pharmacy[]>;
  getPharmacy(id: string): Promise<Pharmacy | undefined>;
  getMedicationStock(pharmacyId: string, medicationName: string): Promise<MedicationStock | undefined>;
  updateMedicationStock(pharmacyId: string, medicationName: string, stockStatus: string): Promise<MedicationStock>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private patients: Map<string, Patient>;
  private doctors: Map<string, Doctor>;
  private appointments: Map<string, Appointment>;
  private healthEvents: Map<string, HealthEvent>;
  private chatMessages: Map<string, ChatMessage>;
  private pharmacies: Map<string, Pharmacy>;
  private medicationStock: Map<string, MedicationStock>;

  constructor() {
    this.users = new Map();
    this.patients = new Map();
    this.doctors = new Map();
    this.appointments = new Map();
    this.healthEvents = new Map();
    this.chatMessages = new Map();
    this.pharmacies = new Map();
    this.medicationStock = new Map();
    
    // Initialize with mock data
    this.initializeMockData();
  }

  private async initializeMockData() {
    // Create demo patient for testing
    const demoPatient = {
      name: 'Demo Patient',
      age: 12,
      conditionType: 'ADHD',
      contact: 'demo@example.com',
      emergencyContact: 'parent@example.com'
    };
    
    const patient = await this.createPatient(demoPatient);
    // Override the ID to be predictable for demo
    const demoPatientWithId = { ...patient, id: 'demo-patient-123' };
    this.patients.set('demo-patient-123', demoPatientWithId);
    
    // Create mock doctors
    const mockDoctors = [
      {
        name: 'Dr. Sarah Chen',
        specialty: 'Pediatric Neurologist',
        hospital: 'Rural Community Health Center',
        phone: '(555) 123-4567',
        isAvailable: true,
        rating: 48, // 4.8 stars
        distance: '1.2 km'
      },
      {
        name: 'Dr. Michael Rodriguez',
        specialty: 'ADHD Specialist', 
        hospital: 'Mountain View Clinic',
        phone: '(555) 987-6543',
        isAvailable: false,
        rating: 46,
        distance: '2.5 km'
      },
      {
        name: 'Dr. Emily Watson',
        specialty: 'Family Medicine',
        hospital: 'Valley Health Services',
        phone: '(555) 456-7890',
        isAvailable: true,
        rating: 49,
        distance: '0.8 km'
      }
    ];
    
    for (const doctorData of mockDoctors) {
      await this.createDoctor(doctorData);
    }
    
    // Create mock pharmacies
    const mockPharmacies = [
      {
        name: 'Green Valley Pharmacy',
        address: '123 Main Street, Valley Town',
        phone: '(555) 123-4567',
        hours: 'Open until 8:00 PM',
        distance: '0.5 km'
      },
      {
        name: 'Mountain View Drugs',
        address: '456 Hill Road, Highland',
        phone: '(555) 987-6543',
        hours: 'Open 24 hours',
        distance: '1.2 km'
      }
    ];
    
    for (const pharmacyData of mockPharmacies) {
      const pharmacy = await this.createPharmacy(pharmacyData);
      
      // Add some medication stock for the pharmacies
      const medications = [
        { name: 'Methylphenidate (Ritalin)', status: 'in-stock' },
        { name: 'Aripiprazole (Abilify)', status: 'low-stock' },
        { name: 'Sertraline (Zoloft)', status: 'out-of-stock' }
      ];
      
      for (const med of medications) {
        await this.updateMedicationStock(pharmacy.id, med.name, med.status);
      }
    }
  }

  // Legacy user methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Patient methods
  async getPatient(id: string): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = randomUUID();
    const now = new Date();
    const patient: Patient = { 
      ...insertPatient,
      emergencyContact: insertPatient.emergencyContact ?? null,
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.patients.set(id, patient);
    return patient;
  }

  async updatePatient(id: string, updates: Partial<InsertPatient>): Promise<Patient | undefined> {
    const patient = this.patients.get(id);
    if (!patient) return undefined;
    
    const updatedPatient = { 
      ...patient, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.patients.set(id, updatedPatient);
    return updatedPatient;
  }
  
  // Doctor methods
  async getAllDoctors(): Promise<Doctor[]> {
    return Array.from(this.doctors.values());
  }

  async getDoctor(id: string): Promise<Doctor | undefined> {
    return this.doctors.get(id);
  }

  async getDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
    return Array.from(this.doctors.values()).filter(
      doctor => doctor.specialty.toLowerCase().includes(specialty.toLowerCase())
    );
  }

  async createDoctor(insertDoctor: InsertDoctor): Promise<Doctor> {
    const id = randomUUID();
    const doctor: Doctor = { 
      ...insertDoctor,
      phone: insertDoctor.phone ?? null,
      email: insertDoctor.email ?? null,
      isAvailable: insertDoctor.isAvailable ?? true,
      rating: insertDoctor.rating ?? 0,
      distance: insertDoctor.distance ?? null,
      id, 
      createdAt: new Date()
    };
    this.doctors.set(id, doctor);
    return doctor;
  }

  async updateDoctorAvailability(id: string, isAvailable: boolean): Promise<Doctor | undefined> {
    const doctor = this.doctors.get(id);
    if (!doctor) return undefined;
    
    const updatedDoctor = { ...doctor, isAvailable };
    this.doctors.set(id, updatedDoctor);
    return updatedDoctor;
  }
  
  // Appointment methods
  async getAppointmentsByPatient(patientId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      appointment => appointment.patientId === patientId
    );
  }

  async getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      appointment => appointment.doctorId === doctorId
    );
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = { 
      ...insertAppointment,
      status: insertAppointment.status ?? "upcoming",
      notes: insertAppointment.notes ?? null,
      id, 
      createdAt: new Date()
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    
    const updatedAppointment = { ...appointment, status };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }
  
  // Health events methods
  async getHealthEventsByPatient(patientId: string): Promise<HealthEvent[]> {
    return Array.from(this.healthEvents.values())
      .filter(event => event.patientId === patientId)
      .sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
  }

  async createHealthEvent(insertEvent: InsertHealthEvent): Promise<HealthEvent> {
    const id = randomUUID();
    const event: HealthEvent = { 
      ...insertEvent,
      status: insertEvent.status ?? "completed",
      doctorId: insertEvent.doctorId ?? null,
      metadata: insertEvent.metadata ?? null,
      id, 
      createdAt: new Date()
    };
    this.healthEvents.set(id, event);
    return event;
  }
  
  // Chat methods
  async getChatMessagesBySession(sessionId: string): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(message => message.sessionId === sessionId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = { 
      ...insertMessage,
      severity: insertMessage.severity ?? null,
      id, 
      createdAt: new Date()
    };
    this.chatMessages.set(id, message);
    return message;
  }
  
  // Pharmacy methods
  async getAllPharmacies(): Promise<Pharmacy[]> {
    return Array.from(this.pharmacies.values());
  }

  async getPharmacy(id: string): Promise<Pharmacy | undefined> {
    return this.pharmacies.get(id);
  }

  async createPharmacy(insertPharmacy: InsertPharmacy): Promise<Pharmacy> {
    const id = randomUUID();
    const pharmacy: Pharmacy = { 
      ...insertPharmacy,
      phone: insertPharmacy.phone ?? null,
      hours: insertPharmacy.hours ?? null,
      distance: insertPharmacy.distance ?? null,
      latitude: insertPharmacy.latitude ?? null,
      longitude: insertPharmacy.longitude ?? null,
      id, 
      createdAt: new Date()
    };
    this.pharmacies.set(id, pharmacy);
    return pharmacy;
  }

  async getMedicationStock(pharmacyId: string, medicationName: string): Promise<MedicationStock | undefined> {
    return Array.from(this.medicationStock.values()).find(
      stock => stock.pharmacyId === pharmacyId && stock.medicationName === medicationName
    );
  }

  async updateMedicationStock(pharmacyId: string, medicationName: string, stockStatus: string): Promise<MedicationStock> {
    const existing = await this.getMedicationStock(pharmacyId, medicationName);
    
    if (existing) {
      const updated = { ...existing, stockStatus, lastUpdated: new Date() };
      this.medicationStock.set(existing.id, updated);
      return updated;
    } else {
      const id = randomUUID();
      const newStock: MedicationStock = {
        id,
        pharmacyId,
        medicationName,
        stockStatus,
        lastUpdated: new Date()
      };
      this.medicationStock.set(id, newStock);
      return newStock;
    }
  }
}

export const storage = new MemStorage();
