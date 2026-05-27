import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../../../constants/query-keys";
import { listWorkoutPrograms } from "../../../services/programs/programs.service";

export const useWorkoutPrograms = () =>
  useQuery({
    queryKey: queryKeys.programs,
    queryFn: listWorkoutPrograms
  });
