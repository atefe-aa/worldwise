// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useReducer } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import Spinner from "./Spinner";
import Message from "./Message";
import { useURLPosition } from "../Hooks/useURLPosition";
import useCities from "../Hooks/useCities";
import { useNavigate } from "react-router-dom";

function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

const initialState = {
  cityName: "",
  emoji: "",
  date: new Date(),
  notes: "",
  isLoadingGeocodding: false,
  geocoddingError: "",
  country: "",
};

function reducer(state, action) {
  const pay = action.payload;
  switch (action.type) {
    case "inputCity":
      return { ...state, cityName: pay };
    case "inputDate":
      return { ...state, date: pay };
    case "inputNotes":
      return { ...state, notes: pay };
    case "setIsLoading":
      if (pay)
        return { ...state, isLoadingGeocodding: pay, geocoddingError: "" };
      return { ...state, isLoadingGeocodding: pay };
    case "setGeocodding":
      return {
        ...state,
        cityName: pay.city || pay.locality || "",
        emoji: convertToEmoji(pay.countryCode),
        country: pay.countryName,
      };
    case "setError":
      return { ...state, geocoddingError: pay };
    default:
      throw new Error("Unknown Action!");
  }
}

const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export function Form() {
  const [
    {
      cityName,
      emoji,
      date,
      notes,
      country,
      isLoadingGeocodding,
      geocoddingError,
    },
    dispatch,
  ] = useReducer(reducer, initialState);
  const [lat, lng] = useURLPosition();
  const { addCity, isLoading } = useCities();
  const navigate = useNavigate();

  useEffect(
    function () {
      async function fetchCityData() {
        if (!lat || !lng) return;
        try {
          dispatch({ type: "setIsLoading", payload: true });

          const res = await fetch(
            `${BASE_URL}?latitude=${lat}&longitude=${lng}`
          );
          const data = await res.json();
          if (!data.countryCode)
            throw new Error(
              "This doesn't seem like a city! Try selecting somewhere else😉"
            );
          dispatch({ type: "setGeocodding", payload: data });
        } catch (err) {
          dispatch({ type: "setError", payload: err.message });
        } finally {
          dispatch({ type: "setIsLoading", payload: false });
        }
      }
      fetchCityData();
    },
    [lat, lng]
  );

  async function handleAddCity(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    const newCity = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat: Number(lat),
        lng: Number(lng),
      },
    };

    await addCity(newCity);
    navigate("/app/cities");
  }

  if (!lat || !lng) return <Message message="Start by clicking on the map!" />;
  if (isLoadingGeocodding) return <Spinner />;
  if (geocoddingError) return <Message message={geocoddingError} />;
  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleAddCity}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) =>
            dispatch({ type: "inputCity", payload: e.target.value })
          }
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) =>
            dispatch({ type: "inputDate", payload: e.target.value })
          }
          value={date}
        /> */}
        <DatePicker
          id="date"
          selected={date}
          dateFormat="dd/MM/yyyy"
          onChange={(date) => dispatch({ type: "inputDate", payload: date })}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) =>
            dispatch({ type: "inputNotes", payload: e.target.value })
          }
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;
