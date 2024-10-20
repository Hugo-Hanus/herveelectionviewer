import { Card, Descriptions } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface VoteData {
  inscrits: number;
  bulletinsDepose: number;
  blancNul: number;
  blancs: number;
  nuls: number;
  valable: number;
  hdm: number;
  eph: number;
  ps: number;
}

function Year() {
  const { annee } = useParams();
  const [data, setData] = useState<VoteData | null>(null);

  useEffect(() => {
    const partiLow = annee?.toLowerCase();
    fetch(`../../global/globalVote${partiLow}.json`)
      .then((response) => response.json())
      .then((data: VoteData) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, [annee]);

  return (
    <Card bordered={false} title={`Year ${annee}`}>
      {data ? (
        <Descriptions bordered>
          <Descriptions.Item label="Inscrits">
            {data.inscrits}
          </Descriptions.Item>
          <Descriptions.Item label="Bulletins Déposés">
            {data.bulletinsDepose}
          </Descriptions.Item>
          <Descriptions.Item label="Blancs et Nuls">
            {data.blancNul}
          </Descriptions.Item>
          <Descriptions.Item label="Blancs">{data.blancs}</Descriptions.Item>
          <Descriptions.Item label="Nuls">{data.nuls}</Descriptions.Item>
          <Descriptions.Item label="Valables">{data.valable}</Descriptions.Item>
          <Descriptions.Item label="HDM">{data.hdm}</Descriptions.Item>
          <Descriptions.Item label="EPH">{data.eph}</Descriptions.Item>
          <Descriptions.Item label="PS">{data.ps}</Descriptions.Item>
        </Descriptions>
      ) : (
        "Loading..."
      )}
    </Card>
  );
}

export default Year;
