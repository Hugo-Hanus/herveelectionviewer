import { Layout } from "antd";

const { Footer } = Layout;

function CustomFooter() {
  return (
    <Footer
      style={{
        textAlign: "center",
        bottom: 0,
        width: "100%",
      }}
    >
      <p>
        Ce site a été crée par Hugo.H bénévolement.
        <br />
        <b>
          Ce site est utilisé uniquement à des fins informatives et aucun
          bénéfice n'est réalisé sur cette application.
        </b>
        <br />
        Aucun parti politique n'est mis en avant, tout est trié par ordre
        alphabétique.
        <br /> Les données sont publiques et proviennent des sites
        <a
          href="https://elections2024.wallonie.be/fr/resultats-chiffres?el=CG&id=CGM63035"
          target="_blank"
          rel="noopener noreferrer"
        >
          élections 2024
        </a>{" "}
        et
        <a
          href="https://elections2018.wallonie.be/fr/resultats-chiffres?el=CG&id=CGM63035"
          target="_blank"
          rel="noopener noreferrer"
        >
          élections 2018
        </a>{" "}
        qui sont la propriété de la <b>Wallonie</b>.
      </p>
    </Footer>
  );
}

export default CustomFooter;
