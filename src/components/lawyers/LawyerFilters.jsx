// components/lawyers/LawyerFilters.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input, Select, ListBox, Button } from "@heroui/react";
import { FiSearch, FiX } from "react-icons/fi";

const SPECIALIZATIONS = [
    "All",
    "Criminal",
    "Corporate",
    "Family",
    "Property",
    "Immigration",
    "Tax",
    "Labor",
    "Intellectual Property",
];

const SORTS = [
    { id: "latest", label: "Latest" },
    { id: "fee-asc", label: "Fee: Low → High" },
    { id: "fee-desc", label: "Fee: High → Low" },
    { id: "top", label: "Most Hired" },
];

const AVAILABILITY = [
    { id: "all", label: "All" },
    { id: "available", label: "Available" },
    { id: "busy", label: "Busy" },
];

export default function LawyerFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [searchInput, setSearchInput] = useState(
        searchParams.get("search") || ""
    );
    const [minFeeInput, setMinFeeInput] = useState(
        searchParams.get("minFee") || ""
    );
    const [maxFeeInput, setMaxFeeInput] = useState(
        searchParams.get("maxFee") || ""
    );

    // ── URL param setter ──
    const setParam = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "all" && value !== "All" && value !== "") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete("page"); // filter change → page reset
        router.replace(`${pathname}?${params.toString()}`);
    };

    // ── Debounced search ──
    useEffect(() => {
        const id = setTimeout(() => {
            const current = searchParams.get("search") || "";
            if (searchInput !== current) setParam("search", searchInput);
        }, 400);
        return () => clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput]);

    // ── Debounced fee ──
    useEffect(() => {
        const id = setTimeout(() => {
            const currMin = searchParams.get("minFee") || "";
            const currMax = searchParams.get("maxFee") || "";
            if (minFeeInput !== currMin) setParam("minFee", minFeeInput);
            if (maxFeeInput !== currMax) setParam("maxFee", maxFeeInput);
        }, 600);
        return () => clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [minFeeInput, maxFeeInput]);

    const clearAll = () => {
        setSearchInput("");
        setMinFeeInput("");
        setMaxFeeInput("");
        router.replace(pathname);
    };

    const hasFilters = searchParams.toString().length > 0;

    return (
        <div className="rounded-2xl border border-border bg-card p-4 md:p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {/* Search */}
                <div className="col-span-2 lg:col-span-2">
                    <label className="text-xs font-medium text-secondary-text font-sans block mb-1.5">
                        Search
                    </label>
                    <Input
                        placeholder="Name or specialization..."
                        value={searchInput}
                        onValueChange={setSearchInput}
                        startContent={<FiSearch className="text-secondary-text" />}
                        classNames={{
                            inputWrapper:
                                "bg-background border border-border rounded-lg h-10",
                            input: "text-sm",
                        }}
                    />
                </div>

                {/* Specialization */}
                <div className="col-span-1">
                    <label className="text-xs font-medium text-secondary-text font-sans block mb-1.5">
                        Specialization
                    </label>
                    <Select
                        placeholder="All"
                        value={searchParams.get("specialization") || "All"}
                        onChange={(key) => setParam("specialization", key)}
                        className="w-full"
                    >
                        <Select.Trigger className="h-10 rounded-lg border border-border bg-background px-3 text-sm w-full flex items-center justify-between">
                            <Select.Value />
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                {SPECIALIZATIONS.map((s) => (
                                    <ListBox.Item key={s} id={s} textValue={s}>
                                        {s}
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                </div>

                {/* Sort */}
                <div className="col-span-1">
                    <label className="text-xs font-medium text-secondary-text font-sans block mb-1.5">
                        Sort by
                    </label>
                    <Select
                        placeholder="Latest"
                        value={searchParams.get("sort") || "latest"}
                        onChange={(key) => setParam("sort", key)}
                        className="w-full"
                    >
                        <Select.Trigger className="h-10 rounded-lg border border-border bg-background px-3 text-sm w-full flex items-center justify-between">
                            <Select.Value />
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                {SORTS.map((s) => (
                                    <ListBox.Item key={s.id} id={s.id} textValue={s.label}>
                                        {s.label}
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                </div>

                {/* Availability */}
                <div className="col-span-1">
                    <label className="text-xs font-medium text-secondary-text font-sans block mb-1.5">
                        Availability
                    </label>
                    <Select
                        placeholder="All"
                        value={searchParams.get("availability") || "all"}
                        onChange={(key) => setParam("availability", key)}
                        className="w-full"
                    >
                        <Select.Trigger className="h-10 rounded-lg border border-border bg-background px-3 text-sm w-full flex items-center justify-between">
                            <Select.Value />
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                {AVAILABILITY.map((a) => (
                                    <ListBox.Item key={a.id} id={a.id} textValue={a.label}>
                                        {a.label}
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                </div>

                {/* Min fee */}
                <div className="col-span-1">
                    <label className="text-xs font-medium text-secondary-text font-sans block mb-1.5">
                        Min Fee
                    </label>
                    <Input
                        type="number"
                        placeholder="0"
                        value={minFeeInput}
                        onValueChange={setMinFeeInput}
                        classNames={{
                            inputWrapper:
                                "bg-background border border-border rounded-lg h-10",
                            input: "text-sm",
                        }}
                    />
                </div>

                {/* Max fee */}
                <div className="col-span-1">
                    <label className="text-xs font-medium text-secondary-text font-sans block mb-1.5">
                        Max Fee
                    </label>
                    <Input
                        type="number"
                        placeholder="Any"
                        value={maxFeeInput}
                        onValueChange={setMaxFeeInput}
                        classNames={{
                            inputWrapper:
                                "bg-background border border-border rounded-lg h-10",
                            input: "text-sm",
                        }}
                    />
                </div>

                {/* Clear */}
                {hasFilters && (
                    <div className="col-span-2 md:col-span-3 lg:col-span-6 flex justify-end">
                        <Button
                            size="sm"
                            variant="light"
                            onPress={clearAll}
                            className="text-secondary-text font-sans text-xs"
                        >
                            <FiX size={14} />
                            <span>Clear filters</span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}