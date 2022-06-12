import React, { useContext } from "react";
import { Link as ReactLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
    FormErrorMessage,
    FormLabel,
    FormControl,
    Input,
    Button,
    Box,
    VStack,
    Container,
    Heading,
    Link,
    useToast,
} from "@chakra-ui/react";
import Text from "../components/text/Text";
import { supabase } from "../supabase/init";
import { AuthContext } from "../AuthContext";
import { useTranslation } from "react-i18next";

interface RegisterFormValues {
    email: string;
    password: string;
    confirmPassword: string;
}

const Register: React.FC = () => {
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<RegisterFormValues>();

    const { authenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const { t } = useTranslation();

    if (authenticated) {
        navigate("/");
    }

    const toast = useToast();

    const onSubmit = async (values: RegisterFormValues) => {
        if (values.confirmPassword === values.password) {
            try {
                const { error } = await supabase.auth.signUp({ email: values.email, password: values.password });
                toast({
                    title: t("success"),
                    description: t("accountCreated"),
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                if (error) {
                    throw error;
                }
                navigate("/login");
            } catch (error: any) {
                toast({
                    title: "Error",
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
        } else {
            setError("confirmPassword", { type: "custom", message: t("passwordNotEqual") });
        }
    };

    return (
        <Container p={0}>
            <Heading mb={4} as="h2" size="lg">
                {t("register")}
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
                                    required: t("required"),
                                    minLength: { value: 4, message: t("minLength", { characters: 4 }) },
                                })}
                            />
                            <FormErrorMessage>{errors.email && errors.email.message}</FormErrorMessage>
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControl isInvalid={!!errors.password}>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <Input
                                id="password"
                                placeholder="password"
                                type="password"
                                {...register("password", {
                                    required: t("required"),
                                    minLength: { value: 4, message: t("minLength", { characters: 4 }) },
                                })}
                            />
                            <FormErrorMessage>{errors.password && errors.password.message}</FormErrorMessage>
                        </FormControl>
                    </Box>
                    <Box>
                        <FormControl isInvalid={!!errors.confirmPassword}>
                            <FormLabel htmlFor="confirmPassword">{t("confirmPassword")}</FormLabel>
                            <Input
                                id="confirmPassword"
                                placeholder={t("confirmPassword")}
                                type="password"
                                {...register("confirmPassword", {
                                    required: t("required"),
                                    minLength: { value: 4, message: t("minLength", { characters: 4 }) },
                                })}
                            />
                            <FormErrorMessage>
                                {errors.confirmPassword && errors.confirmPassword.message}
                            </FormErrorMessage>
                        </FormControl>
                    </Box>
                </VStack>
                <VStack spacing={2}>
                    <Button mt={4} alignSelf="start" colorScheme="teal" isLoading={isSubmitting} type="submit">
                        {t("submit")}
                    </Button>
                    <Text>
                        {t("haveAcount")}?{" "}
                        <Link color="green.400" as={ReactLink} to="/login">
                            {t("login")}
                        </Link>
                    </Text>
                </VStack>
            </form>
        </Container>
    );
};

export default Register;
