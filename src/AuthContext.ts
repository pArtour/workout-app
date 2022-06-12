import React from "react";
import { User } from "@supabase/supabase-js";
import { Session } from "inspector";

export const AuthContext = React.createContext<{
    user: null | User | Session;
    authenticated: boolean;
    updateUser: (user: User | Session | null) => void;
}>({
    user: null,
    authenticated: false,
    updateUser: (user) => {},
});
