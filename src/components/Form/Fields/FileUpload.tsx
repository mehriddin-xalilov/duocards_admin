import { UseFormReturn } from "react-hook-form";

import { FileUpload, FileUploadProps } from "@/components/Fields/FileUpload";

type FormFileUploadProps = Omit<UseFormReturn, "handleSubmit"> & FileUploadProps;

export const FormFileUpload = (props: FormFileUploadProps) => {
    const { name, control, isPhotoGallery, isOnly, full, isPreview, isFull, formState, ...rest } =
        props;
    const { errors } = formState || {};

    return (
        <FileUpload
            {...rest}
            control={control}
            errorMessage={errors?.[name]?.message as string}
            full={full}
            isInvalid={!!errors?.[name]}
            isPhotoGallery={isPhotoGallery}
            isFull={isFull}
            isPreview={isPreview}
            name={name}
            isOnly={isOnly}
        />
    );
};
