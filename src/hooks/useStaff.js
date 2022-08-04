import useSWR from "swr";

export const useStaff = () => {
  const { data: staff, mutate, error } = useSWR("/staff");

  const loading = !staff && !error;

  return { staff, loading, error, mutate };
};
