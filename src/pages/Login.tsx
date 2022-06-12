import React from "react";
import {
    Container,
    Heading,
    VStack,
    Box,
    FormControl,
    FormLabel,
    Input,
    FormErrorMessage,
    Button,
    Link,
    useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Link as ReactLink, useNavigate } from "react-router-dom";
import Text from "../components/text/Text";
import { supabase } from "../supabase/init";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useTranslation } from "react-i18next";

interface LoginFormValues {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<LoginFormValues>();
    const navigate = useNavigate();
    const toast = useToast();
    const { updateUser } = useContext(AuthContext);

    const { t } = useTranslation();

    const onSubmit = async (values: LoginFormValues) => {
        try {
            const { user, error } = await supabase.auth.signIn({
                email: values.email,
                password: values.password,
            });
            if (error) {
                throw error;
            }
            updateUser(user);
            navigate("/");
        } catch (error: any) {
            toast({
                title: t("error"),
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            if (error?.message.toLowerCase().includes("password")) {
                setError("password", { type: "custom", message: error.message });
                return;
            }
            if (error?.message.toLowerCase().includes("email")) {
                setError("email", { type: "custom", message: error.message });
                return;
            }
        }
    };

    return (
        <Container p={0}>
            <Heading mb={4} as="h2" size="lg">
                {t("login")}
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={4} align="stretch">
                    <Box>
                        <FormControl isInvalid={!!errors.email}>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email"
                                {...register("email", {
                                    required: "This is required",
                                    minLength: { value: 4, message: t("minLength", { characters: 4 }) },
                                })}
                            />
                            <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControl isInvalid={!!errors.password}>
                            <FormLabel htmlFor="password">{t("password")}</FormLabel>
                            <Input
                                id="password"
                                placeholder={t("password")}
                                type="password"
                                {...register("password", {
                                    required: "This is required",
                                    minLength: { value: 4, message: t("minLength", { characters: 4 }) },
                                })}
                            />
                            <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
                        </FormControl>
                    </Box>
                </VStack>
                <VStack spacing={2}>
                    <Button mt={4} alignSelf="start" colorScheme="teal" isLoading={isSubmitting} type="submit">
                        {t("login")}
                    </Button>
                    <Text>
                        {t("dontHaveAccount")}?{" "}
                        <Link color="green.400" as={ReactLink} to="/register">
                            {t("register")}
                        </Link>
                    </Text>
                </VStack>
            </form>
        </Container>
    );
};

export default Login;
