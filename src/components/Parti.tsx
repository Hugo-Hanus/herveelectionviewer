import { useEffect, useState } from "react";
import { Card, Table, Statistic, Input, Tag } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import type { TableColumnsType, TableProps } from "antd";
import { useParams } from "react-router-dom";
import { createStyles } from "antd-style";
import CustomFooter from "./CustomFooter";
import Title from "antd/es/typography/Title";

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
  fontText: css`
    font-size: 20px;
  `,
  statisticContent: css`
    .ant-statistic-content-value {
      font-size: 20px; // Modifie la taille du texte ici
    }
    .ant-statistic-content-suffix {
      font-size: 20px; // Modifie aussi la taille du suffixe ici
    }
    .anticon {
      font-size: 20px; // Modifie la taille de l'icône ici
    }
  `,
}));

function Parti() {
  const { listName, yearSelected } = useParams();
  const [data, setData] = useState<Candidate[]>([]);
  const [previousYearData, setPreviousYearData] = useState<Candidate[]>([]);
  const [searchText, setSearchText] = useState("");
  const { styles } = useStyles();

  useEffect(() => {
    const partiLow = listName?.toLowerCase();
    fetch(`../../parti/${partiLow}/${partiLow}.json`)
      .then((response) => response.json())
      .then((data: PartiData) => {
        const combinedData = Object.keys(data).flatMap((year) =>
          year === yearSelected
            ? data[year].candidats.map((candidate, index) => ({
                ...candidate,
                key: `${year}-${index}`,
                Year: year,
              }))
            : []
        );
        setData(combinedData);

        if (yearSelected) {
          const previousYear = (parseInt(yearSelected) - 6).toString();
          const previousData =
            data[previousYear]?.candidats.map((candidate, index) => ({
              ...candidate,
              key: `${previousYear}-${index}`,
              Year: previousYear,
            })) || [];
          setPreviousYearData(previousData);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [listName, yearSelected]);

  const uniqueNames = Array.from(
    new Set(data.map((candidate) => candidate.Name))
  ).sort();

  const calculateVoteChange = (record: Candidate) => {
    const rankDifference = parseInt(record.ID) - parseInt(record.Rank);
    return rankDifference;
  };

  const calculateVoteDifference = (record: Candidate) => {
    const previousRecord = previousYearData.find(
      (prev) => prev.Name === record.Name
    );
    if (previousRecord) {
      return parseInt(record.Votes) - parseInt(previousRecord.Votes);
    }

    return parseInt(record.Votes);
  };

  const calculateVotePercentageChange = (record: Candidate) => {
    const previousRecord = previousYearData.find(
      (prev) => prev.Name === record.Name
    );
    if (previousRecord) {
      const previousVotes = parseInt(previousRecord.Votes);
      const currentVotes = parseInt(record.Votes);
      return ((currentVotes - previousVotes) / previousVotes) * 100;
    }
    return 100;
  };

  const calculateVotePercentagePercentageChange = (record: Candidate) => {
    const previousRecord = previousYearData.find(
      (prev) => prev.Name === record.Name
    );
    if (previousRecord) {
      const previousPercentage = parseFloat(previousRecord.Percentage);
      const currentPercentage = parseFloat(record.Percentage);
      return (
        ((currentPercentage - previousPercentage) / previousPercentage) * 100
      );
    }
    return parseFloat(record.Percentage);
  };

  const isNewCandidate = (record: Candidate) => {
    return !previousYearData.some((prev) => prev.Name === record.Name);
  };

  const filteredData = data.filter((candidate) =>
    candidate.Name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: TableColumnsType<Candidate> = [
    {
      title: "Position dans Liste",
      dataIndex: "ID",
      key: "ID",
      sorter: (a, b) => parseInt(a.ID) - parseInt(b.ID),
      render: (text) => <span className={styles.fontText}>{text}</span>,
    },
    {
      title: "Évolution Place % N° Liste",
      key: "voteChange",
      sorter: (a, b) => calculateVoteChange(a) - calculateVoteChange(b),
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
            suffix="place(s)"
            className={styles.statisticContent}
          />
        );
      },
    },
    {
      title: "NOM Prénom",
      dataIndex: "Name",
      key: "Name",
      showSorterTooltip: { target: "full-header" },
      sorter: (a, b) => a.Name.localeCompare(b.Name),
      sortDirections: ["ascend", "descend"],
      filters: [
        { text: "Nouveau sur la Liste", value: "Nouveau" },
        { text: "Présent éléction précédente", value: "Présent" },
        ...uniqueNames.map((name) => ({ text: name, value: name })),
      ],
      onFilter: (value, record) => {
        if (value === "Nouveau") {
          return isNewCandidate(record);
        }
        if (value === "Présent") {
          return !isNewCandidate(record);
        }
        return record.Name === value;
      },
      render: (text, record) => (
        <>
          {isNewCandidate(record) && <Tag color="green">Nouveau</Tag>}
          {<span className={styles.fontText}>{text}</span>}
        </>
      ),
    },
    {
      title: "Votes",
      dataIndex: "Votes",
      key: "Votes",
      defaultSortOrder: "descend",
      sorter: (a, b) => parseInt(a.Votes) - parseInt(b.Votes),
      render: (text) => <span className={styles.fontText}>{text}</span>,
    },
    {
      title: "Différence de Votes % Élection précédente",
      key: "voteDifference",
      sorter: (a, b) => calculateVoteDifference(a) - calculateVoteDifference(b),
      render: (text, record) => {
        const voteDifference = calculateVoteDifference(record);
        let valueStyle = {};
        let prefix = null;

        if (voteDifference > 0) {
          valueStyle = { color: "#3f8600" };
          prefix = <PlusOutlined />;
        } else if (voteDifference < 0) {
          valueStyle = { color: "#cf1322" };
          prefix = <MinusOutlined />;
        } else {
          valueStyle = { color: "#1890ff" };
        }

        if (isNewCandidate(record)) {
          valueStyle = {
            ...valueStyle,
            fontStyle: "italic",
          };
        }

        return (
          <Statistic
            value={Math.abs(voteDifference)}
            precision={0}
            valueStyle={valueStyle}
            prefix={prefix}
            suffix="voix"
            className={styles.statisticContent}
          />
        );
      },
    },
    {
      title: "Évolution Votes % Élection Précédente",
      key: "votePercentageChange",
      sorter: (a, b) =>
        calculateVotePercentageChange(a) - calculateVotePercentageChange(b),
      render: (text, record) => {
        const votePercentageChange = calculateVotePercentageChange(record);
        let valueStyle;
        let prefix = null;

        if (votePercentageChange > 0) {
          valueStyle = { color: "#3f8600" };
          prefix = <PlusOutlined />;
        } else if (votePercentageChange < 0) {
          valueStyle = { color: "#cf1322" };
          prefix = <MinusOutlined />;
        } else {
          valueStyle = { color: "#1890ff" };
        }
        if (isNewCandidate(record)) {
          valueStyle = {
            ...valueStyle,
            fontStyle: "italic",
          };
        }

        return (
          <Statistic
            value={Math.abs(votePercentageChange)}
            precision={2}
            valueStyle={valueStyle}
            prefix={prefix}
            suffix="%"
            className={styles.statisticContent}
          />
        );
      },
    },
    {
      title: "Pourcentage",
      dataIndex: "Percentage",
      key: "Percentage",
      sorter: (a, b) => parseFloat(a.Percentage) - parseFloat(b.Percentage),
      render: (text) => <span className={styles.fontText}>{text}%</span>,
    },

    {
      title: "Évolution Pourcentage % Élection Précédent",
      key: "votePercentagePercentageChange",
      sorter: (a, b) =>
        calculateVotePercentagePercentageChange(a) -
        calculateVotePercentagePercentageChange(b),
      render: (text, record) => {
        const votePercentageChange =
          calculateVotePercentagePercentageChange(record);
        let valueStyle;
        let prefix = null;

        if (votePercentageChange > 0) {
          valueStyle = { color: "#3f8600" };
          prefix = <PlusOutlined />;
        } else if (votePercentageChange < 0) {
          valueStyle = { color: "#cf1322" };
          prefix = <MinusOutlined />;
        } else {
          valueStyle = { color: "#1890ff" };
        }
        if (isNewCandidate(record)) {
          valueStyle = {
            ...valueStyle,
            fontStyle: "italic",
          };
        }

        return (
          <Statistic
            value={Math.abs(votePercentageChange)}
            precision={2}
            valueStyle={valueStyle}
            prefix={prefix}
            suffix="%"
            className={styles.statisticContent}
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
      <Card
        bordered={false}
        title={
          <Title level={1} style={{ textAlign: "center", marginTop: "20px" }}>
            {listName + " - " + yearSelected}
          </Title>
        }
      >
        <Input
          placeholder="Rechercher par nom"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 20 }}
        />
        {filteredData.length > 0 ? (
          <Table<Candidate>
            columns={columns}
            dataSource={filteredData}
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
