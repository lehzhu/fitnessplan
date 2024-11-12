import { useState } from "react";
import { useWorkouts } from "../hooks/use-workouts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function WorkoutGenerator() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("");
  const { generateWorkout } = useWorkouts();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!name || !category) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all fields",
      });
      return;
    }

    await generateWorkout({
      name,
      category: category as "upper" | "lower" | "combined",
    });

    setName("");
    setCategory("");
  };

  return (
    <div className="space-y-4 p-6 border rounded-lg bg-card">
      <h2 className="text-2xl font-bold">Generate New Workout</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Workout Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upper">Upper Body</SelectItem>
            <SelectItem value="lower">Lower Body</SelectItem>
            <SelectItem value="combined">Combined</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full" onClick={handleGenerate}>
        Generate Workout
      </Button>
    </div>
  );
}
