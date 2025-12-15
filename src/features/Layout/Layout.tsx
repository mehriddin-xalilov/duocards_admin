import { Sidebar } from "@/components/Sidebar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="p-3 w-full h-full flex">
            <Sidebar />
            <div className="w-full h-full flex items-start bg-white rounded-[12px] overflow-auto">
                {children}
            </div>
        </div>
    );
};
