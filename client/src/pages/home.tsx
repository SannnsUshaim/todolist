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

export const Home = () => {
  const today = dayjs().format("dddd, DD MMMM YYYY");
  const task = Task.map((task) => task);
  const todayData = dayjs().format("YYYY-MM-DD");
  const priorityOrder = { High: 1, Medium: 2, Low: 3 };

  const form = useForm<z.infer<typeof TaskStatusSchema>>({
    resolver: zodResolver(TaskStatusSchema),
    defaultValues: {
      status: undefined,
    },
  });

  const [search, setSearch] = React.useState("");
  const [openModal, setOpenModal] = React.useState(null);
  //   const [status, setStatus] = React.useState(null);
  const [idTask, setIdTask] = React.useState(null);
  const _id = idTask;
  const filteredTask = task?.find((task) => task._id == _id);
  const statusTask = filteredTask?.status;
  const statusUpdate = statusTask === 1 ? 0 : 1;

  form.setValue("_id", _id);
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
                <span className="font-bold">{filteredTask?.priority}</span>
              </div>
              <div>{filteredTask?.description}</div>
              <Form {...form}>
                <form id="task">
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
                      onClick={() => setOpenModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="default"
                      type="submit"
                      form="task"
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
              {todayTask.length}
            </Badge>
          </div>
        </div>
        <div className="col-span-12">
          {/* Untuk Today Tasks */}
          <div className="flex overflow-x-auto gap-5 pb-2">
            {todayTask.length > 0 ? (
              todayTask.map((task) => (
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
                  <p className="opacity-70">
                    view details... task id : {task._id}
                  </p>
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
              {upcomingTask.length}
            </Badge>
          </div>
        </div>
        <div className="col-span-12">
          {/* Untuk Upcoming Tasks */}
          <div className="flex overflow-x-auto gap-5 pb-2">
            {upcomingTask.length > 0 ? (
              upcomingTask.map((task) => (
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
                  <p className="opacity-70">
                    view details... task id : {task._id}
                  </p>
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
              {overdueTask.length}
            </Badge>
          </div>
        </div>
        <div className="col-span-12">
          {/* Untuk Upcoming Tasks */}
          <div className="flex overflow-x-auto gap-5 pb-2">
            {overdueTask.length > 0 ? (
              overdueTask.map((task) => (
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
                  <p className="opacity-70">
                    view details... task id : {task._id}
                  </p>
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
