import NoteForm from "../NoteForm/NoteForm";
import css from "./Modal.module.css";
import { createPortal } from "react-dom";

export default function Modal({ children }: { children: React.ReactNode }) {
  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true">
      <div className={css.modal}>
        <NoteForm />
      </div>
    </div>,
    document.body,
  );
}
