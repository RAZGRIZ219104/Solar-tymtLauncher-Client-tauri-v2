import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { Grid, Box, Divider } from "@mui/material";

import Multichainbtn from "../../components/store/Multichainbtn";
import Releasebtn from "../../components/store/Releasebtn";
import Platformbtn from "../../components/store/Platformbtn";
import Genrebtn from "../../components/store/Genre";
import Rankingbtn from "../../components/store/Ranking";
import StoreGameItems from "../../components/store/StoreGameItems";
import TypeBtn from "../../components/store/TypeBtn";

const Store = () => {
  const { t } = useTranslation();

  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const keyword = params.get("key");

  const [releaseDate, setReleaseDate] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [platform, setPlatform] = useState<string>("");
  const [rank, setRank] = useState<string>("");
  const [type, setType] = useState<string>("");

  return (
    <>
      <Grid item xs={12}>
        <Box className={"fs-60-bold white"}>{t("hom-2_store")}</Box>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            marginTop: "32px",
            paddingTop: "16px",
            paddingBottom: "24px",
          }}
        >
          {false && <Releasebtn releaseDate={releaseDate} setReleaseDate={setReleaseDate} />}
          {false && <Multichainbtn />}
          <Genrebtn genre={genre} setGenre={setGenre} />
          <Platformbtn platform={platform} setPlatform={setPlatform} />
          <Rankingbtn rank={rank} setRank={setRank} />
          <TypeBtn type={type} setType={setType} />
        </Grid>
        <Divider
          sx={{
            backgroundColor: "#FFFFFF1A",
          }}
        />
      </Grid>
      <Grid
        item
        xs={12}
        container
        sx={{
          display: "flex",
          marginTop: "32px",
        }}
      >
        <StoreGameItems releaseDate={releaseDate} genre={genre} platform={platform} rank={rank} type={type} keyword={keyword} />
      </Grid>
    </>
  );
};

export default Store;
