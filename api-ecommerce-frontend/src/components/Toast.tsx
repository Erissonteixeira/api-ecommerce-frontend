import styles from "./Toast.module.css";

export type ToastType = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
};

type Props = {
  items: ToastItem[];
  onClose: (id: string) => void;
};

function getDotClass(type: ToastType) {
  if (type === "success") return `${styles.dot} ${styles.dotSuccess}`;
  if (type === "error") return `${styles.dot} ${styles.dotError}`;
  return `${styles.dot} ${styles.dotInfo}`;
}

function getContainerClass(type: ToastType) {
  if (type === "success") return `${styles.toast} ${styles.success}`;
  if (type === "error") return `${styles.toast} ${styles.error}`;
  return `${styles.toast} ${styles.info}`;
}

function getLabel(type: ToastType) {
  if (type === "success") return "sucesso";
  if (type === "error") return "erro";
  return "info";
}

export default function Toast({ items, onClose }: Props) {
  if (items.length === 0) return null;

  return (
    <div className={styles.wrap}>
      {items.map((t) => (
        <div key={t.id} className={getContainerClass(t.type)}>
          <div className={styles.top}>
            <div style={{ display: "grid", gap: 8 }}>
              <span className={styles.pill}>
                <span className={getDotClass(t.type)} />
                {getLabel(t.type)}
              </span>

              <div className={styles.title}>{t.title}</div>
            </div>

            <button className={styles.close} onClick={() => onClose(t.id)}>
              ✕
            </button>
          </div>

          {t.message ? <div className={styles.msg}>{t.message}</div> : null}
        </div>
      ))}
    </div>
  );
}
