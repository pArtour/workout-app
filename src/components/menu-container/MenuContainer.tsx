import { Flex } from "@chakra-ui/react";
import React from "react";

const MenuContainer: React.FC<React.PropsWithChildren> = ({ children, ...rest }) => {
    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            w="100%"
            p={8}
            bg={["primary.500", "primary.500", "transparent", "transparent"]}
            color={["white", "white", "primary.700", "primary.700"]}
            {...rest}
        >
            {children}
        </Flex>
    );
};

export default MenuContainer;
