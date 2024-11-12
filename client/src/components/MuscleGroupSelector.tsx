import { muscleGroups } from "db/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MuscleGroupSelectorProps {
  selected: string[];
  onSelect: (group: string) => void;
}

export default function MuscleGroupSelector({
  selected,
  onSelect,
}: MuscleGroupSelectorProps) {
  const allGroups = [
    ...muscleGroups.upper,
    ...muscleGroups.lower,
    ...muscleGroups.core,
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {allGroups.map((group) => (
        <Button
          key={group}
          variant="outline"
          className={cn(
            "capitalize",
            selected.includes(group) &&
              "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
          onClick={() => onSelect(group)}
        >
          {group.replace("_", " ")}
        </Button>
      ))}
    </div>
  );
}
