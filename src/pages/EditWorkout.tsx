import {
    useToast,
    useBreakpointValue,
    Center,
    Spinner,
    Grid,
    GridItem,
    Box,
    Button,
    Divider,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    Input,
    Select,
    SimpleGrid,
    VStack,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabase/init";
import { Exercise, Workout } from "../types";

import { BsFillTrashFill as RemoveIcon } from "react-icons/bs";
import { AuthContext } from "../AuthContext";
import { useTranslation } from "react-i18next";
import { capitalize } from "..";

interface EditFormValues {
    name: string;
    type: string;
    exercises: { name: string; sets: number; reps: number; weight: number }[];
}

const EditWorkout = () => {
    let { workoutId } = useParams();

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Workout | null>(null);

    const { authenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    const { t } = useTranslation();

    if (!authenticated) {
        navigate("/login");
    }

    const getData = async () => {
        const { data: workouts, error } = await supabase.from("workouts").select("*").eq("id", workoutId);
        setLoading(false);
        if (error || !workouts) throw error;
        setData(workouts[0] || null);

        setValue("name", workouts[0]!.name);
        setValue("type", workouts[0]!.type);
        setValue(
            "exercises",
            workouts[0]!.exercises.map((item: Exercise) => ({
                name: item.name,
                sets: +item.sets,
                reps: +item.reps,
                weight: +item.weight,
            }))
        );
    };

    const {
        formState: { errors, isSubmitting },
        control,
        handleSubmit,
        register,
        reset,
        setError,
        setValue,
        watch,
    } = useForm<EditFormValues>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "exercises",
    });

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

    const onSubmit = async (values: EditFormValues) => {
        if (values.exercises.length === 0) {
            toast({
                title: t("error"),
                description: t("oneExercise"),
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const { error } = await supabase.from("workouts").update(values).eq("id", workoutId);
            if (error) throw error;
            toast({
                title: t("success"),
                description: t("workoutEdited"),
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
        console.log(values);
    };

    useEffect(() => {
        setLoading(true);
        try {
            getData();
        } catch (error: any) {
            toast({
                title: t("error"),
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }, []);

    if (!data) {
        return null;
    }

    return loading ? (
        <Center>
            <Spinner />
        </Center>
    ) : (
        <Box as="main">
            <Heading mb={4} as="h2" size="lg">
                {t("editTraining")}
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
                                                    placeholder={t("name")}
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
                                                    placeholder={capitalize(t("sets"))}
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
                                                    placeholder={capitalize(t("reps"))}
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
                            {t("save")}
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

export default EditWorkout;
