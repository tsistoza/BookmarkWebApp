import { createContext, useContext } from "react";

interface UserContextType {
    user: string | null;
    setUser: React.Dispatch<React.SetStateAction<string | null>>;
    flag: boolean;
    changeFlag: React.Dispatch<React.SetStateAction<boolean>>
};

export const UserContext = createContext<UserContextType | null>(null);

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) throw new Error("NOT LOGGED IN\n");
    return context;
}
