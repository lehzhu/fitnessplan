import { pgTable, text, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const workoutPlans = pgTable("workout_plans", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  category: text("category").notNull(), // "upper", "lower", "combined"
  exercises: jsonb("exercises").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  isCompleted: boolean("is_completed").default(false),
});

export const muscleGroups = {
  upper: ["chest", "back", "shoulders", "biceps", "triceps"],
  lower: ["quadriceps", "hamstrings", "calves", "glutes"],
  core: ["abs", "obliques", "lower_back"],
} as const;

export const exerciseSchema = z.object({
  name: z.string(),
  sets: z.number(),
  reps: z.number(),
  muscleGroup: z.string(),
  intensity: z.number().min(1).max(5),
});

export type Exercise = z.infer<typeof exerciseSchema>;

export const workoutPlanSchema = z.object({
  name: z.string(),
  category: z.enum(["upper", "lower", "combined"]),
  exercises: z.array(exerciseSchema),
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const insertWorkoutPlanSchema = createInsertSchema(workoutPlans);
export const selectWorkoutPlanSchema = createSelectSchema(workoutPlans);

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof selectUserSchema>;
export type WorkoutPlan = z.infer<typeof selectWorkoutPlanSchema>;
