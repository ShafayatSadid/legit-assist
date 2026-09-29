// components/dashboard/HireStatusBadge.jsx
import { Chip } from "@heroui/react";

const MAP = {
    pending: { label: "Pending", color: "warning" },
    accepted: { label: "Accepted", color: "accent" },
    rejected: { label: "Rejected", color: "danger" },
    paid: { label: "Paid", color: "success" },
};

export default function HireStatusBadge({ status }) {
    const info = MAP[status] || { label: status, color: "default" };

    return (
        <Chip size="sm" variant="soft" color={info.color}>
            <Chip.Label>{info.label}</Chip.Label>
        </Chip>
    );
}