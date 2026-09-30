// components/lawyers/LawyerCard.jsx
import Link from "next/link";
import { Avatar, Button, Chip } from "@heroui/react";
import { FiArrowUpRight } from "react-icons/fi";

export default function LawyerCard({ lawyer }) {
    return (
        <div className="group rounded-2xl border border-border bg-card p-4 md:p-5 flex flex-col transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30">
            {/* Avatar + Status chip */}
            <div className="flex items-start justify-between gap-2">
                <Avatar size="lg" className="ring-2 ring-secondary/30 shrink-0">
                    <Avatar.Image alt={lawyer.name} src={lawyer.image} />
                    <Avatar.Fallback delayMs={600}>
                        {lawyer.name?.slice(0, 2).toUpperCase()}
                    </Avatar.Fallback>
                </Avatar>

                <Chip
                    size="sm"
                    variant="soft"
                    color={lawyer.isBusy ? "danger" : "success"}
                    className="shrink-0"
                >
                    <Chip.Label>
                        {lawyer.isBusy ? "Busy" : "Available"}
                    </Chip.Label>
                </Chip>
            </div>

            {/* Name */}
            <h3 className="mt-4 font-heading text-base md:text-lg font-bold text-foreground line-clamp-1">
                {lawyer.name}
            </h3>

            {/* Specialization */}
            <p className="text-xs md:text-sm text-secondary font-medium mt-0.5 font-sans line-clamp-1">
                {lawyer.specialization}
            </p>

            {/* Bio */}
            <p className="text-xs text-secondary-text mt-3 line-clamp-2 font-sans leading-relaxed">
                {lawyer.bio || "No description provided."}
            </p>

            {/* Footer */}
            <div className="mt-auto pt-5 flex items-end justify-between gap-2">
                <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide text-secondary-text font-sans whitespace-nowrap">
                        Fee
                    </p>
                    <p className="text-sm md:text-base font-bold text-foreground font-heading leading-tight truncate">
                        ৳ {lawyer.fee?.toLocaleString("en-US")}
                    </p>
                </div>
                <Link href={`/lawyers/${lawyer.id}`} className="shrink-0">
                    <Button
                        size="sm"
                        isIconOnly
                        className="md:hidden bg-primary hover:bg-primary-hover text-white rounded-lg min-w-9 w-9 h-9 p-0"
                        aria-label="View lawyer"
                    >
                        <FiArrowUpRight size={16} />
                    </Button>
                    <Button
                        size="sm"
                        className="hidden md:flex bg-primary hover:bg-primary-hover text-white font-sans font-semibold rounded-lg px-3 min-w-0"
                    >
                        <span>View</span>
                        <FiArrowUpRight size={14} />
                    </Button>
                </Link>
            </div>
        </div>
    );
}