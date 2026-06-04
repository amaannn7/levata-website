"use client";

export default function SectionLabelSide() {
    return (
        <div className="flex flex-row items-center">
            <span aria-hidden className="section-label-beam-side section-label-beam-side--active" />
            <span aria-hidden className="section-label-dot-side section-label-dot-side--active" />
        </div>
    );
}
