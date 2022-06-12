import { Box, Stack } from "@chakra-ui/react";
import React from "react";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { supabase } from "../../supabase/init";
import MenuItem from "../menu-item/MenuItem";

interface MenuLinksProps {
    isOpen?: boolean;
}
const MenuLinks: React.FC<MenuLinksProps> = ({ isOpen }) => {
    const navigate = useNavigate();
    const { authenticated } = useContext(AuthContext);
    const { t } = useTranslation();

    const logout = async () => {
        await supabase.auth.signOut();
        navigate("/login");
    };

    return (
        <Box display={{ base: isOpen ? "block" : "none", md: "block" }} flexBasis={{ base: "100%", md: "auto" }}>
            <Stack
                spacing={8}
                align="center"
                justify={["center", "space-between", "flex-end", "flex-end"]}
                direction={["column", "row", "row", "row"]}
                pt={[4, 4, 0, 0]}
            >
                <MenuItem to="/">{t("home")}</MenuItem>
                {authenticated && <MenuItem to="create">{t("create")}</MenuItem>}

                {!authenticated && (
                    <MenuItem to="login" last>
                        {t("login")}
                    </MenuItem>
                )}
                {authenticated && (
                    <MenuItem notLink onClick={logout}>
                        {t("logout")}
                    </MenuItem>
                )}
            </Stack>
        </Box>
    );
};

export default MenuLinks;
