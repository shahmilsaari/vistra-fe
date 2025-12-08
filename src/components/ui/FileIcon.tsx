import React from "react";

interface FileIconProps {
    kind?: string;
    mime?: string;
    name?: string;
    className?: string;
}

export function FileIcon({ kind, mime, name, className = "h-6 w-6" }: FileIconProps) {
    // Folder
    if (kind === "folder") {
        return (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h5l2 2h11a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 2h8" />
            </svg>
        );
    }

    // Image
    if (kind === "image" || mime?.startsWith("image/") || name?.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        return (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        );
    }

    // PDF
    if (mime === "application/pdf" || name?.endsWith(".pdf")) {
        return (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h6" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17h4" />
            </svg>
        );
    }

    // Word / Text
    if (
        mime === "application/msword" ||
        mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        name?.match(/\.(doc|docx|txt|rtf)$/i)
    ) {
        return (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        );
    }

    // Default File
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
    );
}
