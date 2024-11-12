import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useUser } from "../hooks/use-user";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Custom Workout Plan Generator
        </h1>
        <p className="text-xl text-muted-foreground">
          Generate personalized workout plans based on your target muscle groups
        </p>
        
        <div className="flex gap-4 justify-center">
          {user ? (
            <Link href="/dashboard">
              <Button size="lg">Go to Dashboard</Button>
            </Link>
          ) : (
            <Link href="/auth">
              <Button size="lg">Get Started</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
