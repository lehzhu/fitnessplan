import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Dumbbell, Trash2 } from "lucide-react";
import type { WorkoutPlan } from "db/schema";
import { useWorkouts } from "../hooks/use-workouts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WorkoutCardProps {
  workout: WorkoutPlan;
}

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const { toggleComplete, deleteWorkout } = useWorkouts();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">{workout.name}</CardTitle>
        <Badge variant={workout.category === "upper" ? "default" : "secondary"}>
          {workout.category}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {workout.exercises.map((exercise: any, i: number) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{exercise.name}</p>
                <p className="text-sm text-muted-foreground">
                  {exercise.sets} sets × {exercise.reps} reps
                </p>
              </div>
              <div className="flex items-center gap-2">
                {Array.from({ length: exercise.intensity }).map((_, i) => (
                  <Dumbbell
                    key={i}
                    className="h-4 w-4 text-primary"
                    fill="currentColor"
                  />
                ))}
              </div>
            </div>
          ))}
          
          <div className="flex gap-2">
            <Button
              variant={workout.isCompleted ? "secondary" : "default"}
              className="flex-1"
              onClick={() => toggleComplete(workout.id)}
            >
              {workout.isCompleted ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" /> Completed
                </>
              ) : (
                "Mark as Complete"
              )}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Workout Plan</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this workout plan? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => deleteWorkout(workout.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
