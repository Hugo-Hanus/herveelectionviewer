import { Content } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import CustomFooter from "./CustomFooter";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const data = {
  labels: ["HDM", "EPH", "PS"],
  datasets: [
    {
      data: [14, 9, 2],
      backgroundColor: ["#1A659E", "#FFCE56", "#C52233"], // Couleurs personnalisées
      hoverBackgroundColor: ["#1A659E", "#FFCE56", "#C52233"], // Couleurs au survol
    },
  ],
};

const options = {
  circumference: 180, // Arc de 180 degrés
  rotation: -90, // Rotation pour démarrer à partir du haut
  plugins: {
    datalabels: {
      color: "white",
      font: {
        weight: "bold" as "bold", // Utilisation de la valeur acceptée
        size: 16,
      },
      formatter: (value: number) => `${value} sièges`, // Formater les valeurs comme nombre de sièges
    },
    legend: {
      position: "top" as const, // Utilisation de la valeur acceptée
      labels: {
        padding: 10, // Réduire l'espacement entre la légende et le graphique
      },
    },
  },
  layout: {
    padding: {
      top: 0, // Réduire l'espacement en haut
      bottom: 0, // Réduire l'espacement en bas
    },
  },
};

function Home() {
  return (
    <>
      <style>
        {`
          @keyframes blinker {
            50% {
              opacity: 0;
            }
          }
          .blinking-title {
            animation: blinker 1s linear infinite;
          }
          .chart-container {
            width: 500px;
            height:500px;
            margin: 0 auto; /* Centrer le graphique */
          }
        `}
      </style>
      <Content style={{ padding: "0 50px", marginTop: 64 }}>
        <Title
          level={1}
          //className="blinking-title"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          Répartition 2024
        </Title>
        <div className="chart-container">
          <Pie data={data} options={options} />
        </div>
      </Content>
      <CustomFooter />
    </>
  );
}

export default Home;
