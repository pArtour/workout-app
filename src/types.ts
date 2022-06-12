export interface Exercise {
    name: string;
    sets: string;
    reps: string;
    weight: string;
}
export interface Workout {
    id: number;

    name: string;
    type: string;
    exercises: Exercise[];
    updated_at: string;
    created_at: string;
}
