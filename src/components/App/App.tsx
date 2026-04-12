import { useState } from "react";
import { fetchNotes } from "../../services/noteService";
import { createNote } from "../../services/noteService";
import { useQuery } from "@tanstack/react-query";
import NoteList from "../NoteList/NoteList";
import css from "./App.module.css";
import Modal from "../Modal/Modal";
import TaskForm from "../NoteForm/NoteForm";

function App() {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: 10,
      }),
  });
  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <button onClick={openModal} className={css.button}>
            Create note +
          </button>
          {/* Компонент SearchBox */}
          {/* Пагінація */}
          {/* Кнопка створення нотатки */}
        </header>
        {data?.notes.length > 0 && <NoteList notes={data.notes} />}
      </div>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <TaskForm onAddTask={closeModal} />
        </Modal>
      )}
    </>
  );
}

export default App;
