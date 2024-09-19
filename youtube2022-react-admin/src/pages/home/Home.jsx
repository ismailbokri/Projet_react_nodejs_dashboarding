import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./home.scss";

import ComparisonComponent from "../../components/Comparison/ComparisonComponent"
import MapComponent from "../../components/Map/MapComponent";

const Home = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="listContainer">

           <ComparisonComponent/>
        </div>
        <div>
        <MapComponent/>
        </div>
      </div>
    </div>
  );
};

export default Home;
