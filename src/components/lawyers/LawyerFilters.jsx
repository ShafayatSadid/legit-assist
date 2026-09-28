// components/lawyers/LawyerFilters.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select, ListBox, Button } from "@heroui/react";
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

    const setParam = (key, value) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "all" && value !== "All" && value !== "") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.delete("page");
        router.replace(`${pathname}?${params.toString()}`);
    };

    useEffect(() => {
        const id = setTimeout(() => {
            const current = searchParams.get("search") || "";
            if (searchInput !== current) setParam("search", searchInput);
        }, 400);
        return () => clearTimeout(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchInput]);

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

    const fieldWrap = "flex flex-col min-w-0";
    const labelCls =
        "text-xs font-medium text-secondary-text font-sans mb-1.5 whitespace-nowrap";
    const inputBaseCls =
        "w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-secondary-text outline-none focus:border-primary transition font-sans";
    const selectTriggerCls =
        "h-10 rounded-lg border border-border bg-background px-3 text-sm w-full flex items-center justify-between";

    return (
        <div className="rounded-2xl border border-border bg-card p-4 md:p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-3 items-start">
                {/* Search */}
                <div className={`${fieldWrap} col-span-2 md:col-span-3 lg:col-span-4`}>
                    <label className={labelCls} htmlFor="filter-search">
                        Search
                    </label>
                    <div className="relative">
                        <FiSearch
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text pointer-events-none"
                            size={14}
                        />
                        <input
                            id="filter-search"
                            type="text"
                            placeholder="Name or specialization..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className={`${inputBaseCls} pl-9`}
                        />
                    </div>
                </div>

                {/* Specialization */}
                <div className={`${fieldWrap} col-span-1 lg:col-span-2`}>
                    <label className={labelCls} htmlFor="filter-specialization">
                        Specialization
                    </label>
                    <Select
                        aria-label="Filter by specialization"
                        placeholder="All"
                        value={searchParams.get("specialization") || "All"}
                        onChange={(key) => setParam("specialization", key)}
                        className="w-full"
                    >
                        <Select.Trigger
                            id="filter-specialization"
                            className={selectTriggerCls}
                        >
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
                <div className={`${fieldWrap} col-span-1 lg:col-span-2`}>
                    <label className={labelCls} htmlFor="filter-sort">
                        Sort by
                    </label>
                    <Select
                        aria-label="Sort lawyers"
                        placeholder="Latest"
                        value={searchParams.get("sort") || "latest"}
                        onChange={(key) => setParam("sort", key)}
                        className="w-full"
                    >
                        <Select.Trigger
                            id="filter-sort"
                            className={selectTriggerCls}
                        >
                            <Select.Value />
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                {SORTS.map((s) => (
                                    <ListBox.Item
                                        key={s.id}
                                        id={s.id}
                                        textValue={s.label}
                                    >
                                        {s.label}
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                </div>

                {/* Availability */}
                <div className={`${fieldWrap} col-span-1 lg:col-span-2`}>
                    <label className={labelCls} htmlFor="filter-availability">
                        Availability
                    </label>
                    <Select
                        aria-label="Filter by availability"
                        placeholder="All"
                        value={searchParams.get("availability") || "all"}
                        onChange={(key) => setParam("availability", key)}
                        className="w-full"
                    >
                        <Select.Trigger
                            id="filter-availability"
                            className={selectTriggerCls}
                        >
                            <Select.Value />
                            <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                            <ListBox>
                                {AVAILABILITY.map((a) => (
                                    <ListBox.Item
                                        key={a.id}
                                        id={a.id}
                                        textValue={a.label}
                                    >
                                        {a.label}
                                    </ListBox.Item>
                                ))}
                            </ListBox>
                        </Select.Popover>
                    </Select>
                </div>

                {/* Min Fee */}
                <div className={`${fieldWrap} col-span-1 lg:col-span-1`}>
                    <label className={labelCls} htmlFor="filter-min-fee">
                        Min Fee
                    </label>
                    <input
                        id="filter-min-fee"
                        type="number"
                        placeholder="0"
                        value={minFeeInput}
                        onChange={(e) => setMinFeeInput(e.target.value)}
                        className={inputBaseCls}
                    />
                </div>

                {/* Max Fee */}
                <div className={`${fieldWrap} col-span-1 lg:col-span-1`}>
                    <label className={labelCls} htmlFor="filter-max-fee">
                        Max Fee
                    </label>
                    <input
                        id="filter-max-fee"
                        type="number"
                        placeholder="Any"
                        value={maxFeeInput}
                        onChange={(e) => setMaxFeeInput(e.target.value)}
                        className={inputBaseCls}
                    />
                </div>

                {/* Clear */}
                {hasFilters && (
                    <div className="col-span-2 md:col-span-3 lg:col-span-12 flex justify-end">
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