// app/loading.jsx
export default function Loading() {
    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-5">
            <div className="flex flex-col items-center gap-4">
                {/* Spinner */}
                <div className="relative w-14 h-14">
                    <div className="absolute inset-0 rounded-full border-4 border-border" />
                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                    <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-secondary animate-spin [animation-duration:1.2s]" />
                </div>

                {/* Text */}
                <p className="text-sm text-secondary-text font-sans tracking-wide">
                    Loading…
                </p>
            </div>
        </div>
    );
}