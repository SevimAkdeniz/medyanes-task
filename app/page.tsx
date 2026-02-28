"use client";

import { useEffect, useState } from "react";
import { useTodoStore } from "../store/todoStore";
import type { Todo } from "../store/todoStore";

export default function Home() {
  const { todos, fetchTodos, addTodo, updateTodo, deleteTodo, toggleStatus } =
    useTodoStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  async function handleAdd() {
    if (!title.trim()) return;

    await addTodo({
      title: title.trim(),
      description: description.trim() || null,
      status: "pending",
    });

    setTitle("");
    setDescription("");
  }

  function startEdit(t: Todo) {
    setEditingId(t.id);
    setEditTitle(t.title);
    setEditDesc(t.description || "");
  }

  async function saveEdit(id: string) {
    await updateTodo(id, {
      title: editTitle,
      description: editDesc,
    });
    setEditingId(null);
  }

  const filteredTodos = todos.filter((t) => {
    const matchStatus = filter === "all" ? true : t.status === filter;

    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description || "").toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white p-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* HEADER */}
        <h1 className="text-3xl font-bold tracking-wide">✨ Todo App</h1>

        {/* ADD FORM */}
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-700 shadow space-y-3">
          <input
            className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Başlık"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Açıklama (opsiyonel)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:scale-105 transition"
          >
            ➕ Ekle
          </button>
        </div>

        {/* FILTER + SEARCH */}
        <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-700 space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className="px-3 py-1 border rounded"
            >
              All
            </button>
            <button
              onClick={() => setFilter("pending")}
              className="px-3 py-1 border rounded"
            >
              Pending
            </button>
            <button
              onClick={() => setFilter("done")}
              className="px-3 py-1 border rounded"
            >
              Done
            </button>
          </div>

          <input
            placeholder="Ara..."
            className="w-full p-2 rounded bg-black border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TODO LIST */}
        <div className="space-y-3">
          {filteredTodos.map((t) => (
            <div
              key={t.id}
              className="bg-zinc-900 border border-zinc-700 rounded-xl p-4 flex justify-between items-start gap-4 transition hover:scale-[1.01]"
            >
              <div className="flex-1 pr-4">
                {editingId === t.id ? (
                  <div className="space-y-2">
                    <input
                      className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <textarea
                      className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-white"
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                    />
                  </div>
                ) : (
                  <>
                    <div className="font-semibold text-lg">{t.title}</div>
                    <div className="text-sm text-zinc-400">
                      {t.description}
                    </div>
                    <div className="text-xs mt-1 text-zinc-500">
                      {t.status === "done"
                        ? "✅ Tamamlandı"
                        : "⏳ Bekliyor"}
                    </div>
                  </>
                )}
              </div>

              {/* BUTTONS */}
              <div className="flex items-center gap-2 flex-wrap">
                {editingId === t.id ? (
                  <button
                    onClick={() => saveEdit(t.id)}
                    className="px-3 py-1.5 rounded-lg bg-white text-black text-sm font-medium hover:scale-105 transition"
                  >
                    💾 Kaydet
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(t)}
                    className="px-3 py-1.5 rounded-lg border border-zinc-600 text-sm hover:bg-zinc-800 transition"
                  >
                    ✏️ Düzenle
                  </button>
                )}

                <button
                  onClick={() => toggleStatus(t.id)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-600 text-sm hover:bg-zinc-800 transition"
                >
                  {t.status === "pending" ? "✔ Done" : "↩ Undo"}
                </button>

                <button
                  onClick={() => deleteTodo(t.id)}
                  className="px-3 py-1.5 rounded-lg border border-red-500 text-red-400 text-sm hover:bg-red-500 hover:text-white transition"
                >
                  🗑 Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}