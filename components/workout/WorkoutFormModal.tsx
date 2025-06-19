"use client";

import { useEffect } from "react"; // Import useEffect
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Removed DialogTrigger as it's not used here
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

// Define the Zod schema for a workout entry
const workoutFormSchema = z.object({
  name: z.string().min(2, {
    message: "Workout name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  duration: z.string().min(1, {
    message: "Duration is required.",
  }),
  day: z.enum(
    ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
    {
      required_error: "Please select a day.",
    }
  ),
  category: z.string().min(1, {
    message: "Category is required.",
  }),
});

type WorkoutFormValues = z.infer<typeof workoutFormSchema>;

interface WorkoutFormModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (workout: Omit<WorkoutFormValues, "id">) => void;
  initialData?: WorkoutFormValues | null; // Add optional initialData prop
}

export function WorkoutFormModal({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData, // Destructure initialData prop
}: WorkoutFormModalProps) {
  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(workoutFormSchema),
    defaultValues: initialData || {
      // Use initialData or default empty values
      name: "",
      description: "",
      duration: "",
      day: undefined,
      category: "",
    },
  });

  // Reset form when initialData changes (for editing)
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    } else {
      form.reset({
        // Reset to empty when adding
        name: "",
        description: "",
        duration: "",
        day: undefined,
        category: "",
      });
    }
  }, [initialData, form]);

  function handleFormSubmit(values: WorkoutFormValues) {
    onSubmit(values);
    onOpenChange(false); // Close modal after submit
  }

  const daysOfWeek = [
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
    "Minggu",
  ];
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Workout" : "Add Workout"}
          </DialogTitle>{" "}
          {/* Dynamic title */}
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Workout name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Workout description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 30 minutes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="day"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Day</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a day" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., strength" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save Workout</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
