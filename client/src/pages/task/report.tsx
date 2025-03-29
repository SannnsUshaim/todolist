import React from "react";
import dayjs from "dayjs";
import { Input } from "../../components/ui/input";
import { FileQuestion, FileX, PlusCircle, Search } from "lucide-react";
// import { Task } from "../../data/task";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { TaskDeleteSchema } from "../../schemas/task";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "../../components/ui/form";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";

export const Report = () => {
  const today = dayjs().format("dddd, DD MMMM YYYY");

  const { data: task, mutate } = useSWR(
    "http://localhost:3300/api/tasks",
    fetcher
  );
  const todayData = dayjs().format("YYYY-MM-DD");
  const priorityOrder = { high: 1, medium: 2, low: 3 };

  const form = useForm<z.infer<typeof TaskDeleteSchema>>({
    resolver: zodResolver(TaskDeleteSchema),
    defaultValues: {
      _id: undefined,
    },
  });

  const [search, setSearch] = React.useState("");
  const [openModal, setOpenModal] = React.useState(null);
  const [openModalDelete, setOpenModalDelete] = React.useState(null);
  //   const [status, setStatus] = React.useState(null);
  const [idTask, setIdTask] = React.useState(null);
  const filteredTask = task?.find((task) => task._id === idTask);
  const statusTask = filteredTask?.status;
  const statusUpdate = statusTask === 1 ? 0 : 1;

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

  React.useEffect(() => {
    if (idTask) {
      form.setValue("_id", idTask);
    }
  }, [form, idTask]);

  const onDeleteSubmit = async (values: z.infer<typeof TaskDeleteSchema>) => {
    try {
      await axios.delete(`http://localhost:3300/api/tasks/${values._id}`);
      setOpenModalDelete(false);
      toast.success("Task successfully deleted!");
      mutate();
    } catch {
      setOpenModalDelete(false);
      toast.error("Request error");
    }
  };

  return (
    <>
      <Dialog open={openModal} onOpenChange={() => setOpenModal(null)}>
        <DialogContent>
          <DialogHeader className="gap-3 font-medium text-black">
            <DialogTitle className="capitalize">
              {filteredTask?.title}
            </DialogTitle>
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
              <div className="flex gap-2 items-center justify-end">
                <Button
                  variant="ghost"
                  className="text-black hover:bg-transparent hover:text-dark hover:underline transition outline-none focus-visible:ring-0"
                  onClick={() => setOpenModal(false)}
                >
                  Cancel
                </Button>
                <Link to="/tasks/save" state={{ taskId: idTask }}>
                  <Button variant="default" className="text-white">
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  className="text-white hover:bg-maroonRed"
                  onClick={() => {
                    setOpenModalDelete(true);
                    setOpenModal(false);
                  }}
                >
                  Delete
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openModalDelete}
        onOpenChange={() => setOpenModalDelete(null)}
      >
        <DialogContent>
          <DialogHeader className="gap-3 font-medium text-black">
            <DialogTitle className="capitalize">Delete Task</DialogTitle>
            <DialogDescription className="flex flex-col gap-2">
              <div>
                You're gonna delete{" "}
                <span className="font-bold">{filteredTask?.title}</span>. Are
                you sure you want to delete this task?
              </div>
              <Form {...form}>
                <form id="task" onSubmit={form.handleSubmit(onDeleteSubmit)}>
                  <FormField
                    control={form.control}
                    name="_id"
                    render={({ field }) => (
                      <FormControl>
                        <Input type="hidden" value={field.value} />
                      </FormControl>
                    )}
                  />
                  <div className="flex gap-2 items-center justify-end">
                    <Button
                      variant="ghost"
                      className="text-black hover:bg-transparent hover:text-dark hover:underline transition outline-none focus-visible:ring-0"
                      onClick={() => setOpenModalDelete(false)}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      className="text-white hover:bg-maroonRed"
                      type="submit"
                    >
                      Delete
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="grid grid-cols-12 gap-6 pb-4 overflow-y-auto">
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
        <div className="col-span-4"></div>
        <div className="col-span-2">
          <a
            href="/tasks/save"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:cursor-pointer"
          >
            <PlusCircle size={24} />
            Add New Task
          </a>
        </div>
        {search && (
          <div className="col-span-12">
            <div className="flex gap-2 items-center text-base font-semibold">
              <h2 className="text-xl">{search}</h2>
              <h3 className="font-medium uppercase">- search result</h3>
              <p>{filterSearchTasks(task).length}</p>
            </div>
          </div>
        )}
        <div className="col-span-12">
          <div className="flex gap-2 items-center text-xl font-semibold">
            <h2 className="font-medium uppercase">TODAY</h2>
            <Badge className="text-white" variant="default">
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
                    setIdTask(task._id);
                    handleClickTask();
                  }}
                  className="flex-shrink-0 min-w-72 flex flex-col items-start gap-2 bg-dark text-white p-4 rounded-md hover:cursor-pointer" // Tambahkan flex-shrink-0 dan min-w-72
                >
                  {/* Konten task tetap sama */}
                  <p className="text-xl font-medium">{task?.title}</p>
                  <p className="opacity-80">
                    Priority :{" "}
                    <span className="uppercase">{task?.priority}</span>
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
            <Badge className="text-white" variant="default">
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
                    setIdTask(task._id);
                    handleClickTask();
                  }}
                  className="flex-shrink-0 min-w-72 flex flex-col items-start gap-2 bg-dark text-white p-4 rounded-md hover:cursor-pointer"
                >
                  {/* Konten task tetap sama */}
                  <p className="text-xl font-medium">{task?.title}</p>
                  <p className="opacity-80">
                    Priority :{" "}
                    <span className="uppercase">{task?.priority}</span>
                  </p>
                  <p>
                    {dayjs(task?.deadlineDate).format("dddd, DD MMMM YYYY")}
                  </p>
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
            <Badge className="text-white" variant="default">
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
                    setIdTask(task._id);
                    handleClickTask();
                  }}
                  className="flex-shrink-0 min-w-72 flex flex-col items-start gap-2 bg-secondary p-4 rounded-md hover:cursor-pointer animate-infinite animate-pulse duration-1000"
                >
                  {/* Konten task tetap sama */}
                  <p className="text-xl font-medium">{task?.title}</p>
                  <p className="opacity-80">
                    Priority :{" "}
                    <span className="uppercase">{task?.priority}</span>
                  </p>
                  <p>
                    {dayjs(task?.deadlineDate).format("dddd, DD MMMM YYYY")}
                  </p>
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

export default Report;
