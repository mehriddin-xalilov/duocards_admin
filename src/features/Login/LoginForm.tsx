import { Button } from "@heroui/react";

import { Form, FormFields } from "@/components/Form";

import { useAuthHandler } from "@/hooks/useAuth";
import { authApi } from "@/services/api/auth.api";

export const LoginForm = () => {
    const { loginHandler } = useAuthHandler();

    return (
        <Form
            fetchFunction={(data) =>
                authApi.login({
                    login: data.username,
                    password: data.password,
                })
            }
            fields={[
                {
                    name: "username",
                    validationType: "string",
                    isRequired: true,
                    defaultValue: "",
                    errorMessage: "Iltimos Username'ingizni kiriting",
                },
                {
                    name: "password",
                    validationType: "string",
                    isRequired: true,
                    defaultValue: "",
                    errorMessage: "Iltimos parolingizni kiriting",
                },
            ]}
            onSuccess={(response) => {
                loginHandler(response.user, response.token);
            }}
        >
            {({ isLoading, ...formRestProps }) => (
                <>
                    <div className="flex w-full flex-col align-center justify-center gap-[22px] mt-[50px]">
                        <FormFields.Input
                            className="w-[340px]"
                            label="Username"
                            name="username"
                            radius="sm"
                            type="text"
                            {...formRestProps}
                        />

                        <FormFields.Input
                            className="w-[340px]"
                            label="Parol"
                            name="password"
                            radius="sm"
                            type="password"
                            {...formRestProps}
                        />

                        <Button
                            className="w-fit"
                            color="primary"
                            isLoading={isLoading}
                            radius="sm"
                            size="md"
                            type="submit"
                        >
                            Tizimga kirish
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
};
