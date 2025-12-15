import { Button } from "@heroui/react";

import { Modal } from "@/components/Modal";

type ConfirmModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    onConfirm: () => void;
};

export const ConfirmModal = (props: ConfirmModalProps) => {
    const { isOpen, onClose, onConfirm, title, description } = props;

    return (
        <div>
            <Modal
                footer={
                    <div className="flex gap-2">
                        <Button variant="light" onPress={onClose}>
                            Bekor qilish
                        </Button>
                        <Button color="danger" onPress={onConfirm}>
                            Tasdiqlash
                        </Button>
                    </div>
                }
                header={title}
                isOpen={isOpen}
                onClose={onClose}
            >
                <p>{description}</p>
            </Modal>
        </div>
    );
};
