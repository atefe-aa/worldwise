import { useNavigate} from "react-router-dom";
import styles from "./Map.module.css";

function Map() {
  // const [searchParams, setSearchParams] = useSearchParams();
  // const lat = searchParams.get("lat");
  // const lng = searchParams.get("lng");

  const navigate = useNavigate();
  return (
    <div className={styles.mapContainer} onClick={() => navigate("form")}>
      Map
    </div>
  );
}

export default Map;
