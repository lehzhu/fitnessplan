import { useUser } from "../hooks/use-user";
import { useWorkouts } from "../hooks/use-workouts";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import WorkoutGenerator from "../components/WorkoutGenerator";
import WorkoutCard from "../components/WorkoutCard";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, logout } = useUser();
  const { workouts, isLoading } = useWorkouts();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Welcome, {user.username}!</h1>
          <Button variant="outline" onClick={() => logout()}>
            Logout
          </Button>
        </div>

        <WorkoutGenerator />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div>Loading workouts...</div>
          ) : (
            workouts?.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
