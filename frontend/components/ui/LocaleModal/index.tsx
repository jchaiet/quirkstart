import { locales } from "@/lib/i18n";
import Link from "next/link";
import styles from "./styles.module.css";

type LocaleModalProps = {
  links: { [key: string]: string };
};

export function LocaleModal({ links }: LocaleModalProps) {
  return (
    <div className={styles.locales}>
      <div className={styles.heading}>
        <h3>Locales</h3>
      </div>
      <div className={styles.content}>
        <ul>
          {locales.map((locale) => {
            return (
              <li key={locale.id}>
                <Link
                  href={links[locale.id] || `/${locale.id}`}
                  className={styles.locale}
                >
                  {locale.title}
                  <span className={styles.localeId}>{locale.id}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
