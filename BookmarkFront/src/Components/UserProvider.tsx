import { useState, type ReactNode } from 'react';
import { UserContext } from '../Context/UserContext';

// children => ReactNode, because it is supposed to take React Components
const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<string | null>(null);
    const [flag, changeFlag] = useState<boolean>(false);

    return (
        <UserContext.Provider value={{ user, setUser, flag, changeFlag }}>
            {children}
        </UserContext.Provider>
    );
}

export default UserProvider;
