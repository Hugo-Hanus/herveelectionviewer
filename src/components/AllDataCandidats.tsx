import { useEffect, useState } from "react";
import { Card, Table, Input, Skeleton } from "antd";
import type { TableColumnsType, TableProps } from "antd";
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
  parti: string;
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
    // background-color: #f0f0f0;  Couleur de fond pour 2018
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

function AllDataCandidats() {
  const [data, setData] = useState<Candidate[]>([]);
  const [searchText, setSearchText] = useState("");
  const { styles } = useStyles();

  useEffect(() => {
    const files = ["eph", "ps", "hdm"];
    const partyMapping: { [key: string]: string } = {
      eph: "EPH",
      ps: "PS",
      hdm: "HDM",
    };

    const fetchData = async () => {
      try {
        const allCandidates: Candidate[] = [];

        for (const file of files) {
          const response = await fetch(`../../parti/${file}/${file}.json`);
          const data: PartiData = await response.json();

          Object.keys(data).forEach((year) => {
            const totalVotes = data[year].candidats.reduce(
              (acc, candidate) => acc + parseInt(candidate.Votes),
              0
            );

            data[year].candidats.forEach((candidate, index) => {
              const percentage =
                totalVotes > 0
                  ? ((parseInt(candidate.Votes) / totalVotes) * 100).toFixed(2)
                  : "0.00";

              allCandidates.push({
                ...candidate,
                key: `${file}-${year}-${index}`,
                Year: year,
                parti: partyMapping[file],
                Percentage: percentage,
              });
            });
          });
        }

        setData(allCandidates);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const uniqueNames = Array.from(
    new Set(data.map((candidate) => candidate.Name))
  ).sort();

  const filteredData = data.filter((candidate) =>
    candidate.Name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: TableColumnsType<Candidate> = [
    {
      title: "Position Global",
      dataIndex: "Position",
      key: "position",
      render: (text, record) => {
        const position =
          data
            .sort((a, b) => parseInt(b.Votes) - parseInt(a.Votes))
            .findIndex((candidate) => candidate.Votes === record.Votes) + 1;

        return <span className={styles.fontText}>{position}</span>;
      },
      sorter: (a, b) => {
        return parseInt(b.Votes) - parseInt(a.Votes);
      },
    },
    {
      title: "Parti",
      dataIndex: "parti",
      key: "parti",
      sorter: (a, b) => a.parti.localeCompare(b.parti),
      render: (text, record) => (
        <span className={styles.fontText}>{record.parti}</span>
      ),
    },
    {
      title: "Position dans Liste",
      dataIndex: "ID",
      key: "ID",
      sorter: (a, b) => parseInt(a.ID) - parseInt(b.ID),
      render: (text) => <span className={styles.fontText}>{text}</span>,
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
        return record.Name === value;
      },
      render: (text, record) => <span className={styles.fontText}>{text}</span>,
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
      title: "Pourcentage",
      dataIndex: "Percentage",
      key: "Percentage",
      sorter: (a, b) => parseFloat(a.Percentage) - parseFloat(b.Percentage),
      render: (text) => <span className={styles.fontText}>{text}%</span>,
    },
    {
      title: "Année",
      dataIndex: "Year",
      key: "Year",
      sorter: (a, b) => parseInt(a.Year) - parseInt(b.Year),
      render: (text) => <span className={styles.fontText}>{text}</span>,
    },
  ];

  const onChange: TableProps<Candidate>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => "";

  const rowClassName = (record: Candidate) => {
    return record.Year === "2018" ? styles.row2018 : styles.row2024;
  };

  return (
    <>
      <Card
        bordered={false}
        title={
          <Title level={1} style={{ textAlign: "center", marginTop: "20px" }}>
            {"Toutes les données"}
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
          <Skeleton />
        )}
      </Card>
      <CustomFooter />
    </>
  );
}

export default AllDataCandidats;
