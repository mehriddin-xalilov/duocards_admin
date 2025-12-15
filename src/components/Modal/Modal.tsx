import {
    Modal as ModalHeroui,
    ModalContent,
    ModalHeader,
    ModalProps as ModalPropsHeroui,
    ModalBody,
    ModalFooter,
} from "@heroui/react";

type ModalProps = ModalPropsHeroui & {
    isOpen: boolean;
    onClose: () => void;
    header?: string;
    footer?: React.ReactNode;
    children: React.ReactNode;
};

export const Modal = (props: ModalProps) => {
    const { isOpen, onClose, header, children, footer, ...rest } = props;

    return (
        <ModalHeroui isOpen={isOpen} onClose={onClose} {...rest}>
            <ModalContent>
                <ModalHeader>{header}</ModalHeader>
                <ModalBody>{children}</ModalBody>
                <ModalFooter>{footer}</ModalFooter>
            </ModalContent>
        </ModalHeroui>
    );
};
