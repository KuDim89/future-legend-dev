'use client';

import styles from './TickerSection.module.scss';

interface Props {
  items: string[];
}

export function TickerSection({ items }: Props) {
  // Quadruple items — animate -25% (= 1 set) so 3 sets always buffer ahead
  const copies = [...items, ...items, ...items, ...items];

  return (
    <div className={styles.ticker} aria-hidden="true">
      <div className={styles.track}>
        {copies.map((item, i) => (
          <span key={i} className={styles.item}>
            {item}
            <span className={styles.dot} />
          </span>
        ))}
      </div>
    </div>
  );
}
