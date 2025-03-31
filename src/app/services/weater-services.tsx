import axios from "axios";

const key = "0f3b46ddeb3fb5597221ec8293f713a7";
const baseURL = "https://api.openweathermap.org/data/2.5";

export const getWeatherByCity = async (city: string) => {
  try {
    const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        q: city,
        appid: key,
        lang: "pt_br",
        units: "metric",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados do clima:", error);
    return null;
  }
};
export const getForecastByCity = async (city: string) => {
  try {
    const response = await axios.get("https://api.openweathermap.org/data/2.5/forecast", {
      params: {
        q: city,
        appid: key,
        lang: "pt_br",
        units: "metric",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar previsão de 5 dias:", error);
    return null;
  }
};