import React from "react";
import dayjs from "dayjs";
import { Input } from "../components/ui/input";
import { FileQuestion, FileX, Search } from "lucide-react";
import { Task } from "../data/task";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { TaskStatusSchema } from "../schemas/task";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "../components/ui/form";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";

export const Home = () => {
  const today = dayjs().format("dddd, DD MMMM YYYY");
  const { data: task, mutate } = useSWR(
    "http://localhost:3300/api/tasks",
    fetcher
  );
  const todayData = dayjs().format("YYYY-MM-DD");
  const priorityOrder = { high: 1, medium: 2, low: 3 };

  const form = useForm<z.infer<typeof TaskStatusSchema>>({
    resolver: zodResolver(TaskStatusSchema),
    defaultValues: {
      _id: undefined,
      status: undefined,
    },
  });

  const [search, setSearch] = React.useState("");
  const [openModal, setOpenModal] = React.useState(null);
  const [openModalDone, setOpenModalDone] = React.useState(null);
  //   const [status, setStatus] = React.useState(null);
  const [idTask, setIdTask] = React.useState(null);
  const filteredTask = task?.find((task) => task._id == idTask);
  const statusTask = filteredTask?.status;
  const statusUpdate = statusTask === 1 ? 0 : 1;

  form.setValue("_id", idTask);
  form.setValue("status", statusUpdate);

  const filterSearchTasks = (tasks) => {
    return tasks?.filter((task) => {
      const searchTerm = search.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchTerm) ||
        task.priority.toLowerCase().includes(searchTerm) ||
        dayjs(task.deadline).format("YYYY-MM-DD").includes(searchTerm)
      );
    });
  };

  const todayTask = filterSearchTasks(
    task
      ?.filter(
        (task) => dayjs(task.deadlineDate).format("YYYY-MM-DD") === todayData
      )
      ?.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  ); // Urutkan berdasarkan prioritas;
  const upcomingTask = filterSearchTasks(
    task
      ?.filter(
        (task) => dayjs(task.deadlineDate).format("YYYY-MM-DD") > todayData
      )
      ?.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  ); // Urutkan berdasarkan prioritas;
  const overdueTask = filterSearchTasks(
    task
      ?.filter(
        (task) => dayjs(task.deadlineDate).format("YYYY-MM-DD") < todayData
      )
      ?.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  ); // Urutkan berdasarkan prioritas;

  const handleClickTask = () => {
    setOpenModal(true);
  };

  const onDoneSubmit = async (values: z.infer<typeof TaskStatusSchema>) => {
    try {
      await axios.put("http://localhost:3300/api/tasks/updateStatus", {
        _id: values._id,
        status: values.status,
      });
      toast.success("Task Done");
      setOpenModalDone(false);
      mutate();
    } catch {
      toast.error("Request error");
      setOpenModalDone(false);
    }
  };

  return (
    <>
      <Dialog open={openModal} onOpenChange={() => setOpenModal(null)}>
        <DialogContent>
          <DialogHeader className="gap-3 font-medium text-black">
            <DialogTitle>{filteredTask?.title}</DialogTitle>
            <DialogDescription className="flex flex-col gap-2">
              <div>
                {dayjs(filteredTask?.deadlineDate).format("dddd, DD MMMM YYYY")}
              </div>
              <div>
                Priority :{" "}
                <span className="font-bold uppercase">
                  {filteredTask?.priority}
                </span>
              </div>
              <div>{filteredTask?.description}</div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  className="text-black hover:bg-transparent hover:text-dark hover:underline transition outline-none focus-visible:ring-0"
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setOpenModal(false), setOpenModalDone(true);
                  }}
                  className="bg-primary text-white hover:bg-primary/80"
                >
                  Done
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={openModalDone} onOpenChange={() => setOpenModalDone(null)}>
        <DialogContent>
          <DialogHeader className="gap-3 font-medium text-black">
            <DialogTitle>{filteredTask?.title}</DialogTitle>
            <DialogDescription className="flex flex-col gap-2">
              <div>
                You're gonna completed a{" "}
                <span className="font-bold">{filteredTask?.title}</span> task,
                are you sure?
              </div>
              <Form {...form}>
                <form id="task" onSubmit={form.handleSubmit(onDoneSubmit)}>
                  <div className="hidden">
                    <FormField
                      control={form.control}
                      name="_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input value={field.value} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="hidden">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input value={field.value} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="ghost"
                      className="text-black hover:bg-transparent hover:text-dark hover:underline transition outline-none focus-visible:ring-0"
                      onClick={() => setOpenModalDone(false)}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      type="submit"
                      className="bg-primary text-white hover:bg-primary/80"
                    >
                      Done
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-12 gap-6 pb-4 overflow-y-auto">
        <div className="col-span-12">
          <h1 className="text-xl font-semibold">{today}</h1>
        </div>
        <div className="col-span-6">
          <Input
            className="bg-gray-200"
            key="search"
            placeholder={`Search task`}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        <div className="col-span-6"></div>
        {search ? (
          <div className="col-span-12">
            <div className="flex gap-2 items-center text-base font-semibold">
              <h2 className="text-xl">{search}</h2>
              <h3 className="font-medium uppercase">- search result</h3>
              <p>{filterSearchTasks(task).length}</p>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="col-span-12">
          <div className="flex gap-2 items-center text-xl font-semibold">
            <h2 className="font-medium uppercase">TODAY</h2>
            <Badge variant="default" className="text-white">
              {todayTask?.length > 0 ? todayTask?.length : 0}
            </Badge>
          </div>
        </div>
        <div className="col-span-12">
          {/* Untuk Today Tasks */}
          <div className="flex overflow-x-auto gap-5 pb-2">
            {todayTask?.length > 0 ? (
              todayTask?.map((task) => (
                <div
                  key={task._id}
                  onClick={() => {
                    setIdTask(task._id), handleClickTask();
                  }}
                  className="flex-shrink-0 min-w-72 flex flex-col items-start gap-2 bg-dark text-white p-4 rounded-md hover:cursor-pointer" // Tambahkan flex-shrink-0 dan min-w-72
                >
                  {/* Konten task tetap sama */}
                  <p className="text-xl font-medium">{task.title}</p>
                  <p className="opacity-80">
                    Priority :{" "}
                    <span className="uppercase">{task.priority}</span>
                  </p>
                  <p className="opacity-70">view details...</p>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center gap-2 col-span-12 bg-white w-full px-4 py-12 rounded-md">
                {search ? <FileQuestion size={24} /> : <FileX size={24} />}
                <p className="text-lg font-medium">No Today Task</p>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-12">
          <div className="flex gap-2 items-center text-xl font-semibold">
            <h2 className="font-medium uppercase">UPCOMING</h2>
            <Badge variant="default" className="text-white">
              {upcomingTask?.length > 0 ? upcomingTask?.length : 0}
            </Badge>
          </div>
        </div>
        <div className="col-span-12">
          {/* Untuk Upcoming Tasks */}
          <div className="flex overflow-x-auto gap-5 pb-2">
            {upcomingTask?.length > 0 ? (
              upcomingTask?.map((task) => (
                <div
                  key={task._id}
                  onClick={() => {
                    setIdTask(task._id), handleClickTask();
                  }}
                  className="flex-shrink-0 min-w-72 flex flex-col items-start gap-2 bg-dark text-white p-4 rounded-md hover:cursor-pointer"
                >
                  {/* Konten task tetap sama */}
                  <p className="text-xl font-medium">{task.title}</p>
                  <p className="opacity-80">
                    Priority :{" "}
                    <span className="uppercase">{task.priority}</span>
                  </p>
                  <p>{dayjs(task.deadlineDate).format("dddd, DD MMMM YYYY")}</p>
                  <p className="opacity-70">view details...</p>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center gap-2 col-span-12 bg-white w-full px-4 py-12 rounded-md">
                {search ? <FileQuestion size={24} /> : <FileX size={24} />}
                <p className="text-lg font-medium">No Upcoming Task</p>
              </div>
            )}
          </div>
        </div>
        <div className="col-span-12">
          <div className="flex gap-2 items-center text-xl font-semibold">
            <h2 className="font-medium uppercase">OVERDUE</h2>
            <Badge variant="default" className="text-white">
              {overdueTask?.length > 0 ? overdueTask?.length : 0}
            </Badge>
          </div>
        </div>
        <div className="col-span-12">
          {/* Untuk Upcoming Tasks */}
          <div className="flex overflow-x-auto gap-5 pb-2">
            {overdueTask?.length > 0 ? (
              overdueTask?.map((task) => (
                <div
                  key={task._id}
                  onClick={() => {
                    setIdTask(task._id), handleClickTask();
                  }}
                  className="flex-shrink-0 min-w-72 flex flex-col items-start gap-2 bg-secondary p-4 rounded-md hover:cursor-pointer animate-infinite animate-pulse duration-1000"
                >
                  {/* Konten task tetap sama */}
                  <p className="text-xl font-medium">{task.title}</p>
                  <p className="opacity-80">
                    Priority :{" "}
                    <span className="uppercase">{task.priority}</span>
                  </p>
                  <p>{dayjs(task.deadlineDate).format("dddd, DD MMMM YYYY")}</p>
                  <p className="opacity-70">view details...</p>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center gap-2 col-span-12 bg-white w-full px-4 py-12 rounded-md">
                {search ? <FileQuestion size={24} /> : <FileX size={24} />}
                <p className="text-lg font-medium">No Overdue Task</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
