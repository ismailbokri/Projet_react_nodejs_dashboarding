import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./Details.scss";
import Expensive from "../../components/Expensive/Expensive";
import Rate from "../../components/Rate/Rate";
import Bigest from "../../components/Bigest/Bigest";
import CampingS from "../../components/CampingS/CampingS";
import Chart from "../../components/chart/Chart";
import Featured from "../../components/featured/Featured";

const Home = () => {
  return (
    <div className="home">
      <Sidebar />

      

      <div className="homeContainer">
        <Navbar />
       
        <div className="charts">
        <Featured    />
        <div className="imageContainer">
    <img
      src="https://assets.architecturaldigest.in/photos/600845b5eebcfd50ede87936/16:9/w_2560,c_limit/Bengaluru-home-Bodhi-Design-Studio-17-1366x768.jpg"
      alt="Home"
      aspect={3 / 1} />
  </div>



  </div>

        <div className="listContainer">

  <CampingS title="Select your camping Name" aspect={2 / 1} />
</div>

        <div className="charts">
        <div className="listTitle">Bigest Room 
          <Bigest aspect={3 / 1}/>
          </div>
          <div className="listTitle">Most expensive Room 
          <Expensive aspect={3 / 1}/>
          </div>
          <div className="listTitle">Highest Rate Room 
          <Rate aspect={3 / 1}/>
        </div>
        </div>
        <div className="listContainer">
          <div className="listTitle">Comparasion Table</div>
          <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
        </div>

      </div>
    </div>
  );
};

export default Home;
