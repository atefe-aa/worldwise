import { createContext, useEffect, useReducer, useState } from "react";

const BASE_URL = "http://localhost/API";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/created":
      return { ...state, isLoading: false, 
        cities: [...state.cities, action.payload] ,
        currentCity: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/deleted":
      return { ...state, isLoading: false };
    case "rejected":
      return { ...state, error: action.payload };
    default:
      throw new Error("Unkown Action!");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  async function fetchCities() {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      dispatch({ type: "cities/loaded", payload: data.cities });
    } catch {
      dispatch({
        type: "rejected",
        payload: "Something is wrong with fetching data!",
      });
    }
  }
  useEffect(function () {
    fetchCities();
  }, []);

  async function getCity(id) {
    if (Number(id) === currentCity.id) return;
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data.cities.at(0) });
    } catch {
      dispatch({
        type: "rejected",
        payload: "Something is wrong with fetching data!",
      });
    }
  }

  async function addCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/addCity.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCity),
      });

      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    
      // await fetchCities();
    } catch {
      dispatch({
        type: "rejected",
        payload: "Something is wrong with adding City!",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/deleteCity.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      // Fetch updated list of cities after adding a new city
      await fetchCities();
    } catch {
      dispatch({
        type: "rejected",
        payload: "Something is wrong with deleting City!",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        addCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

export { CitiesProvider, CitiesContext };
