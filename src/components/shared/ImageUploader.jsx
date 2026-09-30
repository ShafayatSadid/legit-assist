// components/shared/ImageUploader.jsx
"use client";

import { useRef, useState } from "react";
import { Avatar, Button } from "@heroui/react";
import { FiUploadCloud, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const MAX_MB = 5;

export default function ImageUploader({ value, onChange, fallbackText = "?" }) {
    const inputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    const handleFile = async (file) => {
        if (!file) return;

        // type check
        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed");
            return;
        }

        // size check
        if (file.size > MAX_MB * 1024 * 1024) {
            toast.error(`Image must be under ${MAX_MB} MB`);
            return;
        }

        setUploading(true);
        try {
            const fd = new FormData();
            fd.append("file", file);
            fd.append("upload_preset", UPLOAD_PRESET);

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                { method: "POST", body: fd }
            );

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            onChange(data.secure_url);
            toast.success("Image uploaded");
        } catch (err) {
            toast.error(err.message || "Upload failed");
        } finally {
            setUploading(false);
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const handleClear = () => {
        onChange("");
    };

    return (
        <div className="flex items-center gap-4">
            {/* Preview */}
            <Avatar size="lg" className="w-20 h-20 ring-2 ring-secondary/20">
                <Avatar.Image alt="preview" src={value} />
                <Avatar.Fallback delayMs={600}>
                    {fallbackText.slice(0, 2).toUpperCase()}
                </Avatar.Fallback>
            </Avatar>

            {/* Actions */}
            <div className="flex flex-col gap-2">
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                />

                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        size="sm"
                        disabled={uploading}
                        onPress={() => inputRef.current?.click()}
                        className="bg-primary hover:bg-primary-hover text-white font-sans font-semibold rounded-lg"
                    >
                        <FiUploadCloud size={14} />
                        {uploading ? "Uploading..." : "Upload Image"}
                    </Button>

                    {value && !uploading && (
                        <Button
                            type="button"
                            size="sm"
                            variant="light"
                            onPress={handleClear}
                            className="text-error font-sans text-xs"
                        >
                            <FiX size={14} />
                            Remove
                        </Button>
                    )}
                </div>

                <p className="text-xs text-secondary-text font-sans">
                    JPG, PNG, WEBP — max {MAX_MB} MB
                </p>
            </div>
        </div>
    );
}