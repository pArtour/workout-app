import React from "react";
import { Box } from "@chakra-ui/react";
import { GrClose as CloseIcon, GrMenu as MenuIcon } from "react-icons/gr";
interface MenuToggleProps {
    isOpen: boolean;
    toggle: () => void;
}
const MenuToggle: React.FC<MenuToggleProps> = ({ isOpen, toggle }) => {
    return (
        <Box cursor="pointer" display={{ base: "block", md: "none" }} ml={4} color="gray.800" onClick={toggle}>
            {isOpen ? <CloseIcon /> : <MenuIcon />}
        </Box>
    );
};

export default MenuToggle;
