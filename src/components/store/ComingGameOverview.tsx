import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import GameOverViewPlatform from "./GameOverViewPlatform";
import GameOverViewNative from "./GameOverViewNative";
import GameOverViewSystemRequirement from "./GameOverViewSystemRequirement";
import GameOverViewReleaseName from "./GameOverViewReleaseName";
import GameOverViewTags from "./GameOverViewTags";
import GameOverViewShortDescription from "./GameOverViewShortDescription";
import GameOverViewFollow from "./GameOverViewFollow";
import GameOverViewSwiper from "./GameOverViewSwiper";
import GameOverViewHeader from "./GameOverViewHeader";

import { Grid, Box } from "@mui/material";

import { getComingGameList } from "../../features/store/ComingGameListSlice";

import SwitchBtnGameview from "./SwitchButton";
import AnimatedComponent from "../AnimatedComponent";

import storeStyles from "../../styles/StoreStyles";
import { IGameList } from "../../types/GameTypes";

import gradient1 from "../../assets/main/gradient-gameoverview.svg";
import GameOverViewJumbo from "./GameOverViewJumbo";
import GameOverViewDescription from "./GameOverViewDescription";

const ComingGameOverview = () => {
  const { gameid } = useParams();

  const [src, setSrc] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const comingGameListStore: IGameList = useSelector(getComingGameList);

  const game = useMemo(() => comingGameListStore?.games?.find((game) => game?._id === gameid), [comingGameListStore]);

  const classes = storeStyles();

  return (
    <>
      <Grid item xs={12} container className={classes.gameoverview_container} mb={"32px"}>
        <AnimatedComponent threshold={0}>
          <img src={gradient1} style={{ position: "absolute", right: 0, top: 0 }} />
          <Grid item xs={12} display={"flex"} justifyContent={"space-between"} alignItems={"center"}>
            <Grid item xs={12} flexDirection={"row"} justifyContent={"space-between"} display={"flex"} paddingRight={"20px"}>
              <GameOverViewHeader game={game} />
            </Grid>
          </Grid>
          <Grid item xs={12} container display={"flex"} justifyContent={"space-between"} marginTop={"32px"}>
            <Grid item paddingRight={"25px"} sx={{ width: "calc(100% - 320px)" }}>
              <Grid item xs={12}>
                <GameOverViewJumbo type={type} src={src} />
              </Grid>
              <Grid
                xs={12}
                sx={{
                  marginTop: "12px",
                  display: "flex",
                  justifyContent: "left",
                  overflow: "hidden",
                }}
              >
                <GameOverViewSwiper
                  game={game}
                  currentImageIndex={currentImageIndex}
                  setSrc={setSrc}
                  setType={setType}
                  setCurrentImageIndex={setCurrentImageIndex}
                />
              </Grid>

              <Grid item xs={12} marginTop={"32px"}>
                <GameOverViewDescription game={game} />
              </Grid>
            </Grid>
            <Grid item sx={{ width: "320px" }}>
              <GameOverViewShortDescription game={game} />
              <GameOverViewTags game={game} />
              <GameOverViewPlatform game={game} />
              <GameOverViewNative game={game} />
              <GameOverViewReleaseName game={game} />
              <GameOverViewSystemRequirement game={game} />
              <GameOverViewFollow game={game} />
            </Grid>
          </Grid>
        </AnimatedComponent>
      </Grid>
    </>
  );
};

export default ComingGameOverview;