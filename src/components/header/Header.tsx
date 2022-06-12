import { Box, Select, useColorMode } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";
import Logo from "../logo/Logo";
import MenuContainer from "../menu-container/MenuContainer";
import MenuLinks from "../menu-links/MenuLinks";
import MenuToggle from "../menu-toggle/MenuToggle";
import ThemeSwitch from "../theme-switch/ThemeSwitch";

const Header = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const toggle = () => setIsOpen(!isOpen);
    const { i18n } = useTranslation();
    const { colorMode } = useColorMode();

    return (
        <Box as="header" borderBottom="1px" borderBottomColor="gray.500">
            <MenuContainer>
                <Logo w="100px" />

                <ThemeSwitch mr={4} sx={{ marginLeft: "auto" }} />

                <MenuLinks isOpen={isOpen} />
                <Select
                    color={colorMode === "dark" ? "primary" : "gray.800"}
                    ml={4}
                    width="fit-content"
                    onChange={(e) => i18n.changeLanguage(e.target.value)}
                    defaultValue="en"
                >
                    <option value="en">EN</option>
                    <option value="ee">EE</option>
                    <option value="ru">RU</option>
                </Select>
                <MenuToggle toggle={toggle} isOpen={isOpen} />
            </MenuContainer>
        </Box>
    );
};

export default Header;
