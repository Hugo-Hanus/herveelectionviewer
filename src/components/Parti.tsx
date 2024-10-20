import { useEffect, useState } from "react";
import { Card, Table, Statistic } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import type { TableColumnsType, TableProps } from "antd";
import { useParams } from "react-router-dom";
import { createStyles } from "antd-style";
import CustomFooter from "./CustomFooter";

interface Candidate {
  key: React.Key;
  ID: string;
  Name: string;
  Votes: string;
  Percentage: string;
  "Valid Votes": string;
  Rank: string;
  Year: string;
}

interface YearData {
  teteList: number;
  faveurCandidats: number;
  candidats: Candidate[];
}

interface PartiData {
  [key: string]: YearData;
}

const useStyles = createStyles(({ css }) => ({
  row2018: css`
    background-color: #f0f0f0; // Couleur de fond pour 2018
  `,
  row2024: css`
    background-color: #fafafa; // Couleur de fond pour 2024
  `,
}));

function Parti() {
  const { listName } = useParams();
  const [data, setData] = useState<Candidate[]>([]);
  const { styles } = useStyles();

  useEffect(() => {
    const partiLow = listName?.toLowerCase();
    fetch(`../../parti/${partiLow}/${partiLow}.json`)
      .then((response) => response.json())
      .then((data: PartiData) => {
        const combinedData = Object.keys(data).flatMap((year) =>
          data[year].candidats.map((candidate, index) => ({
            ...candidate,
            key: `${year}-${index}`,
            Year: year,
          }))
        );
        setData(combinedData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [listName]);

  // Extraire tous les noms uniques pour les filtres et les trier par ordre alphabétique
  const uniqueNames = Array.from(
    new Set(data.map((candidate) => candidate.Name))
  ).sort();

  const calculateVoteChange = (record: Candidate) => {
    const rankDifference = parseInt(record.ID) - parseInt(record.Rank);
    return rankDifference;
  };

  const columns: TableColumnsType<Candidate> = [
    {
      title: "Position Liste",
      dataIndex: "ID",
      key: "ID",
      sorter: (a, b) => parseInt(a.ID) - parseInt(b.ID),
    },
    {
      title: "Name",
      dataIndex: "Name",
      key: "Name",
      showSorterTooltip: { target: "full-header" },
      filters: uniqueNames.map((name) => ({ text: name, value: name })),
      onFilter: (value, record) => record.Name.indexOf(value as string) === 0,
      sorter: (a, b) => a.Name.localeCompare(b.Name),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Votes",
      dataIndex: "Votes",
      key: "Votes",
      defaultSortOrder: "descend",
      sorter: (a, b) => parseInt(a.Votes) - parseInt(b.Votes),
    },
    {
      title: "Percentage",
      dataIndex: "Percentage",
      key: "Percentage",
      sorter: (a, b) => parseFloat(a.Percentage) - parseFloat(b.Percentage),
      render: (text) => `${text}%`,
    },
    {
      title: "Year",
      dataIndex: "Year",
      key: "Year",
      filters: [
        {
          text: "2018",
          value: "2018",
        },
        {
          text: "2024",
          value: "2024",
        },
      ],
      onFilter: (value, record) => record.Year.indexOf(value as string) === 0,
      sorter: (a, b) => parseInt(a.Year) - parseInt(b.Year),
    },
    {
      title: "Vote Change",
      key: "voteChange",
      render: (text, record) => {
        const voteChange = calculateVoteChange(record);
        let valueStyle;
        let prefix = null;

        if (voteChange > 0) {
          valueStyle = { color: "#3f8600" };
          prefix = <PlusOutlined />;
        } else if (voteChange < 0) {
          valueStyle = { color: "#cf1322" };
          prefix = <MinusOutlined />;
        } else {
          valueStyle = { color: "#1890ff" };
        }

        return (
          <Statistic
            value={Math.abs(voteChange)}
            precision={0}
            valueStyle={valueStyle}
            prefix={prefix}
            suffix="place % N° Liste"
          />
        );
      },
    },
  ];

  const onChange: TableProps<Candidate>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const rowClassName = (record: Candidate) => {
    return record.Year === "2018" ? styles.row2018 : styles.row2024;
  };

  return (
    <>
      <Card bordered={false} title="Parti">
        {data.length > 0 ? (
          <Table<Candidate>
            columns={columns}
            dataSource={data}
            onChange={onChange}
            pagination={false}
            showSorterTooltip={{ target: "sorter-icon" }}
            rowClassName={rowClassName}
          />
        ) : (
          "Loading..."
        )}
      </Card>
      <CustomFooter />
    </>
  );
}

export default Parti;
