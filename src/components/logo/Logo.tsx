import React from "react";
import { Box, BoxProps } from "@chakra-ui/react";
import Text from "../text/Text";

interface LogoProps extends BoxProps {}
const Logo: React.FC<LogoProps> = (props) => {
    return (
        <Box {...props}>
            <Text fontSize="lg" fontWeight="bold">
                Workout
            </Text>
        </Box>
    );
};

export default Logo;
