import { Button } from "@heroui/react";
import { Link } from "@tanstack/react-router";

export const Auth = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold flex items-center gap-2">Sign up </h1>

            <Button as={Link} color="primary" href="/login">
                /login
            </Button>
        </div>
    );
};
