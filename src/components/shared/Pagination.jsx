// components/shared/Pagination.jsx
"use client";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);

    return (
        <div className="flex items-center justify-center gap-2 mt-10">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="min-w-10 h-10 rounded-lg border border-border bg-card text-foreground flex items-center justify-center hover:border-primary/40 transition disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Previous page"
            >
                <FiChevronLeft size={16} />
            </button>

            {start > 1 && (
                <>
                    <PageBtn page={1} current={currentPage} onPageChange={onPageChange} />
                    {start > 2 && (
                        <span className="text-secondary-text px-1 select-none">...</span>
                    )}
                </>
            )}

            {pages.map((p) => (
                <PageBtn
                    key={p}
                    page={p}
                    current={currentPage}
                    onPageChange={onPageChange}
                />
            ))}

            {end < totalPages && (
                <>
                    {end < totalPages - 1 && (
                        <span className="text-secondary-text px-1 select-none">...</span>
                    )}
                    <PageBtn
                        page={totalPages}
                        current={currentPage}
                        onPageChange={onPageChange}
                    />
                </>
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="min-w-10 h-10 rounded-lg border border-border bg-card text-foreground flex items-center justify-center hover:border-primary/40 transition disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Next page"
            >
                <FiChevronRight size={16} />
            </button>
        </div>
    );
}

function PageBtn({ page, current, onPageChange }) {
    const active = page === current;
    return (
        <button
            onClick={() => onPageChange(page)}
            className={`min-w-10 h-10 rounded-lg font-sans text-sm font-medium transition ${
                active
                    ? "bg-primary text-white"
                    : "border border-border bg-card text-foreground hover:border-primary/40"
            }`}
        >
            {page}
        </button>
    );
}