"use client";

import { useState, useEffect } from "react";

// Define the data structure for a workout entry
export interface WorkoutEntry {
  // Export the interface
  id: string;
  name: string;
  description?: string;
  duration: string;
  day: "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat" | "Sabtu" | "Minggu"; // Use the specific day enum type
  category: string;
}

const LOCAL_STORAGE_KEY = "workoutSchedule";

export function useWorkoutSchedule() {
  const [schedule, setSchedule] = useState<{ [key: string]: WorkoutEntry[] }>(
    {}
  );

  // Load data from localStorage on initial mount
  useEffect(() => {
    const storedSchedule = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedSchedule) {
      setSchedule(JSON.parse(storedSchedule));
    }
  }, []);

  // Save data to localStorage whenever the schedule state changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(schedule));
  }, [schedule]);

  const addWorkout = (workout: Omit<WorkoutEntry, "id">) => {
    const newWorkout: WorkoutEntry = {
      id: Date.now().toString(), // Simple unique ID
      ...workout,
    };
    setSchedule((prevSchedule) => {
      const day = newWorkout.day;
      return {
        ...prevSchedule,
        [day]: [...(prevSchedule[day] || []), newWorkout],
      };
    });
  };

  const updateWorkout = (updatedWorkout: WorkoutEntry) => {
    setSchedule((prevSchedule) => {
      const day = updatedWorkout.day;
      const updatedDaySchedule = (prevSchedule[day] || []).map((workout) =>
        workout.id === updatedWorkout.id ? updatedWorkout : workout
      );
      return {
        ...prevSchedule,
        [day]: updatedDaySchedule,
      };
    });
  };

  const deleteWorkout = (id: string, day: string) => {
    setSchedule((prevSchedule) => {
      const updatedDaySchedule = (prevSchedule[day] || []).filter(
        (workout) => workout.id !== id
      );
      return {
        ...prevSchedule,
        [day]: updatedDaySchedule,
      };
    });
  };

  return {
    schedule,
    addWorkout,
    updateWorkout,
    deleteWorkout,
  };
}
