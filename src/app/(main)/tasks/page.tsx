"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusCircle, User, Calendar } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Task = {
  id: number;
  title: string;
  assignedTo: string;
  dueDate: string;
  status: "todo" | "doing" | "done";
};

const initialTasks: Task[] = [
  { id: 1, title: "Take out the trash", assignedTo: "Alex", dueDate: "2024-07-25", status: "todo" },
  { id: 2, title: "Walk the dog", assignedTo: "Ben", dueDate: "2024-07-24", status: "doing" },
  { id: 3, title: "Clean the kitchen", assignedTo: "Chloe", dueDate: "2024-07-23", status: "done" },
  { id: 4, title: "Mow the lawn", assignedTo: "Alex", dueDate: "2024-07-26", status: "todo" },
  { id: 5, title: "Grocery shopping", assignedTo: "Ben", dueDate: "2024-07-25", status: "todo" },
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleAddTask = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTask: Task = {
      id: tasks.length + 1,
      title: formData.get("title") as string,
      assignedTo: formData.get("assignedTo") as string,
      dueDate: formData.get("dueDate") as string,
      status: "todo",
    };
    setTasks([newTask, ...tasks]);
    setDialogOpen(false);
  };

  const toggleTaskStatus = (taskId: number, currentStatus: Task['status']) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        if (currentStatus === 'done') return { ...task, status: 'todo' };
        if (currentStatus === 'todo') return { ...task, status: 'doing' };
        if (currentStatus === 'doing') return { ...task, status: 'done' };
      }
      return task;
    }));
  };
  
  const renderTasks = (status: Task["status"]) => (
    tasks
      .filter((task) => task.status === status)
      .map((task) => (
        <Card key={task.id}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Checkbox 
                checked={task.status === 'done'} 
                onCheckedChange={() => toggleTaskStatus(task.id, task.status)}
                aria-label={`Mark task ${task.title} as ${task.status === 'done' ? 'not done' : 'done'}`}
              />
              <div>
                <p className="font-medium">{task.title}</p>
                <div className="text-sm text-muted-foreground flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{task.assignedTo}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{task.dueDate}</span>
                  </div>
                </div>
              </div>
            </div>
            <Avatar>
              <AvatarFallback>{task.assignedTo.charAt(0)}</AvatarFallback>
            </Avatar>
          </CardContent>
        </Card>
      ))
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-start mb-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Task Management</h1>
          <p className="text-muted-foreground">
            Create, assign, and track tasks for your family.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assign To</Label>
                <Input id="assignedTo" name="assignedTo" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" name="dueDate" type="date" required />
              </div>
              <DialogFooter>
                <Button type="submit">Add Task</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="todo" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todo">To Do</TabsTrigger>
          <TabsTrigger value="doing">In Progress</TabsTrigger>
          <TabsTrigger value="done">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="todo" className="space-y-4 pt-4">{renderTasks("todo")}</TabsContent>
        <TabsContent value="doing" className="space-y-4 pt-4">{renderTasks("doing")}</TabsContent>
        <TabsContent value="done" className="space-y-4 pt-4">{renderTasks("done")}</TabsContent>
      </Tabs>
    </div>
  );
}
