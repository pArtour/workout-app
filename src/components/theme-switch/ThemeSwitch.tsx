import React from "react";
import { Box, useColorMode, BoxProps, useTheme } from "@chakra-ui/react";
import { CgSun as SunIcon } from "react-icons/cg";
import { BsMoonFill as MoonIcon } from "react-icons/bs";

interface ThemeSwitchProps extends BoxProps {}
const ThemeSwitch: React.FC<ThemeSwitchProps> = (props) => {
    const { colorMode, toggleColorMode } = useColorMode();

    const theme = useTheme();

    console.log(theme);

    return (
        <Box cursor="pointer" {...props}>
            {colorMode === "dark" ? (
                <SunIcon onClick={toggleColorMode} />
            ) : (
                <MoonIcon fill="#171923" onClick={toggleColorMode} />
            )}
        </Box>
    );
};

export default ThemeSwitch;
