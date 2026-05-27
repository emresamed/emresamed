import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../constants/query-keys";
import { listExercises } from "../../../services/exercises/exercises.service";

export const useExercises = () =>
  useQuery({
    queryKey: queryKeys.exercises,
    queryFn: listExercises
  });
