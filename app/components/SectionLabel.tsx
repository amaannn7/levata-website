"use client";

export default function SectionLabel() {
    return (
        <div className="flex flex-col items-center gap-0">
            <span aria-hidden className="section-label-beam section-label-beam--active" />
            <span aria-hidden className="section-label-dot section-label-dot--active" />
        </div>
    );
}
