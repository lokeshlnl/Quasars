import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Patients table
export const patients = pgTable("patients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  age: integer("age").notNull(),
  conditionType: text("condition_type").notNull(), // 'autism', 'adhd', 'other'
  contact: text("contact").notNull(),
  emergencyContact: text("emergency_contact"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
});

// Doctors table
export const doctors = pgTable("doctors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  hospital: text("hospital").notNull(),
  phone: text("phone"),
  email: text("email"),
  isAvailable: boolean("is_available").default(true).notNull(),
  rating: integer("rating").default(0), // Store as integer (45 = 4.5 stars)
  distance: text("distance"), // "1.2 km"
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

// Appointments table
export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => patients.id),
  doctorId: varchar("doctor_id").notNull().references(() => doctors.id),
  appointmentDate: timestamp("appointment_date").notNull(),
  status: text("status").notNull().default("upcoming"), // 'upcoming', 'completed', 'cancelled'
  type: text("type").notNull(), // 'consultation', 'follow-up', 'assessment'
  notes: text("notes"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

// Health records/events table
export const healthEvents = pgTable("health_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => patients.id),
  doctorId: varchar("doctor_id").references(() => doctors.id),
  type: text("type").notNull(), // 'appointment', 'prescription', 'test', 'note'
  title: text("title").notNull(),
  description: text("description").notNull(),
  eventDate: timestamp("event_date").notNull(),
  status: text("status").default("completed"), // 'completed', 'upcoming', 'cancelled'
  metadata: jsonb("metadata"), // For storing additional data like prescription details
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").notNull().references(() => patients.id),
  type: text("type").notNull(), // 'user', 'ai'
  content: text("content").notNull(),
  severity: text("severity"), // 'mild', 'moderate', 'severe'
  sessionId: varchar("session_id").notNull(), // Group messages by chat session
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

// Pharmacies table
export const pharmacies = pgTable("pharmacies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone"),
  hours: text("hours"),
  distance: text("distance"), // "0.5 km"
  latitude: text("latitude"),
  longitude: text("longitude"),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

// Medication stock table
export const medicationStock = pgTable("medication_stock", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pharmacyId: varchar("pharmacy_id").notNull().references(() => pharmacies.id),
  medicationName: text("medication_name").notNull(),
  stockStatus: text("stock_status").notNull(), // 'in-stock', 'low-stock', 'out-of-stock'
  lastUpdated: timestamp("last_updated").default(sql`now()`).notNull(),
});

// Create insert schemas
export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDoctorSchema = createInsertSchema(doctors).omit({
  id: true,
  createdAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

export const insertHealthEventSchema = createInsertSchema(healthEvents).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertPharmacySchema = createInsertSchema(pharmacies).omit({
  id: true,
  createdAt: true,
});

export const insertMedicationStockSchema = createInsertSchema(medicationStock).omit({
  id: true,
  lastUpdated: true,
});

// Export types
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Patient = typeof patients.$inferSelect;

export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type Doctor = typeof doctors.$inferSelect;

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

export type InsertHealthEvent = z.infer<typeof insertHealthEventSchema>;
export type HealthEvent = typeof healthEvents.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertPharmacy = z.infer<typeof insertPharmacySchema>;
export type Pharmacy = typeof pharmacies.$inferSelect;

export type InsertMedicationStock = z.infer<typeof insertMedicationStockSchema>;
export type MedicationStock = typeof medicationStock.$inferSelect;

// Legacy user schema (keeping for compatibility)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
