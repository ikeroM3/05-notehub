import { useState } from "react";
import { fetchNotes } from "../../services/noteService";

import { useDebouncedCallback } from "use-debounce";
import NoteList from "../NoteList/NoteList";
import css from "./App.module.css";
import Modal from "../Modal/Modal";
import TaskForm from "../NoteForm/NoteForm";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import {
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
function App() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () =>
      fetchNotes({
        page,
        searchText: search,
        perPage: 12,
      }),
    placeholderData: keepPreviousData,
  });
  const handleSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);
  return (
    <>
      <div className={css.app}>
        <header className={css.toolbar}>
          <SearchBox onChange={handleSearch} />

          {data && data.totalPages > 1 && (
            <Pagination
              totalPages={data.totalPages}
              currentPage={page}
              onPageChange={(p) => setPage(p)}
            />
          )}
          <button onClick={openModal} className={css.button}>
            Create note +
          </button>
        </header>

        {data && data.notes.length > 0 ? (
          <NoteList notes={data.notes} />
        ) : (
          !isLoading && !isError && <p>No notes found.</p>
        )}
      </div>
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <TaskForm
            onClose={() => {
              closeModal();
              queryClient.invalidateQueries({
                queryKey: ["notes"],
                exact: false,
              });
            }}
          />
        </Modal>
      )}
    </>
  );
}

export default App;
