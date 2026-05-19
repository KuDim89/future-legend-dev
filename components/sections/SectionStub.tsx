import styles from './SectionStub.module.scss';

interface Props {
  id: string;
  title: string;
}

export function SectionStub({ id, title }: Props) {
  return (
    <section id={id} className={styles.stub}>
      <h2 className={styles.title}>{title}</h2>
    </section>
  );
}
