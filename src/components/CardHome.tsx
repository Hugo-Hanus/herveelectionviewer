import { ArrowDownOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";
import { ICard } from "../models/ICard";
import { IAn } from "../models/IAn";

function CardHome(card: ICard) {
  return (
    <Card bordered={false} title={card.title}>
      <Row>
        {card.annee.map((an: IAn) => (
          <Col xs={2}>
            <Statistic title={an.title} value={an.value} />
          </Col>
        ))}
        <Col xs={2}>
          <Statistic
            title="Pourcentage"
            value={-9.3}
            precision={2}
            valueStyle={{ color: "#cf1322" }}
            prefix={<ArrowDownOutlined />}
            suffix="%"
          />
        </Col>
      </Row>
    </Card>
  );
}

export default CardHome;
