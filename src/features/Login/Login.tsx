import { LoginForm } from "@/features/Login";

export const Login = () => {
    return (
        <div className="flex w-[1060px] h-[666px] bg-white rounded-3xl overflow-hidden">
            <div className="flex flex-col w-full gap-4 px-15 py-10">
                <div className="flex flex-col gap-[11px]">
                    <h1 className="text-black text-xl leading-7 font-semibold font-inter">
                        Lms o'quv markaz tizimiga kirish
                    </h1>

                    <p className="max-w-[477px] text-[#838383] text-sm leading-5 font-normal font-[Inter]">
                        Boshqaruv panelidan foydalangach, begona qurilmalarda login parollaringiz
                        saqlanib qolmasligi uchun tizimdan chiqishni unutmang: “Chiqish” tugmasini
                        bosib, CTRL+R ni bosing va tizimdan chiqqa ningizga ishonch hosil qiling.
                    </p>
                </div>

                <LoginForm />

                <p className="max-w-[367px] mt-auto text-[#838383] text-sm leading-5 font-normal font-[Inter]">
                    Tizimga kirar ekansiz siz barcha{" "}
                    <span className="text-[#04F] cursor-pointer">foydalanish shartlariga</span> rozi
                    bo’lganingizni bildirasiz!
                </p>
            </div>
            <div className="min-w-[500px] flex flex-col gap-4">
                <div className="w-full h-full bg-[url('/assets/images/login-background.png')] bg-cover bg-center" />
            </div>
        </div>
    );
};
