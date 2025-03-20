import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetWeatherStations = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["weatherStations"],
    queryFn: async () => {
      const response = await axios.get(import.meta.env.VITE_MAPS_API_ADDRESS + "/weatherstations");
      const weatherStations = response.data;
      return weatherStations;
    },
  });

  return { isLoading, error, data };
};

export default useGetWeatherStations;
