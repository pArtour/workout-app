import React from "react";
import { Link as ReactLink } from "react-router-dom";
import { Link, TextProps } from "@chakra-ui/react";
import Text from "../text/Text";

interface MenuItemProps extends React.PropsWithChildren<TextProps> {
    last?: boolean;
    to?: string;
    notLink?: boolean;
}
const MenuItem: React.FC<MenuItemProps> = ({ children, last = false, to = "/", notLink = false, ...rest }) => {
    return notLink ? (
        <Text cursor="pointer" {...rest}>
            {children}
        </Text>
    ) : (
        <Link as={ReactLink} to={to}>
            <Text>{children}</Text>
        </Link>
    );
};

export default MenuItem;
