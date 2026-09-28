// components/lawyers/EmptyState.jsx
import { FiSearch } from "react-icons/fi";

export default function EmptyState({
    message = "No lawyers match your filters. Try adjusting your search.",
}) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-20 px-5 text-center">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <FiSearch className="text-secondary" size={28} />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground">
                No Results Found
            </h3>
            <p className="text-sm text-secondary-text mt-2 max-w-sm font-sans">
                {message}
            </p>
        </div>
    );
}