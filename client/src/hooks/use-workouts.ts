import useSWR, { mutate } from "swr";
import { useToast } from "@/hooks/use-toast";
import type { WorkoutPlan } from "db/schema";

interface GenerateWorkoutParams {
  name: string;
  category: "upper" | "lower" | "combined";
}

export function useWorkouts() {
  const { data: workouts, error } = useSWR<WorkoutPlan[]>("/api/workouts");
  const { toast } = useToast();

  const generateWorkout = async (params: GenerateWorkoutParams) => {
    try {
      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error("Failed to generate workout");
      }

      await mutate("/api/workouts");
      toast({
        title: "Success",
        description: "Workout plan generated successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate workout plan",
      });
    }
  };

  const toggleComplete = async (workoutId: number) => {
    try {
      const response = await fetch(`/api/workouts/${workoutId}/complete`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to update workout");
      }

      await mutate("/api/workouts");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update workout status",
      });
    }
  };

  const deleteWorkout = async (workoutId: number) => {
    try {
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete workout");
      }

      await mutate("/api/workouts");
      toast({
        title: "Success",
        description: "Workout plan deleted successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete workout plan",
      });
    }
  };

  return {
    workouts,
    isLoading: !error && !workouts,
    error,
    generateWorkout,
    toggleComplete,
    deleteWorkout,
  };
}
