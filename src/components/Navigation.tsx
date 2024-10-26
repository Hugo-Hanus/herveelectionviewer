import { BookFilled, HomeFilled, ProfileFilled } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navigation() {
  type MenuItem = Required<MenuProps>["items"][number];

  const navigate = useNavigate();

  const items: MenuItem[] = [
    {
      label: "Accueil",
      key: "",
      icon: <HomeFilled />,
    },
    {
      label: "2024",
      key: "2024",
      icon: <BookFilled />,
      children: [
        {
          type: "group",
          label: "Global",
          children: [
            { label: "2024", key: "2024" },
            {
              label: "2024 Tout les candidats",
              key: "2024 Tout les candidats",
            },
          ],
        },
        {
          type: "group",
          label: "Parti",
          children: [
            { label: "EPH", key: "EPH" },
            { label: "HDM", key: "HDM" },
            { label: "PS", key: "PS" },
          ],
        },
      ],
    },
    {
      label: "2018",
      key: "2018",
      icon: <BookFilled />,
      children: [
        {
          type: "group",
          label: "Global",
          children: [
            { label: "2018", key: "2018" },
            {
              label: "2018 Tout les candidats",
              key: "2018 Tout les candidats",
            },
          ],
        },
        {
          type: "group",
          label: "Parti",
          children: [
            { label: "EPH", key: "EPH" },
            { label: "HDM", key: "HDM" },
            { label: "PS", key: "PS" },
          ],
        },
      ],
    },
    {
      label: "Toutes les données",
      key: "app",
      icon: <ProfileFilled />,
    },
  ];
  const [current, setCurrent] = useState("link");

  const onClick: MenuProps["onClick"] = (e) => {
    console.log(e.keyPath);
    if (e.key === "") {
      navigate("/");
    }
    if (e.keyPath[0] === e.keyPath[1]) {
      navigate(`/Annee/${e.key}`);
    } else if (e.keyPath[0].substring(0, 4) === e.keyPath[1]) {
      navigate(`/AllCandidats/${e.keyPath[1]}`);
    } else if (!isNaN(parseInt(e.keyPath[1], 10))) {
      navigate(`/List/${e.keyPath[1]}/${e.keyPath[0]}`);
    } else {
    }
    setCurrent(e.keyPath[1]);
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
}

export default Navigation;
