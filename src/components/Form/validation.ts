import { z } from "zod";

import { ValidationField } from "@/components/Form/types";

export function buildZodSchema(fields: ValidationField[]) {
    const shape: Record<string, any> = {};

    fields.forEach((field) => {
        let validator;

        switch (field.validationType) {
            case "any":
                validator = z.any();

                if (field.isRequired) {
                    validator = validator.refine((val) => val !== undefined || val !== null, {
                        message: field.errorMessage || `${field.name} is required`,
                    });
                } else {
                    validator = validator.optional();
                }

                break;

            case "date":
                validator = z.date();

                if (field.isRequired) {
                    validator = validator.refine((val) => val !== undefined, {
                        message: field.errorMessage || `${field.name} is required`,
                    });
                } else {
                    validator = validator.optional();
                }

                break;

            case "string":
                validator = z.string();

                if (field.minLength) {
                    validator = validator.min(
                        field.minLength,
                        field.errorMessage ||
                            `${field.name} must be at least ${field.minLength} characters`,
                    );
                }

                if (field.isRequired) {
                    validator = validator.min(1, field.errorMessage || `${field.name} is required`);
                } else {
                    validator = validator.optional();
                }

                break;

            case "number":
                validator = z.number({
                    error: field.errorMessage || `${field.name} must be a number`,
                });

                if (field.isRequired) {
                    validator = validator.refine((val) => val !== undefined, {
                        message: field.errorMessage || `${field.name} is required`,
                    });
                } else {
                    validator = validator.optional();
                }
                break;

            case "boolean":
                validator = z.boolean({
                    error: field.errorMessage || `${field.name} must be a boolean`,
                });

                if (!field.isRequired) {
                    validator = validator.optional();
                }
                break;

            case "object":
                validator = z.object({});

                if (field.isRequired) {
                    validator = validator.refine((val) => Object.keys(val).length > 0, {
                        message: field.errorMessage || `${field.name} is required`,
                    });
                } else {
                    validator = validator.optional();
                }
                break;

            case "array":
                validator = z.array(z.any());

                if (field.isRequired) {
                    validator = validator.refine((val) => val.length > 0, {
                        message: field.errorMessage || `${field.name} is required`,
                    });
                } else {
                    validator = validator.optional();
                }
                break;

            default:
                throw new Error(`Unknown validation type: ${field.validationType}`);
        }

        shape[field.name] = validator;
    });

    return z.object(shape);
}
