import { Card, Descriptions, Divider, Skeleton, Statistic } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomFooter from "./CustomFooter";
import Title from "antd/es/typography/Title";
import {
  PlusOutlined,
  MinusOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";
import { createStyles } from "antd-style";

interface VoteData {
  inscrits: number;
  bulletinsDepose: number;
  blancNul: number;
  blancs: number | null;
  nuls: number | null;
  valable: number;
  hdm: number;
  eph: number;
  ps: number;
}

const useStyles = createStyles(({ css }) => ({
  statistic: css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
}));

function Year() {
  const { annee } = useParams<{ annee: string }>();
  const [data, setData] = useState<VoteData | null>(null);
  const [previousData, setPreviousData] = useState<VoteData | null>(null);
  const { styles } = useStyles();

  useEffect(() => {
    if (!annee) {
      console.error("Year is undefined");
      return;
    }

    const fetchData = async () => {
      try {
        const currentYearFile = `globalVote${annee}.json`;
        const previousYear = parseInt(annee) - 6;
        const previousYearFile = `globalVote${previousYear}.json`;
        console.log(previousYear);
        console.log(previousYearFile);
        const [currentYearResponse, previousYearResponse] = await Promise.all([
          fetch(`../../global/${currentYearFile}`),
          previousYear >= 0
            ? fetch(`../../global/${previousYearFile}`)
            : Promise.resolve({ json: () => null }),
        ]);

        const currentYearData: VoteData = await currentYearResponse.json();
        const previousYearData: VoteData | null =
          await previousYearResponse.json();

        setData(currentYearData);
        setPreviousData(previousYearData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [annee]);

  const calculateDifference = (current: number, previous: number | null) => {
    if (previous === null) return current;
    return current - previous;
  };

  const calculatePercentageChange = (
    current: number,
    previous: number | null
  ) => {
    if (previous === null || previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const renderStatistic = (
    title: string,
    current: number,
    previous: number | null
  ) => {
    if (previous === null) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Statistic
            title="Donnée"
            value={current}
            className={styles.statistic}
          />
          <Statistic
            title={title}
            value="N/A"
            precision={0}
            valueStyle={{ color: "#4C5B5C" }}
            className={styles.statistic}
          />
          <Statistic
            title="Pourcentage"
            value="N/A"
            precision={2}
            valueStyle={{ color: "#4C5B5C" }}
            suffix="%"
            className={styles.statistic}
          />
        </div>
      );
    }

    const difference = calculateDifference(current, previous);
    const percentageChange = calculatePercentageChange(current, previous);
    const isPositive = difference >= 0;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Statistic
          title="Donnée"
          value={current}
          className={styles.statistic}
        />
        <Statistic
          title={title}
          value={Math.abs(difference)}
          precision={0}
          valueStyle={{ color: isPositive ? "#3f8600" : "#cf1322" }}
          prefix={isPositive ? <PlusOutlined /> : <MinusOutlined />}
          className={styles.statistic}
        />
        <Statistic
          title="Pourcentage"
          value={Math.abs(percentageChange)}
          precision={2}
          valueStyle={{ color: isPositive ? "#3f8600" : "#cf1322" }}
          prefix={isPositive ? <RiseOutlined /> : <FallOutlined />}
          suffix="%"
          className={styles.statistic}
        />
      </div>
    );
  };

  return (
    <>
      <Card
        bordered={false}
        title={
          <Title level={1} style={{ textAlign: "center", marginTop: "20px" }}>
            {"Année : " + annee}
          </Title>
        }
      >
        {data ? (
          <div>
            <Descriptions title="Statistique Globale" bordered column={1}>
              <Descriptions.Item label="Inscrits">
                {renderStatistic(
                  "Différence Inscrits",
                  data.inscrits,
                  previousData?.inscrits ?? null
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Bulletins Déposés">
                {renderStatistic(
                  "Différence Bulletins Déposés",
                  data.bulletinsDepose,
                  previousData?.bulletinsDepose ?? null
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Blancs et Nuls">
                {renderStatistic(
                  "Différence Blancs et Nuls",
                  data.blancNul,
                  previousData?.blancNul ?? null
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Blancs">
                {renderStatistic(
                  "Différence Blancs",
                  data.blancs ?? 0,
                  previousData?.blancs ?? null
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Nuls">
                {renderStatistic(
                  "Différence Nuls",
                  data.nuls ?? 0,
                  previousData?.nuls ?? null
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Valables">
                {renderStatistic(
                  "Différence Valables",
                  data.valable,
                  previousData?.valable ?? null
                )}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <Descriptions title="Statistique des partis" bordered column={1}>
              <Descriptions.Item label="EPH">
                {renderStatistic(
                  "Différence EPH",
                  data.eph,
                  previousData?.eph ?? null
                )}
              </Descriptions.Item>
              <Descriptions.Item label="HDM">
                {renderStatistic(
                  "Différence HDM",
                  data.hdm,
                  previousData?.hdm ?? null
                )}
              </Descriptions.Item>
              <Descriptions.Item label="PS">
                {renderStatistic(
                  "Différence PS",
                  data.ps,
                  previousData?.ps ?? null
                )}
              </Descriptions.Item>
            </Descriptions>
          </div>
        ) : (
          <Skeleton />
        )}
      </Card>
      <CustomFooter />
    </>
  );
}

export default Year;
