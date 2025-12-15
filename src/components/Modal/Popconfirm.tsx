import { useState } from "react";

import { Button, Popover, PopoverTrigger, PopoverContent } from "@heroui/react";
import { AlertCircle } from "lucide-react";

interface PopconfirmProps {
    title: string;
    description?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    children: React.ReactNode;
    okText?: string;
    cancelText?: string;
}

export const Popconfirm = (props: PopconfirmProps) => {
    const {
        title,
        description,
        onConfirm,
        onCancel,
        children,
        okText = "Yes",
        cancelText = "No",
    } = props;
    const [isOpen, setIsOpen] = useState(false);

    const handleConfirm = () => {
        onConfirm();
        setIsOpen(false);
    };

    const handleCancel = () => {
        onCancel?.();
        setIsOpen(false);
    };

    return (
        <Popover
            showArrow
            backdrop="opaque"
            isOpen={isOpen}
            placement="left"
            onOpenChange={setIsOpen}
        >
            <PopoverTrigger>{children}</PopoverTrigger>
            <PopoverContent className="p-4 max-w-xs">
                <div className="space-y-3">
                    <div className="flex items-start gap-2">
                        <div className="text-warning">
                            <AlertCircle size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-medium">{title}</p>
                            {description && (
                                <p className="text-xs text-gray-500 mt-1">{description}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                        <Button size="sm" variant="light" onPress={handleCancel}>
                            {cancelText}
                        </Button>
                        <Button color="primary" size="sm" onPress={handleConfirm}>
                            {okText}
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};
