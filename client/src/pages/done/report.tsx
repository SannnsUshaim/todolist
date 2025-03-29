import dayjs from "dayjs";
import React from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/utils";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import {
  TaskDeleteSchema
} from "../../schemas/task";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useFieldArray, useForm } from "react-hook-form";
import { Form, FormControl, FormField } from "../../components/ui/form";
import { Input } from "../../components/ui/input";

export const Report = () => {
  const today = dayjs().format("YYYY-MM-DD");
  const { data: tasks, mutate } = useSWR(
    "http://localhost:3300/api/tasks/done",
    fetcher
  );

  const todayTask = tasks?.filter(
    (task) => dayjs(task.deadlineDate).format("YYYY-MM-DD") === today
  );

  const form = useForm<z.infer<typeof TaskDeleteSchema>>({
    resolver: zodResolver(TaskDeleteSchema),
    defaultValues: {
      _id: undefined,
    },
  });

  const [tab, setTab] = React.useState("all");
  const [idTask, setIdTask] = React.useState(null);
  const filteredTask = tasks?.find((task) => task._id === idTask);
  const [openModal, setOpenModal] = React.useState(false);
  const [openModalDelete, setOpenModalDelete] = React.useState(false);

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
      {/* details */}
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
      {/* delete */}
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
                  <div className="flex gap-2 items-center justify-end mt-2">
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
      <div className="grid grid-cols-12 gap-5 h-auto">
        <div className="col-span-12">
          <h2 className="text-2xl font-semibold">Completed task</h2>
        </div>
        <div className="col-span-1">
          <div
            onClick={() => setTab("all")}
            className={`flex items-center w-full bg-gray-100 text-lg py-1 px-2 gap-2 rounded-lg border-2 border-gray-400 hover:cursor-pointer min-w-max ${
              tab === "all" ? "bg-primary" : ""
            }`}
          >
            <Badge variant={tab === "all" ? "secondary" : "default"}>
              {tasks?.length}
            </Badge>
            <p className={tab === "all" ? "text-white" : ""}>All</p>
          </div>
        </div>
        <div className="col-span-1">
          <div
            onClick={() => setTab("today")}
            className={`flex items-center w-full bg-gray-100 text-lg py-1 px-2 gap-2 rounded-lg border-2 border-gray-400 hover:cursor-pointer min-w-max ${
              tab === "today" ? "bg-primary" : ""
            }`}
          >
            <Badge variant={tab === "today" ? "secondary" : "default"}>
              {todayTask?.length}
            </Badge>
            <p className={tab === "today" ? "text-white" : ""}>Today</p>
          </div>
        </div>
        <div className="col-span-10"></div>
        {tab === "all" ? (
          <>
            <div className="col-span-12">
              <p className="capitalize text-xl font-medium">All</p>
            </div>
            <div className="flex flex-wrap gap-5 col-span-12">
              {tasks?.map((task) => (
                <div
                  key={task._id}
                  className={`flex flex-col gap-2 min-w-72 bg-dark text-white rounded-md p-4 hover:cursor-pointer relative`}
                  onClick={() => {
                    setOpenModal(true);
                    setIdTask(task._id);
                  }}
                >
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
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="col-span-12">
              <p className="capitalize text-xl font-medium">Today</p>
            </div>
            <div className="flex flex-wrap gap-5 col-span-12">
              {todayTask?.map((task) => (
                <div
                  key={task._id}
                  className="flex flex-col gap-2 min-w-72 bg-dark text-white rounded-md p-4 hover:cursor-pointer"
                  onClick={() => {
                    setOpenModal(true), setIdTask(task._id);
                  }}
                >
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
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Report;
