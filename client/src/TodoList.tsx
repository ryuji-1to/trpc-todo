import { useState } from "react";
import { trpc } from "./trpc";

export const TodoList = () => {
  const [input, setInput] = useState("");
  const { data, refetch } = trpc.getAllTodos.useQuery();
  const mutation = trpc.createTodo.useMutation();
  const handleAddTodo = () => {
    mutation.mutate(input, {
      onSuccess: (todo) => {
        refetch();
      },
    });
    setInput("");
  };

  if (!data) {
    return <div>loading...</div>;
  }

  return (
    <div className="grid place-items-center pt-20">
      <section>
        <h1 className="text-3xl font-bold">Todo List</h1>
        <input
          type="text"
          className="border-b-2 border-gray-300"
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
        />
        <button
          className="border bg-gray-300 ml-1 rounded-md px-1"
          onClick={handleAddTodo}
          disabled={mutation.isLoading}
        >
          add
        </button>
        <ul className="list-disc ml-4">
          {data.map((d, i) => (
            <li className="" key={i}>
              {d}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
