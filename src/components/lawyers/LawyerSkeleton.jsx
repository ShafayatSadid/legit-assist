// components/lawyers/LawyerSkeleton.jsx
import { Skeleton } from "@heroui/react";

export default function LawyerSkeleton() {
    return (
        <div className="rounded-2xl border border-border bg-card p-4 md:p-5">
            <div className="flex items-start justify-between">
                <Skeleton className="rounded-full">
                    <div className="h-12 w-12 rounded-full" />
                </Skeleton>
                <Skeleton className="rounded-full">
                    <div className="h-6 w-16 rounded-full" />
                </Skeleton>
            </div>

            <Skeleton className="rounded-lg mt-4">
                <div className="h-5 w-3/4 rounded-lg" />
            </Skeleton>

            <Skeleton className="rounded-lg mt-2">
                <div className="h-4 w-1/2 rounded-lg" />
            </Skeleton>

            <Skeleton className="rounded-lg mt-3">
                <div className="h-3 w-full rounded-lg" />
            </Skeleton>
            <Skeleton className="rounded-lg mt-1.5">
                <div className="h-3 w-4/5 rounded-lg" />
            </Skeleton>

            <div className="mt-5 flex items-center justify-between">
                <Skeleton className="rounded-lg">
                    <div className="h-8 w-20 rounded-lg" />
                </Skeleton>
                <Skeleton className="rounded-lg">
                    <div className="h-8 w-16 rounded-lg" />
                </Skeleton>
            </div>
        </div>
    );
}