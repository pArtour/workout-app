import React, { PropsWithChildren } from "react";
import { Text as ChakraText, TextProps as ChakraTextProps, useColorModeValue } from "@chakra-ui/react";

interface TextProps extends ChakraTextProps {}
const Text: React.FC<PropsWithChildren<TextProps>> = ({ children, ...rest }) => {
    const primaryFontColor = useColorModeValue("gray.800", "gray.100");
    return (
        <ChakraText color={primaryFontColor} {...rest}>
            {children}
        </ChakraText>
    );
};

export default Text;
