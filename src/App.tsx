import React, { useCallback, useMemo, useState } from "react";
import { Box, ChakraProvider } from "@chakra-ui/react";
import Header from "./components/header/Header";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthContext } from "./AuthContext";
import { User } from "@supabase/supabase-js";
import { supabase } from "./supabase/init";
import { Session } from "inspector";
import EditWorkout from "./pages/EditWorkout";

import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";

i18n.use(initReactI18next) // passes i18n down to react-i18next
    .init({
        // the translations
        // (tip move them in a JSON file and import them,
        // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
        resources: {
            en: {
                translation: {
                    home: "Home",
                    create: "Create",
                    logout: "Logout",
                    login: "Login",
                    edit: "Edit",
                    delete: "Delete",
                    type: "Type",
                    exercises: "Exercises",
                    name: "Name",
                    sets: "sets",
                    reps: "reps",
                    weight: "weight",
                    createNew: "Create a new training",
                    mainInfo: "Training main info",
                    cardio: "Cardio",
                    strength: "Strength",
                    trainingExercises: "Training exercises",
                    addExercise: "Add exercise",
                    reset: "Reset",
                    error: "Error",
                    newWorkoutCreated: "New workout has been successfully created",
                    oneExercise: "There should be at least 1 exercise",
                    required: "This is required",
                    minLength: "Minimum length should be {characters} characters",
                    workoutEdited: "Workout has been successfully edited",
                    editTraining: "Edit training",
                    trainingPlaceholder: "Training name",
                    save: "Save",
                    accountCreated: "Successfully created a new account",
                    passwordNotEqual: "Password are not equal",
                    submit: "Submit",
                    password: "Password",
                    confirmPassword: "Confirm password",
                    haveAcount: "Already have an account?",
                    register: "Register",
                    dontHaveAccount: "Don't have an account?",
                    selectOption: "Select option",
                },
            },
            ru: {
                translation: {
                    home: "Главная",
                    create: "Создать",
                    logout: "Выйти",
                    login: "Войти",
                    edit: "Изменить",
                    delete: "Удалить",
                    type: "Тип",
                    exercises: "Упражнения",
                    name: "Название",
                    sets: "подходов",
                    reps: "повторения",
                    weight: "вес",
                    createNew: "Создать новую тренировку",
                    mainInfo: "Детали занятия",
                    cardio: "Кардио",
                    strength: "Силовая",
                    trainingExercises: "Упражнения тренировки",
                    addExercise: "Добавить упражнение",
                    reset: "Очистить",
                    error: "Ошибка",
                    newWorkoutCreated: "Новая тренировка была создана",
                    oneExercise: "Должно быть хотя бы одно упражнение",
                    required: "Это обязательное поле",
                    minLength: "Минимум {characters} буквы",
                    workoutEdited: "Тренировка изменина",
                    editTraining: "Изменить тренировку",
                    trainingPlaceholder: "Название тренировки",
                    save: "Сохранить",
                    accountCreated: "Аккаунт успешно создан",
                    passwordNotEqual: "Пароли не совпадают",
                    submit: "Создать",
                    password: "Пароль",
                    confirmPassword: "Подтвердить пароль",
                    haveAcount: "Уже есть аккаунт",
                    register: "Зарегистрироваться",
                    dontHaveAccount: "Еще нет аккаунта?",
                    selectOption: "Выбрать вариант",
                },
            },
            ee: {
                translation: {
                    home: "Koduleht",
                    create: "Loo",
                    logout: "Logi välja",
                    login: "Logi sisse",
                    edit: "Muuta",
                    delete: "Kustuta",
                    type: "Tüüp",
                    exercises: "Harjutused",
                    name: "Nimi",
                    sets: "sets",
                    reps: "kordamised",
                    weight: "kaal",
                    createNew: "Loo uut trenni",
                    mainInfo: "Trenni info",
                    cardio: "Kardio",
                    strength: "Jõu",
                    trainingExercises: "Treeningharjutused",
                    addExercise: "Lisada harjutust",
                    reset: "Lähtesta",
                    error: "Viga",
                    newWorkoutCreated: "Uus treening on edukalt loodud",
                    oneExercise: "Peaks olema vähemalt 1 harjutus",
                    required: "See on vajalik",
                    minLength: "Peaks olema {characters} tähemärki",
                    workoutEdited: "Treeningut on edukalt muudetud",
                    editTraining: "Muuda trenni",
                    trainingPlaceholder: "Trenni nimi",
                    save: "Salvesta",
                    accountCreated: "Uus konto on loodetud",
                    passwordNotEqual: "Parool ei ole võrdsed",
                    submit: "Esita",
                    password: "Parool",
                    confirmPassword: "Kinnita parool",
                    haveAcount: "Kas teil on juba konto",
                    register: "Registreeru",
                    dontHaveAccount: "Pole kontot",
                    selectOption: "Vali valil",
                },
            },
        },
        lng: "en",
        fallbackLng: "en",

        interpolation: {
            escapeValue: false,
        },
    });

function App() {
    const [user, setUser] = useState<null | User | Session>(() => {
        return supabase.auth.user();
    });

    const authenticated = useMemo(() => !!user, [user]);

    supabase.auth.onAuthStateChange((_, session) => {
        setUser(session as any);
    });

    const updateUser = useCallback((newUser: null | User | Session) => {
        setUser(newUser);
    }, []);

    return (
        <AuthContext.Provider value={{ user, authenticated, updateUser }}>
            <ChakraProvider>
                <Header />
                <Box as="main" p={8}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="create" element={<Create />} />
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="workouts/:workoutId" element={<EditWorkout />} />
                    </Routes>
                </Box>
            </ChakraProvider>
        </AuthContext.Provider>
    );
}

export default App;
