import { Center, Grid, GridItem, Spinner, useBreakpointValue, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import WorkoutCard from "../components/workout-card/WorkoutCard";
import { supabase } from "../supabase/init";
import { Workout } from "../types";

const Home: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Workout[]>([]);

    const toast = useToast();

    const getData = async () => {
        const { data, error } = await supabase.from("workouts").select("*");
        setLoading(false);
        if (error) throw error;
        setData(data);
    };

    const deleteItem = async (item: Workout) => {
        console.log(item);

        const { error } = await supabase
            .from("workouts")
            .delete()
            .eq("id", "" + item.id);
        await getData();
        if (error) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const grip = useBreakpointValue({ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(4, 1fr)" });

    useEffect(() => {
        setLoading(true);
        try {
            getData();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    }, []);

    return loading ? (
        <Center>
            <Spinner />
        </Center>
    ) : (
        <Grid templateColumns={grip} gap={6} pt={2} pb={2}>
            {data.map((item) => (
                <GridItem key={item.id}>
                    <WorkoutCard item={item} onDelete={deleteItem} />
                </GridItem>
            ))}
        </Grid>
    );
};

export default Home;
