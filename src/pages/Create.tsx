import React, { useContext } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
    FormErrorMessage,
    FormLabel,
    FormControl,
    Input,
    Button,
    Box,
    VStack,
    Heading,
    Select,
    SimpleGrid,
    Flex,
    Divider,
    useBreakpointValue,
    useToast,
} from "@chakra-ui/react";
import { BsFillTrashFill as RemoveIcon } from "react-icons/bs";
import { supabase } from "../supabase/init";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { capitalize } from "..";

interface CreateFormValues {
    name: string;
    type: string;
    exercises: { name: string; sets: number; reps: number; weight: number }[];
}

const Create: React.FC = () => {
    const {
        formState: { errors, isSubmitting },
        control,
        handleSubmit,
        register,
        reset,
        watch,
    } = useForm<CreateFormValues>();

    const { t } = useTranslation();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "exercises",
    });

    const { authenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!authenticated) {
        navigate("/login");
    }

    const toast = useToast();

    const watchFieldArray = watch("exercises");

    const controlledFields = fields.map((field, index) => {
        return {
            ...field,
            ...watchFieldArray[index],
        };
    });

    const removeButtonMargin = useBreakpointValue({ base: 0, md: 8 });
    const addButtonMargin = useBreakpointValue({ base: 0, md: 4 });
    const buttonsWidth = useBreakpointValue({ base: "full", md: "auto" });

    const onSubmit = async (values: CreateFormValues) => {
        if (values.exercises.length === 0) {
            toast({
                title: "Error",
                description: t("oneExercise"),
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const { error } = await supabase.from("workouts").insert([values]);

            if (error) throw error;
            reset();
            toast({
                title: "Success",
                description: t("newWorkoutCreated"),
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error: any) {
            toast({
                title: t("error"),
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Box as="main">
            <Heading mb={4} as="h2" size="lg">
                {t("createNew")}
            </Heading>
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack spacing={4} align="stretch">
                    <SimpleGrid spacing={4} columns={{ md: 1, lg: 2 }}>
                        <VStack spacing={2} align="stretch">
                            <Heading as="h4" size="md">
                                {t("mainInfo")}
                            </Heading>
                            <Box width="100">
                                <FormControl isInvalid={!!errors.name}>
                                    <FormLabel htmlFor="email">{t("name")}</FormLabel>
                                    <Input
                                        id="name"
                                        placeholder={t("trainingPlaceholder")}
                                        {...register("name", {
                                            required: t("required"),
                                        })}
                                    />
                                    <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl isInvalid={!!errors.type}>
                                    <FormLabel htmlFor="type">{capitalize(t("type"))}</FormLabel>
                                    <Select
                                        id="type"
                                        placeholder={t("selectOption")}
                                        {...register("type", {
                                            required: t("required"),
                                        })}
                                    >
                                        <option value="cardio">{t("cardio")}</option>
                                        <option value="strength">{t("strength")}</option>
                                    </Select>
                                    <FormErrorMessage>{errors.type && errors.type.message}</FormErrorMessage>
                                </FormControl>
                            </Box>
                        </VStack>
                        <VStack spacing={controlledFields.length ? 2 : 5} align="stretch">
                            <Heading as="h4" size="md">
                                {t("trainingExercises")}
                            </Heading>
                            <VStack divider={<Divider mt={6} />} spacing={4} align="stretch">
                                {controlledFields.map((field, index) => {
                                    return (
                                        <SimpleGrid columns={{ md: 1, lg: 5 }} rowGap={2} columnGap={2} key={field.id}>
                                            <FormControl isInvalid={!field.name}>
                                                <FormLabel htmlFor={`exercises[${index}].name`}>{t("name")}</FormLabel>
                                                <Input
                                                    id={`exercises[${index}].name`}
                                                    type="text"
                                                    placeholder="Name"
                                                    {...register(`exercises.${index}.name` as any, {
                                                        required: t("required"),
                                                        minLength: {
                                                            value: 3,
                                                            message: t("minLength", { characters: 3 }),
                                                        },
                                                    })}
                                                />
                                                {errors.exercises && errors.exercises[index] && (
                                                    <FormErrorMessage>
                                                        {((errors?.exercises as any) || [])[index]?.name?.message}
                                                    </FormErrorMessage>
                                                )}
                                            </FormControl>
                                            <FormControl isInvalid={!field.sets}>
                                                <FormLabel htmlFor={`exercises[${index}].sets`}>
                                                    {capitalize(t("sets"))}
                                                </FormLabel>
                                                <Input
                                                    id={`exercises[${index}].sets`}
                                                    type="number"
                                                    placeholder="Sets"
                                                    {...register(`exercises.${index}.sets` as any, {
                                                        required: t("required"),
                                                    })}
                                                />
                                                {errors.exercises && errors.exercises[index] && (
                                                    <FormErrorMessage>
                                                        {((errors?.exercises as any) || [])[index]?.sets?.message}
                                                    </FormErrorMessage>
                                                )}
                                            </FormControl>
                                            <FormControl isInvalid={!field.reps}>
                                                <FormLabel htmlFor={`exercises[${index}].reps`}>
                                                    {capitalize(t("reps"))}
                                                </FormLabel>
                                                <Input
                                                    id={`exercises[${index}].reps`}
                                                    type="number"
                                                    placeholder="Reps"
                                                    {...register(`exercises.${index}.reps` as any, {
                                                        required: t("required"),
                                                    })}
                                                />
                                                {errors.exercises && errors.exercises[index] && (
                                                    <FormErrorMessage>
                                                        {((errors?.exercises as any) || [])[index]?.reps?.message}
                                                    </FormErrorMessage>
                                                )}
                                            </FormControl>
                                            <FormControl isInvalid={!field.weight}>
                                                <FormLabel htmlFor={`exercises[${index}].weight`}>
                                                    {capitalize(t("weight"))}
                                                </FormLabel>
                                                <Input
                                                    id={`exercises[${index}].weight`}
                                                    type="number"
                                                    placeholder={capitalize(t("weight"))}
                                                    {...register(`exercises.${index}.weight` as any, {
                                                        required: t("required"),
                                                    })}
                                                />
                                                {errors.exercises && errors.exercises[index] && (
                                                    <FormErrorMessage>
                                                        {((errors?.exercises as any) || [])[index]?.weight?.message}
                                                    </FormErrorMessage>
                                                )}
                                            </FormControl>
                                            <Button
                                                mt={removeButtonMargin}
                                                variant="outline"
                                                colorScheme="red"
                                                type="button"
                                                onClick={() => remove(index)}
                                            >
                                                <RemoveIcon />
                                            </Button>
                                        </SimpleGrid>
                                    );
                                })}
                            </VStack>
                            <Button mt={controlledFields.length ? 0 : addButtonMargin} onClick={() => append({})}>
                                {t("addExercise")}
                            </Button>
                        </VStack>
                    </SimpleGrid>
                    <Flex gap={2} justifyContent="center">
                        <Button width={buttonsWidth} colorScheme="teal" isLoading={isSubmitting} type="submit">
                            {t("create")}
                        </Button>
                        <Button
                            width={buttonsWidth}
                            isLoading={isSubmitting}
                            colorScheme="teal"
                            variant="outline"
                            type="reset"
                            onClick={() => remove(controlledFields.map((item) => item.id as any))}
                        >
                            {t("reset")}
                        </Button>
                    </Flex>
                </VStack>
            </form>
        </Box>
    );
};

export default Create;
