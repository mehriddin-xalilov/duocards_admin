export const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="p-2 h-screen overflow-y-hidden bg-[url('/assets/images/background.webp')] bg-cover bg-center">
            <div className="bg-black/48 backdrop-blur-3xl rounded-[20px] h-full flex items-center justify-center">
                {children}
            </div>
        </div>
    );
};
