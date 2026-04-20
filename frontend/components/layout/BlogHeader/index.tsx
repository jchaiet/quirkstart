"use client";
import React, { JSX, useState, useRef, useEffect, useCallback } from "react";
import { type NavItem } from "quirk-ui/core";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import ReactDOM from "react-dom";
import styles from "./styles.module.css";

type BlogHeaderProps = {
  title: string;
  navItems: NavItem[];
  alignment: "left" | "center" | "right";
  transparentNav: boolean;
};

type DropdownMenuProps = {
  anchorRef: React.RefObject<HTMLElement | null>;
  scrollContainerRef?: React.RefObject<HTMLElement | null>;
  isOpen: boolean;
  children: React.ReactNode;
};

function DropdownMenu({
  anchorRef,
  scrollContainerRef,
  isOpen,
  children,
}: DropdownMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const updatePosition = useCallback(() => {
    if (anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [anchorRef]);

  useEffect(() => {
    if (isOpen) updatePosition();
  }, [isOpen, updatePosition]);

  useEffect(() => {
    const scrollEl = scrollContainerRef?.current;
    if (!scrollEl || !isOpen) return;
    scrollEl.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);
    return () => {
      scrollEl.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [scrollContainerRef, isOpen, updatePosition]);

  if (!isOpen || !isMounted) return null;

  return ReactDOM.createPortal(
    <div
      ref={menuRef}
      className={styles.sublinks}
      style={{ top: position.top, left: position.left }}
    >
      {children}
    </div>,
    document.body,
  );
}

export default function BlogHeader({
  title = "Blog",
  navItems,
  transparentNav,
}: BlogHeaderProps) {
  const [openPath, setOpenPath] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Map<string, HTMLButtonElement | null>>(new Map());

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (navRef.current && !navRef.current.contains(e.target as Node)) {
      setOpenPath(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [handleClickOutside]);

  const togglePath = useCallback((path: string) => {
    setOpenPath((prev) => (prev === path ? null : path));
  }, []);

  const renderLinks = (links: NavItem[], parentPath = ""): JSX.Element[] => {
    return links.map((link) => {
      const path = `${parentPath}/${link.label}`;
      const isOpen = openPath === path;
      const hasSublinks = !!link.sublinks?.length;
      const isAnySubLinkActive = link.sublinks?.some(
        (sublink) => pathname === sublink.href,
      );
      const setButtonRef = (el: HTMLButtonElement | null) => {
        buttonRefs.current.set(path, el);
      };
      const anchorEl = buttonRefs.current.get(path);

      return (
        <div
          key={path}
          className={`${styles.linkWrapper} ${!parentPath ? styles.parent : ""}`}
        >
          <div className={styles.linkItem}>
            {link.href ? (
              <a
                href={link.href}
                className={`${styles.link} ${pathname === link.href ? styles.active : ""}`}
                target={link.isExternal ? "_blank" : "_self"}
                rel={link.isExternal ? "noopener noreferrer" : undefined}
                onClick={() => {
                  setOpenPath(null);
                  link.onClick?.();
                }}
                onMouseEnter={() => {
                  if (!parentPath) setOpenPath(null);
                }}
              >
                {link.label}
              </a>
            ) : (
              <button
                ref={setButtonRef}
                aria-haspopup={hasSublinks ? "true" : undefined}
                aria-expanded={isOpen}
                className={`${styles.sublinkToggle} ${isOpen ? styles.open : ""} ${isAnySubLinkActive ? styles.active : ""}`}
                onClick={() => togglePath(path)}
                onMouseEnter={() => {
                  if (window.innerWidth > 767 && openPath !== path) {
                    setOpenPath(path);
                  }
                }}
              >
                {link.label}
                {hasSublinks && (
                  <ChevronDown
                    size={18}
                    className={styles.chevron}
                    aria-hidden="true"
                  />
                )}
              </button>
            )}
          </div>

          {hasSublinks && anchorEl && (
            <DropdownMenu
              anchorRef={{ current: anchorEl }}
              scrollContainerRef={navRef}
              isOpen={isOpen}
            >
              <div className={styles.sublinksColumn}>
                {renderLinks(link.sublinks!, path)}
              </div>
            </DropdownMenu>
          )}
        </div>
      );
    });
  };

  return (
    <>
      <nav
        className={`${styles.blogHeader} ${transparentNav ? styles.transparentOffset : ""}`}
      >
        <div className={styles.container}>
          <div className={styles.title}>{title}</div>
          <div ref={navRef} className={styles.items}>
            {renderLinks(navItems)}
          </div>
        </div>
      </nav>
      <hr className={styles.border} />
    </>
  );
}
