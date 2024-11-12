import { Express } from "express";
import { setupAuth } from "./auth";
import { db } from "db";
import { workoutPlans, workoutPlanSchema, muscleGroups } from "db/schema";
import { eq } from "drizzle-orm";

const exerciseDatabase = {
  chest: ["Bench Press", "Push-ups", "Dumbbell Flyes"],
  back: ["Pull-ups", "Rows", "Lat Pulldowns"],
  shoulders: ["Overhead Press", "Lateral Raises", "Front Raises"],
  biceps: ["Curls", "Hammer Curls", "Preacher Curls"],
  triceps: ["Tricep Extensions", "Dips", "Skull Crushers"],
  quadriceps: ["Squats", "Leg Press", "Lunges"],
  hamstrings: ["Deadlifts", "Leg Curls", "Good Mornings"],
  calves: ["Calf Raises", "Jump Rope", "Box Jumps"],
  glutes: ["Hip Thrusts", "Glute Bridges", "Bulgarian Split Squats"],
  abs: ["Crunches", "Planks", "Leg Raises"],
  obliques: ["Russian Twists", "Side Planks", "Wood Chops"],
  lower_back: ["Back Extensions", "Superman Holds", "Bird Dogs"],
};

function getMuscleGroupsByCategory(category: string): string[] {
  switch (category) {
    case "upper":
      return muscleGroups.upper;
    case "lower":
      return muscleGroups.lower;
    case "combined":
      return [...muscleGroups.upper, ...muscleGroups.lower];
    default:
      return [];
  }
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateExercises(category: string) {
  const availableMuscleGroups = getMuscleGroupsByCategory(category);
  const selectedMuscleGroups = getRandomElements(
    availableMuscleGroups,
    Math.floor(Math.random() * 3) + 4 // 4-6 exercises
  );

  return selectedMuscleGroups.map((group) => {
    const groupExercises = exerciseDatabase[group as keyof typeof exerciseDatabase];
    return {
      name: groupExercises[Math.floor(Math.random() * groupExercises.length)],
      sets: Math.floor(Math.random() * 3) + 3,
      reps: Math.floor(Math.random() * 8) + 8,
      muscleGroup: group,
      intensity: Math.floor(Math.random() * 3) + 2,
    };
  });
}

export function registerRoutes(app: Express) {
  setupAuth(app);

  app.get("/api/workouts", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userWorkouts = await db
      .select()
      .from(workoutPlans)
      .where(eq(workoutPlans.userId, req.user.id));

    res.json(userWorkouts);
  });

  app.post("/api/workouts", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, category } = req.body;
    
    const exercises = generateExercises(category);
    const workout = {
      userId: req.user.id,
      name,
      category,
      exercises,
      isCompleted: false,
    };

    const result = workoutPlanSchema.safeParse({ ...workout, exercises });
    if (!result.success) {
      return res.status(400).json({ message: "Invalid workout plan" });
    }

    const [newWorkout] = await db
      .insert(workoutPlans)
      .values(workout)
      .returning();

    res.json(newWorkout);
  });

  app.post("/api/workouts/:id/complete", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const workoutId = parseInt(req.params.id);
    const [workout] = await db
      .select()
      .from(workoutPlans)
      .where(eq(workoutPlans.id, workoutId))
      .limit(1);

    if (!workout || workout.userId !== req.user.id) {
      return res.status(404).json({ message: "Workout not found" });
    }

    const [updated] = await db
      .update(workoutPlans)
      .set({ isCompleted: !workout.isCompleted })
      .where(eq(workoutPlans.id, workoutId))
      .returning();

    res.json(updated);
  });

  app.delete("/api/workouts/:id", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const workoutId = parseInt(req.params.id);
    const [workout] = await db
      .select()
      .from(workoutPlans)
      .where(eq(workoutPlans.id, workoutId))
      .limit(1);

    if (!workout || workout.userId !== req.user.id) {
      return res.status(404).json({ message: "Workout not found" });
    }

    await db
      .delete(workoutPlans)
      .where(eq(workoutPlans.id, workoutId));

    res.json({ message: "Workout deleted successfully" });
  });
}
