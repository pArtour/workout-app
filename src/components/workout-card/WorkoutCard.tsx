import { Button, Flex, Heading, VStack } from "@chakra-ui/react";
import { ListItem, UnorderedList } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Workout } from "../../types";
import Text from "../text/Text";
import { Link as ReactLink } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { useTranslation } from "react-i18next";
import { capitalize } from "../..";

interface WorkoutCardProps {
    item: Workout;
    onDelete: (item: Workout) => void | Promise<void>;
}
const WorkoutCard: React.FC<WorkoutCardProps> = ({ item, onDelete }) => {
    const { authenticated } = useContext(AuthContext);
    const { t } = useTranslation();

    return (
        <VStack align={"start"} spacing={4} p={4} border="1px " borderColor="gray.200" borderRadius="md">
            <Heading textAlign="left" as={"h5"} size="lg">
                {item.name}
            </Heading>
            <Text textAlign="left" color="teal.600">
                {capitalize(t("type"))}: {item.type}
            </Text>
            <Heading textAlign="left" color="" as={"h6"} size="sm">
                {capitalize(t("exercises"))}
            </Heading>
            <UnorderedList pl={4}>
                {item.exercises.map((exercise) => (
                    <ListItem color="gray.500" key={exercise.name + exercise.reps + exercise.sets + exercise.weight}>
                        {capitalize(t("name"))}: {exercise.name}, {t("sets")}: {exercise.sets}, {t("reps")}:{" "}
                        {exercise.reps}, {t("weight")}: {exercise.weight}
                    </ListItem>
                ))}
            </UnorderedList>
            {authenticated ? (
                <Flex gap={2}>
                    <Button to={"/workouts/" + item.id} as={ReactLink} colorScheme="teal">
                        {t("edit")}
                    </Button>
                    <Button onClick={() => onDelete(item)} colorScheme="red">
                        {t("delete")}
                    </Button>
                </Flex>
            ) : null}
        </VStack>
    );
};

export default WorkoutCard;
