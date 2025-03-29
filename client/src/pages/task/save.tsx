import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../../components/ui/form";
import { TaskSchema } from "../../schemas/task";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { CalendarIcon, FileUp } from "lucide-react";
import { Calendar } from "../../components/ui/calendar";
import { cn, fetcher } from "../../lib/utils";
import useSWR from "swr";
import dayjs from "dayjs";

export const Save = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const taskId = location.state?.taskId;
  const { data: task } = useSWR(
    taskId ? "http://localhost:3300/api/tasks/" + taskId : null,
    fetcher
  );
  const form = useForm<z.infer<typeof TaskSchema>>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "",
      deadlineDate: undefined,
    },
  });

  // const [selectedDate, setSelectedDate] = React.useState(null);
  // Perbaikan untuk Date Picker
  // const handleSelectedDate = (date) => {
  //   setSelectedDate(date);
  // };

  // console.log(form.watch("status"));

  // // Perbaikan untuk Status Select
  // const handleStatusChange = (value: string) => {
  //   form.setValue("status", Number(value));
  // };

  // console.log(form.watch("deadlineDate"));

  React.useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description,
        priority: task.priority,
        deadlineDate: task.deadlineDate,
      });
    }
  }, [form, task]);

  const onSubmit = async (values: z.infer<typeof TaskSchema>) => {
    try {
      if (task) {
        await axios.put("http://localhost:3300/api/tasks/", {
          _id: taskId,
          title: values.title,
          description: values.description,
          priority: values.priority,
          deadlineDate: dayjs(values.deadlineDate).format("YYYY-MM-DD"),
        });
        toast.success("Task updated successfully");
        navigate("/tasks");
        return;
      } else {
        await axios.post("http://localhost:3300/api/tasks/", {
          title: values.title,
          description: values.description,
          priority: values.priority,
          deadlineDate: dayjs(values.deadlineDate).format("YYYY-MM-DD"),
        });
        toast.success("Task created successfully");
        navigate("/tasks");
      }
    } catch (error) {
      console.log("AXIOS ERROR : ", error);
      navigate("/tasks");
      toast.error("Request error");
    }
    console.log(values);
  };

  return (
    <Form {...form}>
      <form
        id="task"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col bg-white h-full w-full overflow-y-auto rounded-lg shadow-lg p-4 justify-between"
      >
        <div className="grid grid-cols-12 gap-x-4 gap-y-4 h-auto">
          <div className="col-span-12">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  {/* <div className="flex gap-2 text-base">
                    <FormLabel>
                      Title <span className="text-red-500">*</span>
                    </FormLabel>
                    </div> */}
                  <FormMessage />
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value}
                      className="bg-gray-100"
                      placeholder="Task Title"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-12">
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  {/* <div className="flex gap-2 text-base">
                        <FormLabel>Description</FormLabel>
                        </div> */}
                  <FormMessage />
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value}
                      placeholder="Task Description"
                      className="bg-gray-100 h-[140px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-4">
            <FormField
              name="priority"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2 text-base">
                    <FormLabel>
                      Priority <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="bg-gray-100">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-8">
            <FormField
              name="deadlineDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2 text-base">
                    <FormLabel>
                      Deadline Date <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal border-zinc-200 bg-gray-100",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex gap-2 items-center justify-end">
          <a
            href="/tasks"
            className="flex px-4 py-2 items-center gap-2 font-medium hover:underline hover:text-dark hover:cursor-pointer transition"
          >
            {/* <ChevronLeftCircle size={18}/> */}
            Cancel
          </a>
          <Button
            type="submit"
            className="bg-primary text-white flex items-center"
          >
            <FileUp size={18} />
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Save;
