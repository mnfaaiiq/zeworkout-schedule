"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, SearchIcon, EditIcon, Trash2Icon } from "lucide-react";
import { WorkoutFormModal } from "@/components/workout/WorkoutFormModal";
import { useWorkoutSchedule, WorkoutEntry } from "@/hooks/useWorkoutSchedule"; // Import WorkoutEntry from the hook
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // Import toast
import { ThemeToggle } from "@/components/ui/theme-toggle"; // Import ThemeToggle
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutEntry | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDay, setFilterDay] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");

  const { schedule, addWorkout, updateWorkout, deleteWorkout } =
    useWorkoutSchedule();

  const daysOfWeek = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
  ];
  const categories = ["All", "cardio", "strength", "flexibility", "other"]; // Include "All" option

  const filteredSchedule = useMemo(() => {
    let filtered = schedule;

    // Filter by day
    if (filterDay !== "All") {
      filtered = { [filterDay]: schedule[filterDay] || [] };
    }

    // Filter by category and search term within the filtered days
    const result: { [key: string]: WorkoutEntry[] } = {};
    for (const day in filtered) {
      if (filtered[day]) {
        result[day] = filtered[day].filter((workout) => {
          const matchesSearch = workout.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const matchesCategory =
            filterCategory === "All" ||
            workout.category.toLowerCase() === filterCategory.toLowerCase();
          return matchesSearch && matchesCategory;
        });
      }
    }
    return result;
  }, [schedule, searchTerm, filterDay, filterCategory]);

  const handleAddWorkoutClick = () => {
    setEditingWorkout(null); // Ensure no workout is being edited when adding
    setIsModalOpen(true);
  };

  const handleEditWorkoutClick = (workout: WorkoutEntry) => {
    setEditingWorkout(workout);
    setIsModalOpen(true);
  };

  const handleDeleteWorkoutClick = (id: string, day: string) => {
    if (window.confirm("Are you sure you want to delete this workout?")) {
      deleteWorkout(id, day);
      toast.success("Workout deleted successfully!"); // Add toast notification
    }
  };

  const handleModalSubmit = (workout: Omit<WorkoutEntry, "id">) => {
    if (editingWorkout) {
      // Explicitly cast to WorkoutEntry to match the expected type
      updateWorkout({ ...workout, id: editingWorkout.id } as WorkoutEntry);
      toast.success("Workout updated successfully!"); // Add toast notification
    } else {
      addWorkout(workout);
      toast.success("Workout added successfully!"); // Add toast notification
    }
    setIsModalOpen(false); // Close modal after submit
    setEditingWorkout(null); // Clear editing workout after submit
  };

  const handleModalOpenChange = (open: boolean) => {
    setIsModalOpen(open);
    if (!open) {
      setEditingWorkout(null); // Clear editing workout when modal closes
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Weekly Workout Schedule</h1>
        <div className="flex gap-4 items-center">
          {" "}
          {/* Flex container for button and toggle */}
          <Button onClick={handleAddWorkoutClick}>
            <PlusIcon className="mr-2 h-4 w-4" /> Add Workout
          </Button>
          <ThemeToggle /> {/* Add ThemeToggle component */}
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workouts..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterDay} onValueChange={setFilterDay}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Days</SelectItem>
            {daysOfWeek.map((day) => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {daysOfWeek.map(
          (day) =>
            // Only render card if there are filtered workouts for the day
            filteredSchedule[day] && filteredSchedule[day].length > 0 ? (
              <Card key={day}>
                <CardHeader>
                  <CardTitle>{day}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul>
                    {filteredSchedule[day].map((workout) => (
                      <li
                        key={workout.id}
                        className="mb-2 flex justify-between items-center"
                      >
                        <div>
                          <strong>{workout.name}</strong> - {workout.duration}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditWorkoutClick(workout)}
                          >
                            <EditIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDeleteWorkoutClick(workout.id, workout.day)
                            }
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ) : filterDay === "All" ? ( // Show empty card only if not filtering by a specific day
              <Card key={day}>
                <CardHeader>
                  <CardTitle>{day}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    No workouts scheduled.
                  </p>
                </CardContent>
              </Card>
            ) : null // Don't show empty card if filtering by a specific day and it has no results
        )}
      </div>

      <WorkoutFormModal
        isOpen={isModalOpen}
        onOpenChange={handleModalOpenChange}
        onSubmit={handleModalSubmit}
        initialData={editingWorkout} // Pass initial data for editing
      />
    </div>
  );
}
