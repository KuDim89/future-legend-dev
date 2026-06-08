import styles from './Button.module.scss';

type AsLink = {
  as: 'a';
  href: string;
  type?: never;
  disabled?: never;
  onClick?: never;
};

type AsButton = {
  as?: 'button';
  href?: never;
  type?: 'submit' | 'button';
  disabled?: boolean;
  onClick?: () => void;
};

type Props = (AsLink | AsButton) & {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
};

export function Button({ children, className, ariaLabel, ...rest }: Props) {
  const cls = [styles.btn, className].filter(Boolean).join(' ');

  const inner = (
    <>
      {children}
      <span className={styles.arrow} aria-hidden="true">
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 5H15M10 1L15 5L10 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </>
  );

  if (rest.as === 'a') {
    return (
      <a href={rest.href} className={cls} aria-label={ariaLabel}>
        {inner}
      </a>
    );
  }

  return (
    <button
      type={rest.type ?? 'button'}
      className={cls}
      disabled={rest.disabled}
      onClick={rest.onClick}
      aria-label={ariaLabel}
    >
      {inner}
    </button>
  );
}
